'use strict';

var request = require('supertest');
var async = require('async');

var server;

before(function(){
  server = require('../../app/server.js');
  request = request(server);
});

describe('Start server', function() {
  it('Should exist', function (done) {
    expect(server).to.exist;
    done();
   });
});
