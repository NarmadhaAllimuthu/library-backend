

const mongoose = require("mongoose");



const bookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true
    },
   bookTitle: {
        type: String,
        required: true,
        // unique: true
    },
    
  
    authorName: {
        type: String,
        required: true
    },
    bookNumber: {
        type: String,
        required: true,
        unique:true
    },
    publishDate: {
        type: String,
        required: true
    },bookImg:{
        type:String,
        required:true
    }
    ,
    createdAt: {
        type: String,
        default : new Date().toLocaleString()
    }
});


const Book= mongoose.model('Book', bookSchema);

module.exports = {Book};




























