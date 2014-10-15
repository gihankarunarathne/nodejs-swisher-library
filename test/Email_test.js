/**
 * Email Service Test Cases.
 *
 * thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
 * @copyright Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
 * @Author Gihan Karunarathne <gckarunarathne@gmail.com>
 * Command :
 * 1. move to nodejs-swisher-library folder
 * 2. grunt mochaTest
 */

'use strict';

var Email = require('../lib/Email'),
  assert = require('assert'),
  testConf = require('./config_test.json');

var emailService;

describe('NodeJS Swisher Client: ', function () {
  this.timeout(15000); // Increase timeout for remote server

  before(function (done) {
    emailService = new Email.Email(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: ["Email"]
    });
    console.log("Start Tests");
    done();
  });

  describe('Email: ', function () {
    it('Should send email: ', function (done) {

      emailService.send([
        {"name": "JohnTaylor", "email": "john@example.com"},
        {"name": "JimmyHolder", "email": "jimmy@example.com"}
      ],
        {"name": "AndrewSmith", "email": "smith@example.com"},
        "Introducing New Service",
        [
          {"type": "text", "content": "TestMessage"}
        ],
        {
          "bcc": [
            {"name": "SandraCollins", "email": "collins@example.com"}
          ],
          "cc": [
            {"name": "MikeTracer", "email": "mike@example.com"}
          ]
        }, function (err, result) {
          if (err) {
            assert.ok(!err, "Should not return an error. " + JSON.stringify(err));
          } else {
            assert.ok(result, "Should return any thing for successful operation.");
            done();
          }
        });

    })
  });

  describe('Statistics: ', function () {

    it('Stats: ', function (done) {
      var d = new Date(Date.now()-30*24*60*60*1000);
      var from = d.toISOString().split('T')[0];

      d = new Date(Date.now()+30*24*60*60*1000);
      var to = d.toISOString().split('T')[0];

      emailService.stats(from, to, function (err, result) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(result.data instanceof Object, "Should return Data object in result.");
          done();
        }
      });
    });

  });

  after(function (done) {
    console.log("Tear Down Tests");
    done();
  });
});