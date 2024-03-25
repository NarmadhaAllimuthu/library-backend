

const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
    readerId: {
        type: String,
        required: true,
    },
    readerName: {
        type: String,
        required: true,
    },
    readerAddress: {
        type: String,
        required: true,
    },
    readerContact: {
        type: String,
        required: true,
        unique: true,
    },
});



const Reader = mongoose.model('reader', readerSchema);

module.exports = {Reader};






















