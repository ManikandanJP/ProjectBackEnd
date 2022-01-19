const Category = require("../models/category");

// Read Category :

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB"
      });
    }
    req.category = cate;
    next();
  });
};

// Create Category :

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save category in DB"
      });
    }
    res.json({ category });
  });
};

// update Category :

exports.updateCategory = (req, res) =>{
    const category = req.category;
    category.name = req.body.name;
    category.save((err , updatedcategory) =>{
        if (err) {
            return res.status(400).json({
              error: "Failed to update Category"
            });
          }
          res.json({ updatedcategory });
        });        
}

// delete Category 

exports.removeCategory = (req, res) =>{
    const category = req.category;
    category.remove((err, removedcategory) =>{
         if(err || ! removedcategory) {
             return res.status(404).json({
                 error : "Failed to delete this Category"
             })
         }
         res.json({
             message : "Sucessfully Deleted"
         });
    })
}

exports.getAllCategory = (res, req) => {
/*    Category.find().exec((err, category) => {
        if (err) {
          return res.status(400).json({
            error: " No Categories Found in DB",
          });
        }
        res.json(category);
      });
*/      
}


/*
{"category":{"_id":"61e859076877c31a7a5072e3","name":"summer","createdAt":"2022-01-19T18:31:35.163Z","updatedAt":"2022-01-19T18:31:35.163Z","__v":0}} */
/*{"category":{"_id":"61e85a658b3a321ae3139812","name":"Winter","createdAt":"2022-01-19T18:37:25.074Z","updatedAt":"2022-01-19T18:37:25.074Z","__v":0}} */