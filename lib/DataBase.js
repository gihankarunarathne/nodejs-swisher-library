/*
 * swisher-client
 * https://github.com/gihankarunarathne/nodejs-swisher-library
 *
 * Copyright (c) 2014 Gihan Karunarathne
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util'),
  Service = require('./Service'),
  conf = require('../config.json');

var D = false;

/**
 * Create Database service client
 * @param setAppSecret Application Secret
 * @param setAppId Application ID
 * @param options Options in Object format
 * @returns {DataBase} new DataBase Client
 * @constructor
 */
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

  this.serverURL = JSON.stringify({
    hostname: conf.databaseHost,
    port: conf.databasePort,
    path: "",
    method: "POST"
  });
  this.oauthServerURL = {
    hostname: conf.databaseHost,
    port: conf.databasePort,
    path: "/oauth/getAccessToken",
    method: "POST"
  };

  this.createServerURL = JSON.parse(this.serverURL);
  this.readServerURL = JSON.parse(this.serverURL);
  this.readsServerURL = JSON.parse(this.serverURL);
  this.updateServerURL = JSON.parse(this.serverURL);
  this.deleteServerURL = JSON.parse(this.serverURL);
  this.createServerURL.path = "/create";
  this.readServerURL.path = "/read";
  this.readsServerURL.path = "/reads";
  this.updateServerURL.path = "/update";
  this.deleteServerURL.path = "/delete";

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
  var req = {
    data: data,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCallFireAndForget(self.createServerURL, req, function (err) {
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

            req.accessToken = accessTokenObj.accessToken;

            self.apiCallFireAndForget(self.createServerURL, req, function (err2) {
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

/**
 * Read/Retrieve JSON object in DataBase Service
 * @param find query for search for JSON object in store
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 *
 */
DataBase.prototype.read = function (find, callback) {
  if (D) console.log("Read .... ");
  var self = this;
  var req = {
    find: find,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCall(self.readServerURL, req, function (err, result) {
    if (D) console.log("11111  err : " + JSON.stringify(err, null, 2));
    /** Issue: If successful READ operation */
    if (!err) {
      callback(err, result);
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

            req.accessToken = accessTokenObj.accessToken;

            self.apiCall(self.readServerURL, req, function (err2, result2) {
              if (D) console.log("33333 err : " + JSON.stringify(err2, null, 2) + " result");
              if (result2) {
                callback(err2, result2);
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

/**
 * Read/Retrieve multiple JSON objects in DataBase Service
 * @param find query for search for JSON objects in store
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *     //-- Result is in an Array
 *   }
 * }
 *
 */
DataBase.prototype.reads = function (find, callback) {
  if (D) console.log("Reads ... ");
  var self = this;
  var req = {
    find: find,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCall(self.readsServerURL, req, function (err, result) {
    if (D) console.log("11111  err : " + JSON.stringify(err, null, 2));
    /** If successful READ operation */
    if (result) {
      callback(err, result);
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

            req.accessToken = accessTokenObj.accessToken;

            self.apiCall(self.readsServerURL, req, function (err2, result2) {
              if (D) console.log("33333 err : " + JSON.stringify(err2, null, 2));
              if (result2) {
                callback(err2, result2);
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

/**
 * Update existing JSON object in DataBase Service
 * @param find JSON query to find document in the Database Service
 * @param data data in JSON object to be newly store
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
DataBase.prototype.update = function (find, data, callback) {
  if (D) console.log("Update ... ");
  var self = this;
  var req = {
    find: find,
    data: data,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCallFireAndForget(self.updateServerURL, req, function (err) {
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

            req.accessToken = accessTokenObj.accessToken;

            self.apiCallFireAndForget(self.updateServerURL, req, function (err2) {
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

/**
 * Remove/Delete existing JSON object in DataBase Service
 * @param find JSON query to find document in the Database Service
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
DataBase.prototype.delete = function (find, callback) {
  if (D) console.log("Delete");
  var self = this;
  var req = {
    find: find,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCallFireAndForget(self.deleteServerURL, req, function (err) {
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

            req.accessToken = accessTokenObj.accessToken;

            self.apiCallFireAndForget(self.deleteServerURL, req, function (err2) {
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

exports.DataBase = DataBase;