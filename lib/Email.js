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
 * Create Email service client
 * @param setAppSecret Application Secret
 * @param setAppId Application ID
 * @param options Options in Object format
 * @returns {Email} new Email Client
 * @constructor
 */
function Email(setAppSecret, setAppId, options) {
  if (!(this instanceof Email)) {
    return new Email(setAppSecret, setAppId, options);
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
    hostname: conf.emailHost,
    port: conf.emailPort,
    path: "",
    method: "POST"
  });
  this.oauthServerURL = {
    hostname: conf.emailHost,
    port: conf.emailPort,
    path: "/oauth/getAccessToken",
    method: "POST"
  };


  this.sendServerURL = JSON.parse(this.serverURL);
  this.statsServerURL = JSON.parse(this.serverURL);

  this.sendServerURL.path = "/send";
  this.statsServerURL.path = "/stats";

  if (D) console.log("Start up swisher client Email with App Secret : " + this.appSecret + " appID : " + this.appId);
}

Service.Service.mixin(Email);
/** Or use util inherits */
//util.inherits(Email, Service.Service);

/**
 * Send an email using Email Service
 * @param to
 * @param from
 * @param subject
 * @param message
 * @param optional Pass optional BCC or CC or Empty Object as {}
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 */
Email.prototype.send = function (to, from, subject, message, optional, callback) {
  if (D) console.log("Send .... ");
  var self = this;
  var req = {
    to: to,
    from: from,
    subject: subject,
    message: message,
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasOwnProperty("bcc")) req.bcc = optional.bcc;
  if (optional.hasOwnProperty("cc")) req.cc = optional.cc;

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
 * Show the amount of SMSes sent by each applications in given period of time
 * @param from Start date of the time period which the statistics should be obtained
 * @param to End date of the time period which the statistics should be obtained
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
Email.prototype.stats = function (/*String*/ from, /*String*/ to, /*function*/ callback) {
  if (D) console.log("\n Stats .... ");
  var self = this, fnName = "Stats: ";

  var req = {
    from: from,
    to: to,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCall(self.statsServerURL, req, function (err1, result) {
    if (D) {
      console.log(self.className + fnName + " err 1: " + JSON.stringify(err1, null, 2));
    }

    if (!err1) {
      callback(err1, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + " err 2: " + JSON.stringify(err2, null, 2) + " accessTokenObj: " +
                JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.statsServerURL, req, function (err3, result2) {
                if (D) {
                  console.log(self.className + fnName + " err 3: " + JSON.stringify(err3, null, 2) + " result");
                }
                if (result2) {
                  callback(err3, result2);
                } else {
                  callback(err3);
                }
              });

            } else {
              callback(err2);
            }
          });
      } else {
        callback(err1);
      }

    }
  });
};

exports.Email = Email;