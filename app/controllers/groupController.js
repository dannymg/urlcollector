'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var UserModel = mongoose.model('User');
var GroupModel = mongoose.model('Group');
var MessageService = require('../services/messageService.js');

exports.saveGroup = function(req, res) {
  var newGroupModel = new GroupModel({
    groupName: req.body.group.groupName,
    description: req.body.group.description || ''
  });

  GroupModel.findOne({
      user: req.user,
      groupName: req.body.group.groupName
    },
    function onSuccess(err, groupFromDB) {

      if (err) {
        return res
          .status(500)
          .send({
            message: MessageService.global.serverErrorUnknown
          });
      } else {
        if (!groupFromDB) {
          //Add user id
          newGroupModel.user = req.user;
          newGroupModel.links.push(req.link);
          saveData(res, newGroupModel);

        } else {
          groupFromDB.links.push(req.link);
          saveData(res, groupFromDB);
        }
      }

    });

};

exports.saveAllGroup = function(req, res) {

  var newGroupModel = new GroupModel({
    groupName: req.body.groupName,
    description: req.body.description
  });

  GroupModel.findOne({
      user: req.user,
      groupName: req.body.groupName
    },
    function onSuccess(err, groupFromDB) {

      if (err) {
        return res
          .status(500)
          .send({
            message: MessageService.global.serverErrorUnknown
          });
      } else {
        if (!groupFromDB) {
          //Add user id
          newGroupModel.user = req.user;
          newGroupModel.links = req.linksIds;
          saveData(res, newGroupModel);
        }
      }

    });

};

exports.updateGroupName = function(req, res) {

  GroupModel.findByIdAndUpdate(req.body.id, {
      groupName: req.body.groupName
    },
    function onSuccess(err, groupUpdated) {
      if (err) {
        return res
          .status(500)
          .send({
            message: MessageService.global.serverErrorUnknown
          });
      } else {
        return res
          .status(200)
          .send({
            data: {
              group: groupUpdated
            }
          });
      }
    });
};

exports.getGroupLinks = function(req, res) {

  GroupModel
    .find({user: req.param('userId')})
    .populate('links')
    .exec(function onSucess(err, groups) {
      if (err) {
        return res
          .status(500)
          .send({
            message: MessageService.global.serverErrorUnknown
          });
      } else {
        return res
          .status(200)
          .send({
            data: groups
          });
      }
    });
};

exports.deleteGroup = function(req, res) {

  GroupModel.findById(req.body.id, function(err, aGroup) {
    if (err) {
      return res
        .status(500)
        .send({
          message: MessageService.global.serverErrorUnknown
        });
    } else {
      aGroup.remove(function(err) {
        if (err) {
          return res
            .status(500)
            .send({
              message: MessageService.global.serverErrorUnknown
            });
        } else {
          return res
            .status(200)
            .send({
              message: 'Success'
            });
        }
      });
    }
  });
};

function saveData(res, group) {

  group.save(function onSuccess(err, aGroup) {
    if (err) {
      return res
        .status(500)
        .send({
          message: MessageService.global.serverErrorUnknown
        });
    } else {
      return res
        .status(200)
        .send({
          message: 'Success'
        });
    }
  });
}
