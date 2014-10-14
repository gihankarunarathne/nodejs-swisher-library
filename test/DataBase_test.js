/**
 * DataBase Service Test Cases.
 *
 * thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
 * @copyright Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
 * @Author Gihan Karunarathne
 * @Email  gckarunarathne@gmail.com
 * @license Licensed under the MIT license.
 *
 * Command :
 * 1. move to nodejs-swisher-library folder
 * 2. grunt mochaTest
 */

'use strict';

var DataBase = require('../lib/DataBase'),
  assert = require('assert'),
  testConf = require('./config_test.json');

var dbService;

describe('NodeJS Swisher Client: ', function () {

  before(function (done) {
    dbService = new DataBase.DataBase(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: ['DBRead', 'DBWrite']
    });
    console.log("Start Tests");
    done();
  });

  describe('CRUD operations: ', function () {
    it('Basic create operation: ', function (done) {

      dbService.create({"name": "John", "age": "30"}, function (err) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
          done();
        }
      });

    });

    it('Basic read operation: ', function (done) {

      dbService.read({"name": "John"}, function (err, result) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(result, "Should return any thing for successful operation.");
          assert.notEqual(result._id, "", "Return object id should not empty.");
          done();
        }
      });

    });

    it('Basic update operation: ', function (done) {

      var age = Math.ceil(Math.random() * 100);
      dbService.create({"name": "Kamal Dissanayake", "email": "abc@123.com", "age": (age + 10).toString()}, function (err) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
          dbService.update({"email": "abc@123.com"}, {"$set": {"age": age}}, function (err) {
            if (err) {
              assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
            } else {
              assert.ok(true, "Should not return any thing for successful operation.");
              dbService.read({"email": "abc@123.com"}, function (err, result) {
                if (err) {
                  assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
                } else {
                  assert.ok(result, "Should return any thing for successful operation.");
                  assert.equal(result.age, age.toString(), "Return age should be equal to updated age.");
                  done();
                }
              });
            }
          });
        }
      });

    });

    it('Basic delete operation.', function (done) {

      dbService.delete({"name": "John"}, function (err) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
          done();
        }
      });

    });

    it('Basic reads operation.', function (done) {

      dbService.reads({"name": "John"}, {"_id": 0}, function (err, result) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(result.length == 0, "Should return result array any thing for successful operation.");
          done();
        }
      });

    });

  });

  describe('Statistics: ', function () {

    it('Connections: ', function (done) {
      var d = new Date();
      var from = d.getFullYear() + "-" + (d.getMonth() - 1) + "-" + d.getDate(),
        to = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

      dbService.connections(from, to, function (err, result) {
        if (err) {
          assert.ok(!err, "Should not return any error object >> " + JSON.stringify(err));
        } else {
          assert.ok(result.data instanceof Object, "Should return Data object in result.");
          done();
        }
      });
    });

    it('Storage: ', function (done) {
      dbService.storage(function (err, result) {
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