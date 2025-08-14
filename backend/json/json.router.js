const fs = require("fs");
const path = require("path");
const { Router } = require("express");

const router = Router()


router.get("/holidays", (req, res) => {
    const filePath = path.join(__dirname, "holidays.json")

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) throw err;

        res.json(JSON.parse(data))
    })
})

module.exports = router;