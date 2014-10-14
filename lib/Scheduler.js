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
 * Create Scheduler service client
 * @param setAppSecret Application Secret
 * @param setAppId Application ID
 * @param options Options in Object format
 * @returns {Scheduler} new Scheduler Client
 * @constructor
 */
function Scheduler(setAppSecret, setAppId, options) {

  if (!setAppSecret || !setAppId) throw "Should be set correct appSecret and appId";

  this.className = "Scheduler: ";

  this.grantType = options.grantType || "access_token";
  this.appSecret = setAppSecret;
  this.appId = setAppId;
  this.scope = options.scope || ["SchedulerRead"];

  this.accessToken = "";
  this.accessTokenObj = {};
  /** Store including {accessToken, refreshToken, appId, scope, expireIn} */

  this.serverURL = JSON.stringify({
    hostname: conf.schedulerHost,
    port: conf.schedulerPort,
    path: "",
    method: "POST"
  });
  this.oauthServerURL = {
    hostname: conf.schedulerHost,
    port: conf.schedulerPort,
    path: "/oauth/getAccessToken",
    method: "POST"
  };

  this.getServerURL = JSON.parse(this.serverURL);
  this.insertServerURL = JSON.parse(this.serverURL);
  this.listServerURL = JSON.parse(this.serverURL);
  this.deleteServerURL = JSON.parse(this.serverURL);
  this.statsServerURL = JSON.parse(this.serverURL);
  this.getServerURL.path = "/get";
  this.insertServerURL.path = "/insert";
  this.listServerURL.path = "/list";
  this.deleteServerURL.path = "/delete";
  this.statsServerURL.path = "/delete";

  if (D) {
    console.log(this.className + "Constructor: " + "Start up swisher client Scheduler with App Secret : " +
      this.appSecret + " appID : " + this.appId);
  }
}

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
  var self = this, fnName = "Get: ";
  var req = {
    _id: _id,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCall(self.getServerURL, req, function (err1, result) {
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
              console.log(self.className + fnName + " err 2: " + JSON.stringify(err2, null, 2) + " accesstokenobj: "
                + JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.getServerURL, req, function (err3, result2) {
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
  var self = this, fnName = "Insert: ";
  var req = {
    title: title,
    timeZone: timeZone,
    startDate: startDate,
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasOwnProperty("description")) req.description = optional.description;
  if (optional.hasOwnProperty("startTime")) req.startTime = optional.startTime;
  if (optional.hasOwnProperty("endDate")) req.endDate = optional.endDate;
  if (optional.hasOwnProperty("endTime")) req.endTime = optional.endTime;
  if (optional.hasOwnProperty("location")) req.location = optional.location;
  if (optional.hasOwnProperty("organizer")) req.organizer = optional.organizer;
  if (optional.hasOwnProperty("attendees")) req.attendees = optional.attendees;
  if (optional.hasOwnProperty("notifyTypes")) req.notifyTypes = optional.notifyTypes;
  if (optional.hasOwnProperty("notifyNumbers")) req.notifyNumbers = optional.notifyNumbers;
  if (optional.hasOwnProperty("callbackLink")) req.callbackLink = optional.callbackLink;
  if (optional.hasOwnProperty("thresholds")) req.thresholds = optional.thresholds;

  self.apiCall(self.insertServerURL, req, function (err1, result) {
    if (D) {
      console.log(self.className + fnName + "  err 1: " + JSON.stringify(err1, null, 2));
    }
    /** If successful Insert operation */
    if (result) {
      callback(err1, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err1, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + " err 2: " + JSON.stringify(err1, null, 2) + " accesstokenobj: "
                + JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.insertServerURL, req, function (err2, result2) {
                if (D) {
                  console.log(self.className + fnName + " err 3: " + JSON.stringify(err2, null, 2));
                }
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
        callback(err1);
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
  var self = this, fnName = "List: ";
  var req = {
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasOwnProperty("title")) req.title = optional.title;
  if (optional.hasOwnProperty("description")) req.description = optional.description;
  if (optional.hasOwnProperty("timeZone")) req.timeZone = optional.timeZone;
  if (optional.hasOwnProperty("startDate")) req.startDate = optional.startDate;
  if (optional.hasOwnProperty("startTime")) req.startTime = optional.startTime;
  if (optional.hasOwnProperty("endDate")) req.endDate = optional.endDate;
  if (optional.hasOwnProperty("endTime")) req.endTime = optional.endTime;
  if (optional.hasOwnProperty("organizer")) req.organizer = optional.organizer;

  self.apiCall(self.listServerURL, req, function (err1, result) {
    if (D) {
      console.log(self.className + fnName + "  err 1: " + JSON.stringify(err1, null, 2));
    }
    /** If successful Insert operation */
    if (result) {
      callback(err1, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + " err 2: " + JSON.stringify(err2, null, 2) + " accesstokenobj: " +
                JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.listServerURL, req, function (err3, result2) {
                if (D) {
                  console.log(self.className + fnName + " err 3: " + JSON.stringify(err3, null, 2));
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
  var self = this, fnName = "Delete: ";
  var req = {
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasOwnProperty("title")) req.title = optional.title;
  if (optional.hasOwnProperty("description")) req.description = optional.description;
  if (optional.hasOwnProperty("timeZone")) req.timeZone = optional.timeZone;
  if (optional.hasOwnProperty("startDate")) req.startDate = optional.startDate;
  if (optional.hasOwnProperty("startTime")) req.startTime = optional.startTime;
  if (optional.hasOwnProperty("endDate")) req.endDate = optional.endDate;
  if (optional.hasOwnProperty("endTime")) req.endTime = optional.endTime;
  if (optional.hasOwnProperty("organizer")) req.organizer = optional.organizer;

  self.apiCallFireAndForget(self.deleteServerURL, req, function (err1) {
    if (D) {
      console.log(self.className + fnName + "  err 1: " + JSON.stringify(err1, null, 2));
    }
    if (!err1) {
      callback();
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + " err 2: " + JSON.stringify(err2, null, 2) + " accesstokenobj: " +
                JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCallFireAndForget(self.deleteServerURL, req, function (err3) {
                if (D) {
                  console.log(self.className + fnName + " err 3: " + JSON.stringify(err3, null, 2));
                }
                if (!err3) {
                  callback()
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
Scheduler.prototype.stats = function (/*String*/ from, /*String*/ to, /*function*/ callback) {
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

exports.Scheduler = Scheduler;