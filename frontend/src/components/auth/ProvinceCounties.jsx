import { useState, useEffect } from 'react'
import { MenuItem, TextField } from '@mui/material'

import { useProvinceCounties } from "../../api/json.api"
import { textFieldStyle } from '../../styles/globalStyles'

export default function ProvinceCounties({ 
  values, handleChange, handleBlur, touched, errors, preferDark 
}) {
  const [provincesData, setProvincesData] = useState(null)
  const [provinces, setProvinces] = useState([])
  const [counties, setCounties] = useState([])
  const { data, isLoading } = useProvinceCounties()

  useEffect(() => {
    if(!isLoading && data)
      setProvincesData(data)
  }, [data, isLoading])

  useEffect(() => {
    if(provincesData){
      setProvinces([ ...provincesData.map(pData => pData.province) ])
    }
  }, [provincesData])

  useEffect(() => {
    if(provincesData && values.province){
      setCounties([ ...provincesData.find(pData => pData.province === values.province).counties ])
    }
  }, [values.province])
  
  return (
    <>
      {provinces.length > 0 && (
        <TextField
          fullWidth
          select
          label="استان"
          name='province'
          value={values.province}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.province && Boolean(errors.province)}
          helperText={touched.province && errors.province}
          sx={{ mb: 2, ...textFieldStyle(preferDark) }}
        >
          {provinces.map((province, index) => (
            <MenuItem key={index} value={province}>
              {province}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        fullWidth
        select
        label="شهرستان"
        name='county'
        value={values.county}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.county && Boolean(errors.county)}
        helperText={touched.county && errors.county}
        sx={{ mb: 2, ...textFieldStyle(preferDark) }}
      >
        {counties.length > 0 
        ? counties.map((county, index) => (
            <MenuItem key={index} value={county}>
              {county}
            </MenuItem>
          ))
        : (
          <MenuItem value="">
            استان خود را انتخاب کنید
          </MenuItem>
        )}
      </TextField>
    </>
  )
}

