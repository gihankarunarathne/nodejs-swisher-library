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
 * Create Notification service client
 * @param setAppSecret Application Secret
 * @param setAppId Application ID
 * @param options Options in Object format
 * @returns {Notification} new Notification Client
 * @constructor
 */
function Notification(setAppSecret, setAppId, options) {
  if (!(this instanceof Notification)) {
    return new Notification(setAppSecret, setAppId, options);
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
    hostname: conf.notificationHost,
    port: conf.notificationPort,
    path: "",
    method: "POST"
  });
  this.oauthServerURL = {
    hostname: conf.notificationHost,
    port: conf.notificationPort,
    path: "/oauth/getAccessToken",
    method: "POST"
  };

  this.sendServerURL = JSON.parse(this.serverURL);

  this.sendServerURL.path = "/sendmsg";

  if (D) console.log("Start up swisher client Notification with App Secret : " + this.appSecret + " appID : " + this.appId);
};

Service.Service.mixin(Notification);
/** Or use util inherits */
//util.inherits(Notification, Service.Service);

/**
 * Send Messages to recipients via Notification Service
 * @param recipients
 * @param msg
 * @param userName
 * @param optional Options in Object format
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 */
Notification.prototype.sendMessagesToRecipients = function (recipients, msg, userName, optional, callback) {
  if (D) console.log("Notification send .... ");
  var self = this;
  var req = {
    recipients : recipients,
    msg: msg,
    userName : userName,
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasAttribute("deliverOffline")) req.deliverOffline = optional.deliverOffline;

  self.apiCall(self.sendServerURL, req, function (err, result) {
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

            self.apiCall(self.sendServerURL, req, function (err2, result2) {
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
 * Send Message via a channel in Notification Service
 * @param recipients
 * @param msg
 * @param userName
 * @param optional Options in Object format
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 */
Notification.prototype.sendMessagesToChannel = function (recipients, msg, userName, optional, callback) {
  if (D) console.log("Notification send .... ");
  var self = this;
  var req = {
    recipients : recipients,
    msg: msg,
    userName : userName,
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasAttribute("deliverOffline")) req.deliverOffline = optional.deliverOffline;

  self.apiCall(self.sendServerURL, req, function (err, result) {
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

            self.apiCall(self.sendServerURL, req, function (err2, result2) {
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

exports.Notification = Notification;