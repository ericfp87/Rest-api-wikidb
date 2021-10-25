const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content:String,
};

const Article = mongoose.model("Article", articleSchema);
////////////Requests todos os Articles///////////////////
app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if (!err) {
            res.send(foundArticles);
         }
        else {
            res.send(err);
        }
        
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save(function(err){
        if (!err){
            res.send("Sucesso");
        } else {
            res.send(err);
        }
    });
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Deletado");
        } else {
            res.send(err);
        }
    });
});

///////////////Request Article especifico ///////////////

app.route("/articles/:articleTitle")

// req.params.articleTitle = "jQuery"

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("Sem Artigos")
        }
    });
})

.put(function(req, res){
    Article.updateOne({title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
        if (!err){
            res.send("Alterado");
        }
    });
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},

        function(err){
            if (!err){
                res.send("Alterado");
        }
    });
})


.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if (!err){
            res.send("Deletado");
        } else {
            res.send("Sem Artigos")
        }
    });
})




app.listen(3000, function(){
    console.log("Server iniciou na porta 3000");
});
