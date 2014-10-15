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
 * @constructor
 */
function Email(/*String*/setAppSecret, /*String*/setAppId, /*Object*/options) {

  if (!setAppSecret || !setAppId) {
    throw "Should be set correct appSecret and appId";
  }

  this.grantType = options.grantType || "access_token";
  this.appSecret = setAppSecret;
  this.appId = setAppId;
  this.scope = options.scope || ["Email"];

  this.accessToken = "";
  this.accessTokenObj = {};
  /** Store including {accessToken, refreshToken, appId, scope, expireIn} */

  this.serverURL = JSON.stringify({
    hostname: conf.emailHost,
    port: conf.emailPort,
    path: "",
    method: "POST",
    headers: {
      'Content-Type' : 'application/json'
    }
  });
  this.oauthServerURL = {
    hostname: conf.emailHost,
    port: conf.emailPort,
    path: "/oauth/getAccessToken",
    method: "POST",
    headers: {
      'Content-Type' : 'application/json'
    }
  };


  this.sendServerURL = JSON.parse(this.serverURL);
  this.statsServerURL = JSON.parse(this.serverURL);

  this.sendServerURL.path = "/send";
  this.statsServerURL.path = "/stats";

  if (D) {
    console.log("Start up swisher client Email with App Secret : " +
      this.appSecret + " appID : " + this.appId);
  }
}

Service.Service.mixin(Email);
//Or use util inherits
//util.inherits(Email, Service.Service);

/**
 * Send an email using Email Service
 * @param to Array of JSON Objects i.e. {name: "", email: ""}
 * @param from JSON Object i.e. {name: "", email: ""}
 * @param subject String
 * @param message String
 * @param optional Pass optional BCC or CC or Empty Object i.e. {}
 * cc : Array of JSON Objects i.e. {name: "", email: ""}
 * bcc: Array of JSON Objects i.e. {name: "", email: ""}
 *
 * @param callback Response with callback
 * Ex: function(err, result) {
 *   if(err) {
 *     console.log(JSON.stringify(err,null,2));
 *   } else {
 *     //-- Code Here
 *   }
 * }
 */
Email.prototype.send =
  function (/*Object[]*/to, /*Object*/from, /*String*/subject, /*String*/
            message, /*Object*/optional, /*Function*/callback) {

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
          self.getAccessToken(self.oauthServerURL, self.grantType,
            self.appSecret, self.appId, self.scope,
            function (err1, accessTokenObj) {
              /** If get valid accessToken, try again */
              if (accessTokenObj) {
                /** Store including refreshToken, scope etc... */
                self.accessTokenObj = accessTokenObj;
                self.accessToken = accessTokenObj.accessToken;

                req.accessToken = accessTokenObj.accessToken;

                self.apiCall(self.sendServerURL, req, function (err2, result2) {
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
 * Show the amount of SMSes sent by each applications in given period of time.
 *
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
Email.prototype.stats = function (/*String*/ from, /*String*/ to, /*function*/
                                  callback) {
  var self = this, fnName = "Stats: ";

  var req = {
    from: from,
    to: to,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCall(self.statsServerURL, req, function (err1, result) {

    if (!err1) {
      callback(err1, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType,
          self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.statsServerURL, req, function (err3, result2) {
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
