//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to db
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true,useUnifiedTopology: true});

//create schema
const articleSchema = {
  title: String,
  content: String
}

//create Model
const Article = mongoose.model("Article",articleSchema);

//////////////////Request targeting all articles/////////////////////

app.route("/articles")
.get((req,res)=>{
  Article.find((err,foundArticles)=>{
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post((req,res)=>{

//create document
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save((err)=>{
    if(!err){
      res.send("Succesfully added a new article");
    }else{
      res.send(err);
    }
  });

})
.delete((req,res)=>{
  Article.deleteMany((err)=>{
    if(!err){
      res.send("Succesfully deleted all the artices");
    }else{
      res.send(err);
    }
  });
});

//////////////////Request targeting specific article/////////////////////


app.route("/articles/:articlesTitle")

.get((req,res)=>{
  Article.findOne({title:req.params.articlesTitle},(err,foundArticle)=>{
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article matching that title was found");
    }
  });
})

//replaces the entire document into new document
.put((req,res)=>{
  Article.update(
    {title:req.params.articlesTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    (err)=>{
      if(!err){
        res.send("Succesfully updated article");
      }else{
        res.send(err);
      }
    });
})

//updates only the provided info 

.patch((req,res)=>{
  Article.update(
    {title:req.params.articlesTitle},
    {$set:req.body},
    (err)=>{
      if(!err){
        res.send("Succesfully updated the article");
      }else{
        res.send(err);
      }
    });
})

.delete((req,res)=>{
  Article.deleteOne(
    {title:req.params.articlesTitle},
    (err)=>{
      if(!err){
        res.send("Succesfully deleted the artice");
      }else{
        res.send(err);
      }
    }
  )
});



app.listen(3000,()=>{
  console.log("Server started on port 3000");
})
