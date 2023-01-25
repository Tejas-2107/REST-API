const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/wikidb", { useNewUrlParser: true });

const itemsSchema = {
  title: String,
  content: String,
};

const article = mongoose.model("article", itemsSchema);

app.route("/articles")

  .get(function (req, res) {
    article.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })

  .post(function (req, res) {
    let title = req.body.title;
    let content = req.body.content;

    const newArticle = new article({
      title: title,
      content: content,
    });

    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("done post method");
      }
    });
  })

  .delete(function (req, res) {
    article.deleteMany({}, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("deleted");
      }
    });
  });

///request targeting a specific article

app.route("/articles/:articleTitle")
.get(function(req, res){
 
    article.findOne({title: req.params.articleTitle}, function(err, result){
       if(result == null){
        res.sendFile(__dirname + "/images/Error400.png");
       }

       else{
        res.send(result);
       }
    })

})
.put(function(req, res){
article.updateOne(
    { title: req.params.articleTitle }, 
    { title:req.body.title, content: req.body.content },
    { overwrite: true },
    function(err ,result){
      if(err){
        res.send(err);
      }
      else{
        res.send("hey updated");
      }
});
})
.patch(function(req, res){
    article.updateOne(
    { title: req.params.articleTitle },
    { $set:  req.body },
    function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("hey patch");
        }
    }
        
    )
})
.delete(function(req,res){
    article.deleteOne({title: req.body.title},
    function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send("deleted");
        }
    }  

        )
})

app.listen("3000", function (req, res) {
  console.log("hey started");
});

