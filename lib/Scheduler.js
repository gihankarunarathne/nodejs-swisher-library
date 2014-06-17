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

/**
 * Create Scheduler service client
 * @param setAppSecret Application Secret
 * @param setAppId Application ID
 * @param options Options in Object format
 * @returns {Scheduler} new Scheduler Client
 * @constructor
 */
function Scheduler(setAppSecret, setAppId, options) {
  if (!(this instanceof Scheduler)) {
    return new Scheduler(setAppSecret, setAppId, options);
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
    hostname: "localhost",
    port: 8100,
    path: "",
    method: "POST"
  });
  this.oauthServerURL = {
    hostname: "localhost",
    port: 8100,
    path: "/oauth/getAccessToken",
    method: "POST"
  };

  this.getServerURL = JSON.parse(this.serverURL);
  this.insertServerURL = JSON.parse(this.serverURL);
  this.listServerURL = JSON.parse(this.serverURL);
  this.deleteServerURL = JSON.parse(this.serverURL);
  this.getServerURL.path = "/get";
  this.insertServerURL.path = "/insert";
  this.listServerURL.path = "/list";
  this.deleteServerURL.path = "/delete";

  if (D) console.log("Start up swisher client Scheduler with App Secret : " + this.appSecret + " appID : " + this.appId);
};

Service.Service.mixin(Scheduler);
/** Or use util inherits */
//util.inherits(Scheduler, Service.Service);

/**
 * Get
 * @param _id query for search for JSON object in store
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
Scheduler.prototype.get = function (_id, callback) {
  if (D) console.log("Scheduler Get .... ");
  var self = this;
  var req = {
    _id: _id,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCall(self.getServerURL, req, function (err, result) {
    if (D) console.log("11111  err : " + JSON.stringify(err, null, 2));
    /** Issue: If successful GET operation */
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

            self.apiCall(self.getServerURL, req, function (err2, result2) {
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
 * Insert Event in to Scheduler Service
 * @param title
 * @param timeZone
 * @param startDate
 * @param optional
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *     //-- Result is in an Array
 *   }
 * }
 */
Scheduler.prototype.insert = function (title, timeZone, startDate, optional, callback) {
  if (D) console.log("Scheduler Insert ... ");
  var self = this;
  var req = {
    title: title,
    timeZone: timeZone,
    startDate: startDate,
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasAttribute("description")) req.description = optional.description;
  if (optional.hasAttribute("startTime")) req.startTime = optional.startTime;
  if (optional.hasAttribute("endDate")) req.endDate = optional.endDate;
  if (optional.hasAttribute("endTime")) req.endTime = optional.endTime;
  if (optional.hasAttribute("location")) req.location = optional.location;
  if (optional.hasAttribute("organizer")) req.organizer = optional.organizer;
  if (optional.hasAttribute("attendees")) req.attendees = optional.attendees;
  if (optional.hasAttribute("notifyTypes")) req.notifyTypes = optional.notifyTypes;
  if (optional.hasAttribute("notifyNumbers")) req.notifyNumbers = optional.notifyNumbers;
  if (optional.hasAttribute("callbackLink")) req.callbackLink = optional.callbackLink;
  if (optional.hasAttribute("thresholds")) req.thresholds = optional.thresholds;

  self.apiCall(self.insertServerURL, req, function (err, result) {
    if (D) console.log("11111  err : " + JSON.stringify(err, null, 2));
    /** If successful Insert operation */
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

            self.apiCall(self.insertServerURL, req, function (err2, result2) {
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
 * List
 * @param optional Options in Object format
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *     //-- Result is in an Array
 *   }
 * }
 */
Scheduler.prototype.list = function (optional, callback) {
  if (D) console.log("Scheduler List ... ");
  var self = this;
  var req = {
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasAttribute("title")) req.title = optional.title;
  if (optional.hasAttribute("description")) req.description = optional.description;
  if (optional.hasAttribute("timeZone")) req.timeZone = optional.timeZone;
  if (optional.hasAttribute("startDate")) req.startDate = optional.startDate;
  if (optional.hasAttribute("startTime")) req.startTime = optional.startTime;
  if (optional.hasAttribute("endDate")) req.endDate = optional.endDate;
  if (optional.hasAttribute("endTime")) req.endTime = optional.endTime;
  if (optional.hasAttribute("organizer")) req.organizer = optional.organizer;

  self.apiCall(self.listServerURL, req, function (err, result) {
    if (D) console.log("11111  err : " + JSON.stringify(err, null, 2));
    /** If successful Insert operation */
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

            self.apiCall(self.listServerURL, req, function (err2, result2) {
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
 * delete
 * @param optional JSON query which include keys
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
Scheduler.prototype.delete = function (optional, callback) {
  if (D) console.log("Delete");
  var self = this;
  var req = {
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasAttribute("title")) req.title = optional.title;
  if (optional.hasAttribute("description")) req.description = optional.description;
  if (optional.hasAttribute("timeZone")) req.timeZone = optional.timeZone;
  if (optional.hasAttribute("startDate")) req.startDate = optional.startDate;
  if (optional.hasAttribute("startTime")) req.startTime = optional.startTime;
  if (optional.hasAttribute("endDate")) req.endDate = optional.endDate;
  if (optional.hasAttribute("endTime")) req.endTime = optional.endTime;
  if (optional.hasAttribute("organizer")) req.organizer = optional.organizer;

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

exports.Scheduler = Scheduler;