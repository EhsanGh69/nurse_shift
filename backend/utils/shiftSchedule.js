const fs = require("fs")
const path = require("path")
const moment = require("jalali-moment")
const { uniq } = require("lodash")


const BASE_SHIFT_LETTERS = ['M', 'E', 'N', 'V']
const NO_H_SUFFIX_FOR = new Set(['OFF', 'V'])

const stripH = (k) => (typeof k === 'string' && k.endsWith('H')) ? k.slice(0, -1) : k
const isHolidayKey = (k) => (typeof k === 'string' && k.endsWith('H'))
const includesBase = (type, base) => {
  const s = stripH(type)
  return s.split('').includes(base)
}

function daysInJalaliMonth(year, month) {
  if (month >= 1 && month <= 6) return 31
  if (month >= 7 && month <= 11) return 30
  // month 12 -> 29 or 30 depends on leap (simple check via jalali-moment)
  try {
    const start = moment.from(`${year}/${String(month).padStart(2,'0')}/01`, 'fa', 'YYYY/MM/DD')
    const nextMonth = start.clone().add(1, 'jMonth')
    return nextMonth.diff(start, 'days')
  } catch (e) {
    // fallback: common rule
    return 30
  }
}

function normalizeKeyForOutput(baseKey, isHoliday) {
  // baseKey ممکنه composite مثل 'ME' یا single مثل 'M' باشه
  // اگر کلید در NO_H_SUFFIX_FOR باشه، H اضافه نمی‌کنیم
  const raw = String(baseKey)
  const core = stripH(raw)
  if (NO_H_SUFFIX_FOR.has(core)) return core // همیشه بدون H
  return isHoliday ? (core.endsWith('H') ? core : `${core}H`) : core
}

// جستجوی نزدیک‌ترین روز خالی که canPlace باشه، از ابتدا به اطراف
function findValidDayAround(emptyDays, startIndex, canPlaceFn, maxRadius = 5) {
  // try center, then expand +-1, +-2, ...
  if (startIndex < 0) startIndex = 0
  if (startIndex >= emptyDays.length) startIndex = emptyDays.length - 1
  if (canPlaceFn(emptyDays[startIndex])) return startIndex
  for (let r = 1; r <= Math.max(maxRadius, emptyDays.length); r++) {
    const left = startIndex - r
    const right = startIndex + r
    if (left >= 0 && canPlaceFn(emptyDays[left])) return left
    if (right < emptyDays.length && canPlaceFn(emptyDays[right])) return right
  } 
  // اگر هیچکدوم مناسب نبود، برمیگردونیم -1
  return -1
}

const holidaysFile = path.join(__dirname, '..', 'json', 'holidays.json')

