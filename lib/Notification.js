/*
 * swisher-client
 *
 * thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
 * @copyright Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
 * @Author Gihan Karunarathne
 * @Email  gckarunarathne@gmail.com
 * @license Licensed under the MIT license.
 */

'use strict';

var util = require('util'),
  Service = require('./Service'),
  conf = require('../config.json');

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

  if (!setAppSecret || !setAppId) throw "Should be set correct appSecret and appId";

  this.grantType = options.grantType || "access_token";
  this.appSecret = setAppSecret;
  this.appId = setAppId;
  this.scope = options.scope || ["Notification"];

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
}

Service.Service.mixin(Notification);
/** Or use util inherits */
//util.inherits(Notification, Service.Service);

/**
 * Trigger an events on subscribbed clients via Notification Service
 * @param channel
 * @param event
 * @param message
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 */
Notification.prototype.trigger = function (channel, event, message, callback) {
  if (D) console.log("Triggering event..");
  var self = this;
  var req = {
    channel: channel,
    event: event,
    msg: message,
    accessToken: self.accessToken,
    appId: self.appId
  };

  self.apiCall(self.sendServerURL, req, function (err, result) {
    /** Issue: If successful READ operation */
    if (!err) {
      callback(err, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope, function (err1, accessTokenObj) {
          if (D) console.log("err : " + JSON.stringify(err1, null, 2) + " accesstokenobj: " + JSON.stringify(accessTokenObj, null, 2));
          /** If get valid accessToken, try again */
          if (accessTokenObj) {
            /** Store including refreshToken, scope etc... */
            self.accessTokenObj = accessTokenObj;
            self.accessToken = accessTokenObj.accessToken;

            req.accessToken = accessTokenObj.accessToken;

            self.apiCall(self.sendServerURL, req, function (err2, result2) {
              if (D) console.log("err : " + JSON.stringify(err2, null, 2) + " result");
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
        if (D) console.log("Err when calling to " + self.sendServerURL + ": " + JSON.stringify(err, null, 2));
        callback(err);
      }

    }
  });
};

exports.Notification = Notification;
