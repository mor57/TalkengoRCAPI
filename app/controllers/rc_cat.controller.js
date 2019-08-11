//imports the rc_cat model
const rc_cat = require("../models/rc_cat.model");

// Create and Save a new rc_cat
exports.create = (req, res) => {
  // Validate request
  if (!req.body.cattitle) {
    return res.status(400).send({
      message: "cat content can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }

  // Create a rc_cat
  const cat = new rc_cat({
    cattitle: req.body.cattitle || "Untitled cat",
    type: req.body.type,
    priority: req.body.priority,
    role: req.body.role
  });

  // Save rc_cat in the database
  cat
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the cat."
      });
    });
};

// Retrieve and return all rc_cat from the database.
exports.findAll = (req, res) => {
  rc_cat
    .find()
    .exec(function (err, rc_cat) {
      if (err) {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "cats not found with given name "
          });
        }
        return res.status(500).send({
          message: "Error retrieving cats with given Id "
        });
      }

      res.send(rc_cat);
    });
};

// Find a single rc_cat with a Id
exports.findOne = (req, res) => {
  rc_cat
    .findById(req.params.Id)
    .then(rc_cat => {
      if (!rc_cat) {
        return res.status(404).send({
          message: "cat not found with id " + req.params.Id
        });
      }
      res.send(rc_cat);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "cat not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Error retrieving rc_cat with id " + req.params.Id
      });
    });
};

// Update a rc_cat identified by the Id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.cattitle) {
    return res.status(400).send({
      message: "cattitle can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }
  // Find rc_cat and update it with the request body
  if (req.body.trashstatus == 2) {
    rc_cat
      .findById(req.params.catId).then(cat_del => {
        cat_del.trashstatus = 0;
        cat_del.save();
        res.send({ message: "cat undo trashed successfully!" });
      });
  } else {
    rc_cat
      .findByIdAndUpdate(
        req.params.catId,
        {
          cattitle: req.body.cattitle || "Untitled cat",
          type: req.body.type,
          priority: req.body.priority,
          role: req.body.role
        },
        { new: true }
      )
      .then(cat => {
        if (!cat) {
          return res.status(404).send({
            message: "cat not found with id " + req.params.Id
          });
        }
        res.send(cat);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "cat not found with id " + req.params.Id
          });
        }
        return res.status(500).send({
          message: "Error updating cat with id " + req.params.Id
        });
      });
  }
};

// Delete a rc_cat with the specified Id in the request
exports.delete = (req, res) => {
  rc_cat
    .findById(req.params.catId).then(cat_del => {
      if (cat_del.trashstatus == 1) {
        // rc_cat
        //   .findOneAndDelete(req.params.catId)
        cat_del.remove().then(cat => {
          if (!cat) {
            return res.status(404).send({
              message: "cat not found with id " + req.params.Id
            });
          }
          res.send({ message: "cat deleted successfully!" });
        })
          .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
              return res.status(404).send({
                message: "cat not found with id " + req.params.Id
              });
            }
            return res.status(500).send({
              message: "Could not delete cat with id " + req.params.Id
            });
          });
      } else {
        cat_del.trashstatus = 1;
        cat_del.save();
        res.send({ message: "cat trashed successfully!" });
      }
    });
};
