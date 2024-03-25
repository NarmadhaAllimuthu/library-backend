var express = require('express');
const { Author } = require('../Models/authorModels');
const auth = require('../authorization');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/createAuthor" ,auth,async(req,res)=>{
    try{

        const existingauthor = await Author.findOne({authorName:req.body.authorName});
        if(existingauthor){
            res.status(400).json({message:"author already exists"});
        } else{
            const {authorName,dob,description} = req.body;

            const authorId = "C" + (await Author.countDocuments() + 1)+"ID";

            const newauthor = new Author({
                authorId,
                authorName,
                dob,
                description
               
            })
            const result = await newauthor.save();
            res.status(200).json({message:"author created successfully"});

        }

    }catch(err){

        console.log(err);
        res.status(500).json({message:err.message});
    
    }
});

router.get("/getAllAuthor",auth, async (req, res) => {
    try {
        const author = await Author.find();
        console.log(author);
        if(author.length == 0){
            res.status(404).json({ error: "No author found" })
        } else{
            console.log(author);
            res.setHeader("Cache-Control", "no-store");
            res.status(200).json(author);
    }
     
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);


router.get("/getAuthorToEdit/:id",auth, async (req, res) => {
    try {
        const author = await Author.find({_id:req.params.id});
        // console.log(author)
        if (author == null) {
            res.status(404).json({ error: "author not found" })
        } else {
            res.status(200).json(author);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/editAuthor/:id",auth, async (req, res) => {
    try {
        // Check if the new email already exists in the database
        const existingauthor = await Author.findOne({ _id: (req.params.id) });
        // console.log(existingauthor)
        if (existingauthor) {
            // console.log(req.body)
            const updateauthor = await Author.findOneAndUpdate({ _id: existingauthor._id },{ $set: req.body },{ new: true });
            // console.log(updateauthor)
            return res.status(200).send("Updated Successfully !");

        }


        else if (!existingauthor) {
            return res.status(404).json({ error: "author not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});









module.exports = router;









