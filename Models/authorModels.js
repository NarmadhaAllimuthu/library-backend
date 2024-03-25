
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    }
    ,dob:{
        type:String,
        require:true
    },description:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const Author = mongoose.model("Author",authorSchema);

module.exports = {Author};







