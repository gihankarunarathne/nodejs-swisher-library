/**
 * SMS Service Test Cases.
 *
 * thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
 * @copyright Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
 * @Author Nuwan Madhawa <nuwan@thinkcube.com>
 * Command :
 * 1. move to nodejs-swisher-library folder
 * 2. grunt mochaTest
 */

'use strict';

var SMS = require('../lib/SMS'),
  assert = require('assert'),
  testConf = require('./config_test.json');

var SMSService;

describe('NodeJS Swisher Client: ', function () {

  before(function (done) {
    SMSService = SMS.SMS(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: "test"
    });
    console.log("Start Tests");
    done();
  });

  describe('SMS Send: ', function () {
    it('Should get 200 response with no errors', function (done) {

      SMSService.send(testConf.testMobileNum,'test_sms_msg', function (err,result) {
        if (err) {
          return done(result);
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
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