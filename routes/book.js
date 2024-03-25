

var express = require('express');
const {  Book } = require('../Models/bookModels');
var router = express.Router();
var mongoose = require('mongoose');
const auth = require('../authorization');

try{
    mongoose.connect('mongodb://localhost:27017/libraryManagement');
    console.log("Database Connected");
}
catch(err){
    console.log("Error in connecting db",err);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post("/createBooks",auth, async (req, res) => {

    try {
        const existingbook = await Book.findOne({ bookNumber: req.body.bookNumber });

        if (existingbook) {
            return res.status(400).json({ error: "Already existing Book" });
        }
        const { bookTitle,authorName,bookNumber,publishDate,bookImg} = req.body;

        const bookId = "A1P" + (await Book.countDocuments() + 1);
        // const bookSellingPrice =parseInt( bookBasePrice )+ 2;

        const newbook = new Book({
            bookId,
            bookTitle,
           authorName,
           bookNumber,
            publishDate,
            bookImg
        });
        const savedbook = await newbook.save();
        res.status(201).send("New book Added Successfully ");
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get("/getAllBooks",auth, async (req, res) => {
    try {
        const books = await Book.find();
        console.log(books);
        if(books.length == 0){
            res.status(404).json({ error: "No books found" })
        } else{
            console.log(books);
            res.setHeader("Cache-Control", "no-store");
            res.status(200).json(books);
    }
     
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);


router.get("/getBookToEdit/:id",auth, async (req, res) => {
    try {
        const book = await Book.find({_id:req.params.id});
        // console.log(book)
        if (book == null) {
            res.status(404).json({ error: "book not found" })
        } else {
            res.status(200).json(book);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/editbook/:id",auth, async (req, res) => {
    try {
        

        // Check if the new email already exists in the database
        const existingbook = await Book.findOne({ _id: (req.params.id) });
        // console.log(existingbook)
        if (existingbook) {
            // console.log(req.body)
            const updatebook = await Book.findOneAndUpdate({ _id: existingbook._id },{ $set: req.body },{ new: true });
            // console.log(updatebook)
            return res.status(200).send("Updated Successfully !");

        }


        else if (!existingbook) {
            return res.status(404).json({ error: "book not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});







module.exports = router;







