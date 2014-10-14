/**
 * SMS Service Test Cases.
 *
 * thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
 * @copyright Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
 * @Author Nuwan Madhawa <nuwan@thinkcube.com>
 * @Author Gihan Karunarathne <gckarunarathne@gmail.com>
 * Command :
 * 1. move to nodejs-swisher-library folder
 * 2. grunt mochaTest
 */

'use strict';

var SMS = require('../lib/SMS'),
  assert = require('assert'),
  testConf = require('./config_test.json');

var sms;

describe('NodeJS Swisher Client: ', function () {

  before(function (done) {
    sms = new SMS.SMS(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: "test"
    });
    console.log("Start Tests");
    done();
  });

  describe('Email: ', function () {
    it('Send: ', function (done) {

      sms.send(testConf.testMobileNum, 'test_sms_msg', function (err, result) {
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
      var d = new Date();
      var from = d.getFullYear() + "-" + (d.getMonth() - 1) + "-" + d.getDate(),
        to = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

      sms.stats(from, to, function (err, result) {
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