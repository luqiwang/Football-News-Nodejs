var Story = require("../models/story");
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");

router.get("/", function(req, res){
    // Get all stories from DB
    Story.find({}, function(err, allStories){
       if(err){
           console.log(err);
       } else {
          res.render("stories/index",{stories:allStories});
       }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("stories/new"); 
});

// SHOW - shows more info about one story
router.get("/:id", function(req, res){
    //find the story with provided ID
    Story.findById(req.params.id).populate("comments").exec(function(err, foundStory){
        if(err){
            console.log(err);
        } else {
            console.log(foundStory)
            //render show template with that story
            res.render("stories/show", {story: foundStory});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to stories array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newStory = {name: name, image: image, description: desc, author:author}
    // Create a new story and save to DB
    Story.create(newStory, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to stories page
            console.log(newlyCreated);
            res.redirect("/stories");
        }
    });
});

router.get("/:id/edit", middleware.checkStoryOwnership, function(req, res) {
    Story.findById(req.params.id, function(err, foundStory){
        res.render("stories/edit", {story: foundStory});
        
    })
})


router.put("/:id",middleware.checkStoryOwnership, function(req,res){
    Story.findByIdAndUpdate(req.params.id, req.body.story, function(err, updatedStory){
        if(err){
            res.redirect("/stories");
        } else {
            res.redirect("/stories/" + req.params.id);
        }
    })
})


// DESTROY STORY ROUTE
router.delete("/:id",middleware.checkStoryOwnership, function(req, res){
   Story.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/stories");
      } else {
          res.redirect("/stories");
      }
   });
});
   
module.exports = router;