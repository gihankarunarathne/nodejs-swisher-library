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

  if (!setAppSecret || !setAppId) {
    throw "Should be set correct appSecret and appId";
  }
  this.className = "DataBase: ";

  this.grantType = options.grantType || "access_token";
  this.appSecret = setAppSecret;
  this.appId = setAppId;
  this.scope = options.scope || ["DBRead"];

  this.accessToken = "validaccesstokenstorehere";
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
  this.connectionsServerURL = JSON.parse(this.serverURL);
  this.storageServerURL = JSON.parse(this.serverURL);
  this.createServerURL.path = "/create";
  this.readServerURL.path = "/read";
  this.readsServerURL.path = "/reads";
  this.updateServerURL.path = "/update";
  this.deleteServerURL.path = "/delete";
  this.connectionsServerURL.path = "/connections";
  this.storageServerURL.path = "/storage";

  if (D) console.log("Start up swisher client DataBase with App Secret : " + this.appSecret + " appID : " + this.appId);
}

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
  if (D) {
    console.log("\n Create .... ");
  }
  var self = this, fnName = "Create: ";
  var req = {
    data: data,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCallFireAndForget(self.createServerURL, req, function (err1) {
    if (D) {
      console.log(self.className + fnName + " err 1 : " + JSON.stringify(err1, null, 2));
    }
    if (!err1) {
      callback();
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + " err 2 : " + JSON.stringify(err2, null, 2) + " accessTokenObj: "
                + JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCallFireAndForget(self.createServerURL, req, function (err3) {
                if (D) {
                  console.log(self.className + fnName + " err 3 : " + JSON.stringify(err3, null, 2));
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
  if (D) {
    console.log("\n Read .... ");
  }
  var self = this, fnName = "Read: ";
  var req = {
    find: find,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCall(self.readServerURL, req, function (err1, result) {
    if (D) {
      console.log(self.className + fnName + " err 1 : " + JSON.stringify(err1, null, 2));
    }
    /** Issue: If successful READ operation */
    if (!err1) {
      callback(err1, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + " err 2 : " + JSON.stringify(err2, null, 2) + " accessTokenObj: " +
                JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.readServerURL, req, function (err3, result2) {
                if (D) {
                  console.log(self.className + fnName + " err 3: " + JSON.stringify(err3, null, 2) + " result:" + result2);
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
 * Read/Retrieve multiple JSON objects in DataBase Service
 * @param find query for search for JSON objects in store
 * @param optional Pass optional fields or limits or skip or Empty Object as {}
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
DataBase.prototype.reads = function (find, optional, callback) {
  if (D) {
    console.log("\n Reads ... ");
  }
  var self = this, fnName = "Reads: ";
  var req = {
    find: find,
    accessToken: self.accessToken,
    appId: self.appId
  };
  if (optional.hasOwnProperty("fields")) req.fields = optional.fields;
  if (optional.hasOwnProperty("limit")) req.limit = optional.limit;
  if (optional.hasOwnProperty("skip")) req.skip = optional.skip;

  self.apiCall(self.readsServerURL, req, function (err1, result) {
    if (D) {
      console.log(self.className + fnName + " err 1: " + JSON.stringify(err1, null, 2));
    }
    /** If successful READ operation */
    if (result) {
      callback(err1, result);
    } else {

      /** If error due to invalid accessToken, get new accessToken. */
      if (err1.errorType === 'invalid_access_token') {
        self.getAccessToken(self.oauthServerURL, self.grantType, self.appSecret, self.appId, self.scope,
          function (err2, accessTokenObj) {
            if (D) {
              console.log(self.className + fnName + "err 2: " + JSON.stringify(err2, null, 2) + " accessTokenObj: " +
                JSON.stringify(accessTokenObj, null, 2));
            }
            /** If get valid accessToken, try again */
            if (accessTokenObj) {
              /** Store including refreshToken, scope etc... */
              self.accessTokenObj = accessTokenObj;
              self.accessToken = accessTokenObj.accessToken;

              req.accessToken = accessTokenObj.accessToken;

              self.apiCall(self.readsServerURL, req, function (err3, result2) {
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
  if (D) console.log("\n Update ... ");
  var self = this, fnName = "Update: ";
  var req = {
    find: find,
    data: data,
    accessToken: self.accessToken,
    appId: self.appId
  }
  self.apiCallFireAndForget(self.updateServerURL, req, function (err1) {
    if (D) {
      console.log(self.className + fnName + " err 1: " + JSON.stringify(err1, null, 2));
    }
    if (!err1) {
      callback();
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

              self.apiCallFireAndForget(self.updateServerURL, req, function (err3) {
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
  if (D) {
    console.log("\n Delete ....");
  }
  var self = this, fnName = "Delete: ";
  var req = {
    find: find,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCallFireAndForget(self.deleteServerURL, req, function (err1) {
    if (D) {
      console.log(self.className + fnName + " err 1: " + JSON.stringify(err1, null, 2));
    }
    if (!err1) {
      callback();
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
 * Shows the number of connections made each applications with database service
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
DataBase.prototype.connections = function (/*String*/ from, /*String*/ to, /*function*/ callback) {
  if (D) console.log("\n Connections .... ");
  var self = this, fnName = "Connections: ";

  var req = {
    from: from,
    to: to,
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCall(self.connectionsServerURL, req, function (err1, result) {
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

              self.apiCall(self.connectionsServerURL, req, function (err3, result2) {
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
 * Shows the amount of space used by each applications
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
DataBase.prototype.storage = function (/*function*/ callback) {
  if (D) console.log("\n Storage .... ");
  var self = this, fnName = "Storage: ";

  var req = {
    accessToken: self.accessToken,
    appId: self.appId
  };
  self.apiCall(self.storageServerURL, req, function (err1, result) {
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

              self.apiCall(self.storageServerURL, req, function (err3, result2) {
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

exports.DataBase = DataBase;