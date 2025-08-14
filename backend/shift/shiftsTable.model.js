const mongoose = require("mongoose");

const shiftsTableSchema = new mongoose.Schema({
    group: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    rows: {
        type: [Object],
        default: []
    }
});

module.exports = mongoose.model("ShiftsTable", shiftsTableSchema);
