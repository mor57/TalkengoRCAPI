//imports the rc_format model
const rc_format = require("../models/rc_format.model");

// Create and Save a new rc_format
exports.create = (req, res) => {
  // Validate request
  if (!req.body.formattitle) {
    return res.status(400).send({
      message: "format content can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }

  // Create a rc_format
  const format = new rc_format({
    formattitle: req.body.formattitle || "Untitled format",
    type: req.body.type,
    priority: req.body.priority,
    role: req.body.role
  });

  // Save rc_format in the database
  format
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the format."
      });
    });
};

// Retrieve and return all rc_format from the database.
exports.findAll = (req, res) => {
  rc_format
    .find()
    .exec(function (err, rc_format) {
      if (err) {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "formats not found with given name "
          });
        }
        return res.status(500).send({
          message: "Error retrieving formats with given Id "
        });
      }

      res.send(rc_format);
    });
};

// Find a single rc_format with a Id
exports.findOne = (req, res) => {
  rc_format
    .findById(req.params.Id)
    .then(rc_format => {
      if (!rc_format) {
        return res.status(404).send({
          message: "format not found with id " + req.params.Id
        });
      }
      res.send(rc_format);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "format not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Error retrieving rc_format with id " + req.params.Id
      });
    });
};

// Update a rc_format identified by the Id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.formattitle) {
    return res.status(400).send({
      message: "formattitle can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }
  // Find rc_format and update it with the request body
  if (req.body.trashstatus == 2) {
    rc_format
      .findById(req.params.formatId).then(format_del => {
        format_del.trashstatus = 0;
        format_del.save();
        res.send({ message: "format undo trashed successfully!" });
      });
  } else {
    rc_format
      .findByIdAndUpdate(
        req.params.formatId,
        {
          formattitle: req.body.formattitle || "Untitled format",
          type: req.body.type,
          priority: req.body.priority,
          role: req.body.role
        },
        { new: true }
      )
      .then(format => {
        if (!format) {
          return res.status(404).send({
            message: "format not found with id " + req.params.Id
          });
        }
        res.send(format);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "format not found with id " + req.params.Id
          });
        }
        return res.status(500).send({
          message: "Error updating format with id " + req.params.Id
        });
      });
  }
};

// Delete a rc_format with the specified Id in the request
exports.delete = (req, res) => {
  rc_format
    .findById(req.params.formatId).then(format_del => {
      if (format_del.trashstatus == 1) {
        // rc_format
        //   .findOneAndDelete(req.params.formatId)
        format_del.remove().then(format => {
          if (!format) {
            return res.status(404).send({
              message: "format not found with id " + req.params.Id
            });
          }
          res.send({ message: "format deleted successfully!" });
        })
          .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
              return res.status(404).send({
                message: "format not found with id " + req.params.Id
              });
            }
            return res.status(500).send({
              message: "Could not delete format with id " + req.params.Id
            });
          });
      } else {
        format_del.trashstatus = 1;
        format_del.save();
        res.send({ message: "format trashed successfully!" });
      }
    });
};
