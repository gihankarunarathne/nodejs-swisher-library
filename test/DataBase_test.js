/**
 * DataBase Service Test Cases.
 *
 * http://code.thinkcube.net/swisher
 *
 * @Author : Gihan Karunarathne
 * @Email  : gckarunarathne@gmail.com
 *
 * Copyright (c) 2014 ThinkCube Systems
 * Licensed under the Apache-2.0 license.
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
    dbService = DataBase.DataBase(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: "test"
    });
    console.log("Start Tests");
    done();
  });

  describe('Create: ', function () {
    it('Basic create operation.', function (done) {

      dbService.create({"name": "John", "age": "30"}, function (err) {
        if (err) {
          assert.ok(!err);
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
          done();
        }
      });

    })
  });

  describe('Read: ', function () {
    it('Basic read operation.', function (done) {

      dbService.read({"name": "John"}, function (err, result) {
        if (err) {
          assert.ok(!err);
        } else {
          assert.ok(result, "Should not return any thing for successful operation.");
          assert.notEqual(result._id, "", "Return object id should not empty.")
          done();
        }
      });

    })
  });

  describe('Update: ', function () {
    it('Basic update operation.', function (done) {

      dbService.update({"name": "John"}, {"age": "40"}, function (err) {
        if (err) {
          assert.ok(!err);
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
          done();
        }
      });

    })
  });

  describe('Read: ', function () {
    it('Basic read operation.', function (done) {

      dbService.read({"name": "John"}, function (err, result) {
        if (err) {
          assert.ok(!err);
        } else {
          assert.ok(result, "Should not return any thing for successful operation.");
          assert.equal(result.age, "40", "Return object id should not empty.")
          done();
        }
      });

    })
  });

  describe('Delete: ', function () {
    it('Basic delete operation.', function (done) {

      dbService.delete({"name": "John"}, function (err) {
        if (err) {
          assert.ok(!err);
        } else {
          assert.ok(true, "Should not return any thing for successful operation.");
          done();
        }
      });

    })
  });

  describe('Reads: ', function () {
    it('Basic reads operation.', function (done) {

      dbService.reads({"name": "John"}, {"fsd":"fsdf"}, function (err, result) {
        if (err) {
          assert.ok(!err, "Should not return error obj : " + JSON.stringify(err));
        } else {
          assert.ok(result.length == 0, "Should not return any thing for successful operation.");
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