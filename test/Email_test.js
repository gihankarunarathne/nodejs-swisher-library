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

var EmailService;

describe('NodeJS Swisher Client: ', function () {

  before(function (done) {
    EmailService = Email.Email(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: "test"
    });
    console.log("Start Tests");
    done();
  });

  describe('Email: ', function () {
    it('Should send email: ', function (done) {

      EmailService.send([
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

  after(function (done) {
    console.log("Tear Down Tests");
    done();
  });
});