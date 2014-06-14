/*
 * swisher-client
 * https://github.com/gihankarunarathne/nodejs-swisher-library
 *
 * Copyright (c) 2014 Gihan Karunarathne
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util'),
  Service = require('./Service');

var D = false;

function DataBase(setAppSecret, setAppId, options) {
  if (!(this instanceof DataBase)) {
    return new DataBase(setAppSecret, setAppId, options);
  }

  if (!setAppSecret || !setAppId) throw "Should be set correct appSecret and appId";

  this.grantType = "access_token";
  this.appSecret = setAppSecret;
  this.appId = setAppId;
  this.scope = "test";

  this.accessToken = "";
  this.accessTokenObj = {};
  /** Store including {accessToken, refreshToken, appId, scope, expireIn} */

  this.serverURL = {
    hostname: "localhost",
    port: 8100,
    path: "",
    method: "POST"
  };
  this.oauthServerURL = {
    hostname: "localhost",
    port: 8100,
    path: "/oauth/getAccessToken",
    method: "POST"
  };

  //Service.apply(this, Array.prototype.slice.call(arguments));

  if (D) console.log("Start up swisher client DataBase with App Secret : " + this.appSecret + " appID : " + this.appId);
};

Service.Service.mixin(DataBase);
/** Or use util inherits */
//util.inherits(DataBase, Service.Service);

/**
 * Create/Store new JSON object in DataBase Service
 * @param data JSON object to be store
 * @param callback Response with callback
 * Ex: function(err) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 *
 */
DataBase.prototype.create = function (data, callback) {
  if (D) console.log("Create .... ");
  var self = this;
  self.serverURL.path = "/create";
  var req = {
    data: data,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCallFireAndForget(self.serverURL, req, function (err) {
    if (D) console.log("11111  err : " + JSON.stringify(err, null, 2));
    if (!err) {
      callback();
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope, function (err1, accessTokenObj) {
          if (D) console.log("2222222 err : " + JSON.stringify(err1, null, 2) + " accesstokenobj: " + JSON.stringify(accessTokenObj, null, 2));
          /** If get valid accessToken, try again */
          if (accessTokenObj) {
            /** Store including refreshToken, scope etc... */
            self.accessTokenObj = accessTokenObj;
            self.accessToken = accessTokenObj.accessToken;

            self.serverURL.path = "/create";
            req.accessToken = accessTokenObj.accessToken;

            self.apiCallFireAndForget(self.serverURL, req, function (err2) {
              if (D) console.log("33333 err : " + JSON.stringify(err2, null, 2));
              if (!err2) {
                callback()
              } else {
                callback(err2);
              }
            });

          } else {
            callback(err1);
          }
        });
      } else {
        callback(err);
      }

    }
  });
};

DataBase.prototype.read = function (find, callback) {
  if (D) console.log("Read");
  callback(200, {});
};

DataBase.prototype.reads = function (find, callback) {
  if (D) console.log("Reads");
  callback(200, {});
};

DataBase.prototype.update = function (find, data, callback) {
  if (D) console.log("Update");
  callback(200, {});
};

DataBase.prototype.delete = function (find, callback) {
  if (D) console.log("Delete");
  callback(200, {});
};

exports.DataBase = DataBase;