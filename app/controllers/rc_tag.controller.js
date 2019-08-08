//imports the rc_tag model
const rc_tag = require("../models/rc_tag.model");

// Create and Save a new rc_tag
exports.create = (req, res) => {
  // Validate request
  if (!req.body.tagtitle) {
    return res.status(400).send({
      message: "tag content can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }

  // Create a rc_tag
  const tag = new rc_tag({
    tagtitle: req.body.tagtitle || "Untitled tag",
    priority: req.body.priority,
    role: req.body.role
  });

  // Save rc_tag in the database
  tag
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the tag."
      });
    });
};

// Retrieve and return all rc_tag from the database.
exports.findAll = (req, res) => {
  rc_tag
    .find()
    // .find({ user: req.user.id })
    // .populate('user')
    // .then(rc_tag => {
    //     res.send(rc_tag);
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while retrieving rc_tag."
    //     });
    // });
    .exec(function (err, rc_tag) {
      if (err) {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Tags not found with given name "
          });
        }
        return res.status(500).send({
          message: "Error retrieving Tags with given Id "
        });
      }

      res.send(rc_tag);
    });
};

// Find a single rc_tag with a Id
exports.findOne = (req, res) => {
  rc_tag
    .findById(req.params.Id)
    // .populate('user')
    // .populate("user", "username")
    .then(rc_tag => {
      if (!rc_tag) {
        return res.status(404).send({
          message: "tag not found with id " + req.params.Id
        });
      }
      res.send(rc_tag);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "tag not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Error retrieving rc_tag with id " + req.params.Id
      });
    });
};

// Update a rc_tag identified by the Id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.tagtitle) {
    return res.status(400).send({
      message: "tagtitle can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }
  // Find rc_tag and update it with the request body
  rc_tag
    .findByIdAndUpdate(
      req.params.tagId,
      {
        tagtitle: req.body.tagtitle || "Untitled tag",
        priority: req.body.priority,
        role: req.body.role
      },
      { new: true }
    )
    .then(tag => {
      if (!tag) {
        return res.status(404).send({
          message: "tag not found with id " + req.params.Id
        });
      }
      res.send(tag);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "tag not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Error updating tag with id " + req.params.Id
      });
    });
};

// Delete a rc_tag with the specified Id in the request
exports.delete = (req, res) => {
  rc_tag
    .findOneAndDelete(req.params.tagId)
    .then(rc_tag => {
      if (!rc_tag) {
        return res.status(404).send({
          message: "tag not found with id " + req.params.Id
        });
      }
      res.send({ message: "tag deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "tag not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Could not delete tag with id " + req.params.Id
      });
    });
};
