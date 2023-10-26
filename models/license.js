const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    numberPlate: { type: String, required: true, Uppercare : true},
    entryLocation: { type: String, required: true },
    exitLocation: { type: String},
    toll: Number,
});

licenseSchema.pre('save', function (next) {
    const regex = /^[A-Z]{3}-[0-9]{3}$/;
    const isMatch = regex.test(this.numberPlate);
    const error = new Error ('invalide formate and make sure all aphabates are in uppercase');
    isMatch ? next(): next(error);
})

const License = mongoose.model('License', licenseSchema)
module.exports = License;