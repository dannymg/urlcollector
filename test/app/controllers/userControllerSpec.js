'use strict';

var request = require('supertest');
var async = require('async');
var data = require('../data/data.js');
var utils = require('../utils/utils.js');
var MessageService = require('../../../app/services/messageService.js');

var server;

before(function() {
  server = require('../../../app/server.js');
  request = request(server);
});

describe('Create user', function() {

  it('User valid', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(200);
        var body = res.body;
        expect(body.token).to.exist;
        expect(body.token.split('.')[0]).to.equal(data.api.users.signin.token);
        expect(body.user.id).to.exist;
        expect(body.user.email).to.equal(data.api.users.signup.userOK.email);
        expect(body.user.name).to.equal(data.api.users.signup.userOK.name);
        expect(body.user.email).to.equal(data.api.users.signup.userOK.email);
        done();
      }
    ], done);
  });

  it('Validate Name field blank', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userBlankVName)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userNameRequired)
          .to.equal(res.body.details.errors.name.message);
        done();
      }
    ], done);
  });

  it('Validate Name field null', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userNullName)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userNameRequired)
          .to.equal(res.body.details.errors.name.message);
        done();
      }
    ], done);
  });

  it('Validate Email field blank', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userBlankEmail)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userEmailRequired)
          .to.equal(res.body.details.errors.email.message);
        done();
      }
    ], done);
  });

  it('Validate Email field null', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userNullEmail)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userEmailRequired)
          .to.equal(res.body.details.errors.email.message);
        done();
      }
    ], done);
  });

  it('Validate email exists', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function sendUser2(res, next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userEmailUnique)
          .to.equal(res.body.details.errors.email.message);
        done();
      }
    ], done);
  });

  it('Validate email invalid', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userInvalidEmail)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userEmailInvalid)
          .to.equal(res.body.details.errors.email.message);
        done();
      }
    ], done);
  });

  it('Validate Password field blank', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userBlankPass)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userPasswordRequired)
          .to.equal(res.body.details.errors.password.message);
        done();
      }
    ], done);
  });

  it('Validate Password field null', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userNullPass)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userPasswordRequired)
          .to.equal(res.body.details.errors.password.message);
        done();
      }
    ], done);
  });

  it('Validate Password length', function(done) {
    async.waterfall([
      function sendUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userShortPass)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(MessageService.users.userPasswordLength)
          .to.equal(res.body.details.errors.password.message);
        done();
      }
    ], done);
  });

  it('Login user', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function sendUser(res, next) {
        request
          .post('/api/users/sign_in')
          .send(data.api.users.signin.user)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(200);
        var body = res.body;
        expect(body.token).to.exist;
        expect(body.token.split('.')[0]).to.equal(data.api.users.signin.token);
        expect(body.user.id).to.exist;
        expect(body.user.email).to.equal(data.api.users.signup.userOK.email);
        expect(body.user.name).to.equal(data.api.users.signup.userOK.name);
        expect(body.user.email).to.equal(data.api.users.signup.userOK.email);
        done();
      }
    ], done);
  });

  it('Login user - user not exists', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function sendUser(res, next) {
        request
          .post('/api/users/sign_in')
          .send(data.api.users.signin.userNew)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(MessageService.users.userEmailNotFound);
        done();
      }
    ], done);
  });

});

describe('Update user info', function() {

  it('Change name', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function updateInfo(res, next) {
        var user = res.body.user;
        request
          .put('/api/users/update/' + user.id)
          .set('Authorization', res.body.token)
          .send(data.api.users.update.userUpdated)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(MessageService.users.userUpdateOK);
        done();
      }
    ], done);
  });

  it('Invalid ID', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function updateInfo(res, next) {
        request
          .put('/api/users/update/1234')
          .set('Authorization', res.body.token)
          .send(data.api.users.update.userUpdated)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(MessageService.users.userIdInvalid);
        done();
      }
    ], done);
  });

});

describe('Delete user', function() {

  it('Delete user', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function deleteUser(res, next) {
        var user = res.body.user;
        request
          .delete('/api/users/delete/' + user.id)
          .set('Authorization', res.body.token)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(MessageService.users.userDeleted);
        done();
      }
    ], done);
  });

  it('Invalid ID on delete', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function deleteUser(res, next) {
        request
          .delete('/api/users/delete/1234')
          .set('Authorization', res.body.token)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(MessageService.users.userIdInvalid);
        done();
      }
    ], done);
  });
});

describe('Get user data', function() {

  it('Get user info', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function getUser(res, next) {
        var user = res.body.user;
        request
          .get('/api/users/get/' + user.id)
          .set('Authorization', res.body.token)
          .end(next);
      },
      function assertions(res) {
        var body = res.body;
        expect(res.status).to.equal(200);
        expect(body.user.id).to.exist;
        expect(body.user.email).to.equal(data.api.users.signup.userOK.email);
        expect(body.user.name).to.equal(data.api.users.signup.userOK.name);
        expect(body.user.email).to.equal(data.api.users.signup.userOK.email);
        done();
      }
    ], done);
  });

  it('Invalid ID on get data', function(done) {
    async.waterfall([
      function registerUser(next) {
        request
          .post('/api/users/sign_up')
          .send(data.api.users.signup.userOK)
          .end(next);
      },
      function getUser(res, next) {
        var user = res.body.user;
        request
          .get('/api/users/get/1234')
          .set('Authorization', res.body.token)
          .end(next);
      },
      function assertions(res) {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(MessageService.users.userIdInvalid);
        done();
      }
    ], done);
  });
});
