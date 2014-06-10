/*
 * swisher-client
 * https://github.com/gihankarunarathne/nodejs-swisher-library
 *
 * Copyright (c) 2014 Gihan Karunarathne
 * Licensed under the MIT license.
 */

'use strict';

var Service = require('./Service.js');

var appId, appSecret;

function DataBase(setAppId, setAppSecret) {
  if(!(this instanceof DataBase)){
    return new Database(appSecret,appId);
  }

  appSecret = setAppSecret;
  appId = setAppId;

  console.log("Start up swisher client DataBase with App Secret : " + appSecret + " appID : " + appId);
};

DataBase.prototype.create = function (data, callback) {
  console.log("Create");
  callback(200,{});
};

DataBase.prototype.read = function (find, callback) {
  console.log("Read");
  callback(200,{});
};

DataBase.prototype.reads = function (find, callback) {
  console.log("Reads");
  callback(200,{});
};

DataBase.prototype.update = function (find, data, callback) {
  console.log("Update");
  callback(200,{});
};

DataBase.prototype.delete = function (find, callback) {
  console.log("Delete");
  callback(200,{});
};

Service.mixin(DataBase);

exports.DataBase = DataBase;