exports.generateShiftSchedule = (shiftDays, stdShiftCount, year, month, favCS="") => {
  
  // خواندن تعطیلات محلی
  let holidays = []
  try {
    const raw = fs.readFileSync(holidaysFile, 'utf8')
    const all = JSON.parse(raw)
    holidays = all
      .filter(h => Number(h.year) === Number(year) && Number(h.month) === Number(month))
      .map(h => Number(h.day))
  } catch (err) {
    holidays = []
  }

  const totalDays = daysInJalaliMonth(year, month)
  const isHolidayMap = Array(totalDays + 1).fill(false)
  for (let d = 1; d <= totalDays; d++) {
    if (holidays.includes(d)) { isHolidayMap[d] = true; continue }
    try {
      const jm = moment.from(`${year}/${String(month).padStart(2,'0')}/${String(d).padStart(2,'0')}`, 'fa', 'YYYY/MM/DD')
      if (jm.day() === 5) isHolidayMap[d] = true // friday
    } catch (e) { /* ignore */ }
  }

  const schedule = Array(totalDays).fill(null)
  const result = {}
  result.OFF = Array.isArray(shiftDays.OFF) ? [...shiftDays.OFF] : []

  // نرمال‌سازی و قرار دادن مقادیر کاربر
  for (const [rawKey, arr] of Object.entries(shiftDays || {})) {
    if (!Array.isArray(arr)) continue
    const key = String(rawKey).toUpperCase()
    const core = stripH(key)
    // اعتبارسنجی: core باید از حروف مجاز تشکیل شده باشه یا OFF
    const validCore = core === 'OFF' || core.split('').every(ch => BASE_SHIFT_LETTERS.includes(ch))
    if (!validCore) continue
    for (const dRaw of arr) {
      const d = Number(dRaw)
      if (!(d >= 1 && d <= totalDays)) continue
      const holiday = !!isHolidayMap[d]
      // اگر کاربر خودش H داده بود (مثلا MH) آن را حفظ کن؛ اما اگر کلید از NO_H_SUFFIX_FOR باشه، H نزن
      let finalKey
      if (isHolidayKey(key)) {
        // کاربر خودش H زده؛ اما اگر core در NO_H_SUFFIX_FOR باشه باید H را حذف کنیم و فقط core بگذاریم
        finalKey = NO_H_SUFFIX_FOR.has(core) ? core : key
      } else {
        finalKey = normalizeKeyForOutput(core, holiday)
      }
      schedule[d - 1] = finalKey
      if (!result[finalKey]) result[finalKey] = []
      result[finalKey].push(d)
    }
  }

  // remaining from stdShiftCount
  const remaining = {}
  Object.entries(stdShiftCount || {}).forEach(([k,v]) => { remaining[k] = Math.max(0, Number(v) || 0) })

  // subtract user-provided counts
  for (const [k, arr] of Object.entries(result)) {
    const clean = stripH(k) // remove trailing H if present
    // decide if composite: core length>1 AND all letters are valid base letters
    const isComposite = typeof clean === 'string' && clean.length > 1 &&
                        clean.split('').every(ch => BASE_SHIFT_LETTERS.includes(ch))

    if (isComposite) {
      // اگر stdShiftCount شامل CS است، از CS کم کنیم
      if (remaining.CS !== undefined) {
        remaining.CS = Math.max(0, remaining.CS - arr.length)
      } else {
        // در غیر این صورت، برای هر حرف از core، از remaining حرف مربوط کم کن
        for (const ch of clean.split('')) {
          if (remaining[ch] !== undefined) {
            remaining[ch] = Math.max(0, remaining[ch] - arr.length)
          }
        }
      }
    } else {
      // single base (مثل M یا E یا OFF)
      if (remaining[clean] !== undefined) {
        remaining[clean] = Math.max(0, remaining[clean] - arr.length)
      } else {
        // اگر برای example کلید OFF یا V باشه و remaining نداشتیم، نادیده بگیر
      }
    }
  }

  console.log("remaining.CS -> ", remaining.CS)

  // empty days
  let emptyDays = []
  for (let i = 0; i < totalDays; i++) if (!schedule[i]) emptyDays.push(i + 1)

  // canPlace function for day number (1..totalDays)
  const canPlaceDay = (typeStr, day) => {
    const idx = day - 1
    if (schedule[idx]) return false
    if (includesBase(typeStr, 'N')) {
      const prev = schedule[idx - 1]
      if (prev && includesBase(prev, 'N')) return false
    }
    return true
  }

  // ---- place CS first but using spaced-selection strategy
  if ((remaining.CS || 0) > 0) {
    const cnt = remaining.CS
    const baseType = favCS || 'CS'
    // if not enough emptyDays, will place as many as possible
    if (emptyDays.length > 0) {
      // compute approximate evenly spaced indices in emptyDays
      const N = emptyDays.length
      const positions = []
      for (let i = 1; i <= cnt; i++) {
        // position in 0..N-1 (use rounding)
        const pos = Math.round(i * (N + 1) / (cnt + 1)) - 1
        positions.push(Math.max(0, Math.min(N - 1, pos)))
      }
      // for each target pos, find nearest valid emptyDay
      for (let targetPosIdx = 0; targetPosIdx < positions.length; targetPosIdx++) {
        if (emptyDays.length === 0) break
        const target = positions[targetPosIdx]
        const foundIndex = findValidDayAround(
          emptyDays,
          target,
          (dayNum) => canPlaceDay(baseType, dayNum),
          Math.max(5, Math.floor(N / Math.max(1, cnt)))
        )
        let chosenIdx = foundIndex
        // if not found near, try any valid
        if (chosenIdx === -1) {
          chosenIdx = emptyDays.findIndex(d => canPlaceDay(baseType, d))
        }
        if (chosenIdx === -1) break // none possible
        const day = emptyDays[chosenIdx]
        const finalType = normalizeKeyForOutput(baseType, isHolidayMap[day])
        schedule[day - 1] = finalType
        if (!result[finalType]) result[finalType] = []
        result[finalType].push(day)
        emptyDays.splice(chosenIdx, 1)
      }
    }
    remaining.CS = 0
  }

  // ---- place other shifts by descending remaining count
  const primaries = Object.keys(remaining)
    .filter(k => k !== 'CS' && k !== 'OFF')
    .sort((a,b) => (remaining[b]||0) - (remaining[a]||0))

  for (const t of primaries) {
    let count = remaining[t] || 0
    if (count <= 0) continue
    // try spaced placement as well for fairness
    if (emptyDays.length === 0) break
    const N = emptyDays.length
    const positions = []
    for (let i = 1; i <= count; i++) {
      const pos = Math.round(i * (N + 1) / (count + 1)) - 1
      positions.push(Math.max(0, Math.min(N - 1, pos)))
    }
    for (let pIdx = 0; pIdx < positions.length; pIdx++) {
      if (emptyDays.length === 0) break
      const target = positions[pIdx]
      const foundIndex = findValidDayAround(
        emptyDays,
        target,
        (dayNum) => canPlaceDay(t, dayNum),
        Math.max(5, Math.floor(N / Math.max(1, count)))
      )
      let chosenIdx = foundIndex
      if (chosenIdx === -1) {
        chosenIdx = emptyDays.findIndex(d => canPlaceDay(t, d))
      }
      if (chosenIdx === -1) break
      const day = emptyDays[chosenIdx]
      const finalType = normalizeKeyForOutput(t, isHolidayMap[day])
      schedule[day - 1] = finalType
      if (!result[finalType]) result[finalType] = []
      result[finalType].push(day)
      emptyDays.splice(chosenIdx, 1)
    }
    remaining[t] = 0
  }

  // remaining emptyDays -> OFF
  if (emptyDays.length) {
    for (const d of emptyDays) {
      schedule[d - 1] = 'OFF'
      if (!result.OFF) result.OFF = []
      result.OFF.push(d)
    }
    emptyDays = []
  }

  // map any CS key (edge) to favCS
  if (result.CS && result.CS.length && favCS) {
    for (const d of result.CS) {
      const fin = normalizeKeyForOutput(favCS, isHolidayMap[d])
      if (!result[fin]) result[fin] = []
      result[fin].push(d)
    }
    delete result.CS
  }

  // dedupe & sort, and ensure OFF and V have no H
  Object.keys(result).forEach(k => {
    // normalize keys that end with H but base is NO_H_SUFFIX_FOR
    const core = stripH(k)
    if (NO_H_SUFFIX_FOR.has(core) && k.endsWith('H')) {
      // move days to core key
      result[core] = (result[core] || []).concat(result[k])
      delete result[k]
    }
  })

  Object.keys(result).forEach(k => {
    result[k] = uniq(result[k] || []).sort((a,b) => a - b)
  })

  Object.keys(result).forEach(k => { if (!result[k] || result[k].length === 0) delete result[k] })

  return result

}

exports.getUserShiftCount = (userId, subs=[]) => {
  if(!subs.length) return false
  let userSub = null
  subs.forEach(sub => {
    const foundUser = sub.members.some(member => member.user.toString() === userId)
    if(foundUser) userSub = sub
  })
  if(!userSub) return false
  return userSub.shiftCount
}