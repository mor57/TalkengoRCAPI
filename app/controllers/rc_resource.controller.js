//imports the rc_resource model
const rc_resource = require("../models/rc_resource.model");

// Create and Save a new rc_resource
exports.create = (req, res) => {
  // Validate request
  if (!req.body.resourcetitle) {
    return res.status(400).send({
      message: "resource content can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }

  // Create a rc_resource
  const resource = new rc_resource({
    resourcetitle: req.body.resourcetitle || "Untitled resource",
    type: req.body.type,
    typestr: req.body.typestr,
    access: req.body.access,
    accesspermission: req.body.accesspermission,
    subject: req.body.subject,
    description: req.body.description,
    priority: req.body.priority,
    role: req.body.role,
  });
  req.body.levels.forEach(level => {
    resource.levels.push(level);
  });
  req.body.tags.forEach(tag => {
    resource.tags.push(tag);
  });
  req.body.cats.forEach(cat => {
    resource.cats.push(cat);
  });
  req.body.topics.forEach(topic => {
    resource.topics.push(topic);
  });
  if (!req.body.resourcefile) {
    console.log(req.body.resourcefile);
  }
  // Save rc_resource in the database
  resource
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the resource."
      });
    });
};

// Retrieve and return all rc_resource from the database.
exports.findAll = (req, res) => {
  rc_resource
    .find()
    .exec(function (err, rc_resource) {
      if (err) {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "resources not found with given name "
          });
        }
        return res.status(500).send({
          message: "Error retrieving resources with given Id "
        });
      }

      res.send(rc_resource);
    });
};

// Find a single rc_resource with a Id
exports.findOne = (req, res) => {
  rc_resource
    .findById(req.params.Id)
    .then(rc_resource => {
      if (!rc_resource) {
        return res.status(404).send({
          message: "resource not found with id " + req.params.Id
        });
      }
      res.send(rc_resource);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "resource not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Error retrieving rc_resource with id " + req.params.Id
      });
    });
};

// Update a rc_resource identified by the Id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.resourcetitle) {
    return res.status(400).send({
      message: "resourcetitle can not be empty"
    });
  }
  if (!(req.body.priority > 0)) {
    return res.status(400).send({
      message: "priority can not be empty"
    });
  }
  // Find rc_resource and update it with the request body
  if (req.body.trashstatus == 2) {
    rc_resource
      .findById(req.params.resourceId).then(resource_del => {
        resource_del.trashstatus = 0;
        resource_del.save();
        res.send({ message: "resource undo trashed successfully!" });
      });
  } else {
    rc_resource
      .findByIdAndUpdate(
        req.params.resourceId,
        {
          resourcetitle: req.body.resourcetitle || "Untitled resource",
          type: req.body.type,
          typestr: req.body.typestr,
          access: req.body.access,
          accesspermission: req.body.accesspermission,
          subject: req.body.subject,
          description: req.body.description,
          priority: req.body.priority,
          role: req.body.role,
        },
        { new: true }
      )
      .then(resource => {
        if (!resource) {
          return res.status(404).send({
            message: "resource not found with id " + req.params.Id
          });
        }
        resource.levels = [];
        req.body.levels.forEach(level => {
          resource.levels.push(level);
        });
        resource.tags = [];
        req.body.tags.forEach(tag => {
          resource.tags.push(tag);
        });
        resource.cats = [];
        req.body.cats.forEach(cat => {
          resource.cats.push(cat);
        });
        resource.topics = [];
        req.body.topics.forEach(topic => {
          resource.topics.push(topic);
        });
        resource
          .save()
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message: err.message || "Some error occurred while creating the resource."
            });
          });
        // res.send(resource);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "resource not found with id " + req.params.Id
          });
        }
        return res.status(500).send({
          message: "Error updating resource with id " + req.params.Id
        });
      });
  }
};

// Update a rc_resource identified by the Id in the request
exports.updateFile = (req, res) => {
  // Validate Request
  if (!req.params.resourceId) {
    return res.status(400).send({
      message: "Id can not be empty"
    });
  }
  // Find rc_resource and update it with the request body
  rc_resource
    .findByIdAndUpdate(
      req.params.resourceId,
      {
        typestr: req.file.path,
      },
      { new: true }
    )
    .then(resource => {
      if (!resource) {
        return res.status(404).send({
          message: "resource not found with id " + req.params.Id
        });
      }
      res.send(resource);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "resource not found with id " + req.params.Id
        });
      }
      return res.status(500).send({
        message: "Error updating resource with id " + req.params.Id
      });
    });
};

// Delete a rc_resource with the specified Id in the request
exports.delete = (req, res) => {
  rc_resource
    .findById(req.params.resourceId).then(resource_del => {
      if (resource_del.trashstatus == 1) {
        cat_del.remove().then(res1 => {
          if (!res1) {
            // rc_resource
            //   .findOneAndDelete(req.params.resourceId)
            // .then(rc_resource => {
            return res.status(404).send({
              message: "resource not found with id " + req.params.Id
            });
          }
          res.send({ message: "resource deleted successfully!" });
        })
          .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
              return res.status(404).send({
                message: "resource not found with id " + req.params.Id
              });
            }
            return res.status(500).send({
              message: "Could not delete resource with id " + req.params.Id
            });
          });
      } else {
        resource_del.trashstatus = 1;
        resource_del.save();
        res.send({ message: "resource trashed successfully!" });
      }
    });
};
