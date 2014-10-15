/*
 * swisher-client
 *
 * thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
 * @copyright Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
 * @Author Gihan Karunarathne
 * @Email  gckarunarathne@gmail.com
 */

'use strict';

var https = require('https');

var D = false,
  className = "Service: ";

function Service() {

}

Service.prototype.getAccessToken = function (url, grantType, appSecret, appId, scope, callback) {
  var fnName = "GetAccessToken: ";
  if (D) {
    console.log(className + fnName + " url:" + JSON.stringify(url) + " grantType:" + grantType + " appSecret:" +
      appSecret + " appId: " + appId + " scope:" + scope);
  }
  var req = https.request(url, function (res) {
    var chunk = "";
    res.on('data', function (tempChunk) {
      chunk += tempChunk;
    });

    res.on('end', function () {
      try {
        /** If https status code is 200, it's a valid accessToken */
        chunk = JSON.parse(chunk.toString());
        if (D) {
          console.log(className + fnName + " received : " + JSON.stringify(chunk, null, 2));
        }
        if (200 === res.statusCode) {
          callback(null, chunk);
        } else {
          callback(chunk);
        }
      } catch (err) {
        if (D) {
          console.log(className + fnName + " UNABLE TO PARSE JSON. >> " + chunk.toString());
        }
        callback({
          "errorType": "internal_server_error",
          "errorCode": 1000,
          "message": [
            "Server Error occurs. Please try again later."
          ]
        });
      }
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    console.log('######## Warning: Check weather Service Server is up and running ... ########');
    callback({
      "errorType": "internal_library_error",
      "errorCode": 0,
      "message": [
        "Internal library Error occurs. Unable to connect to Swisher.",
        e.message
      ]
    });
  });
  req.end(JSON.stringify({
    "grantType": grantType,
    "appSecret": appSecret,
    "appId": appId,
    "scope": scope
  }));
};

/**
 * Request from Service server, in successful callback results. Otherwise callback error object.
 * @param url
 * @param request
 * @param callback
 * Ex: function(err, result) {
 *       if(err) {
 *         // Handle error here
 *       } else {
 *         //-- Code Here
 *       }
 *     }
 */
Service.prototype.apiCall = function (url, request, callback) {
  var fnName = "APICall: ";
  if (D) {
    console.log(className + fnName + " url:" + JSON.stringify(url) + " request:" + JSON.stringify(request));
  }
  var req = https.request(url, function (res) {
    var chunk = "";
    res.on('data', function (tempChunk) {
      chunk += tempChunk;
    });

    res.on('end', function () {
      var data = null;
      try {
        /** If https status code is 200 or 204, it's a valid response */
        if (D) {
          console.log(className + fnName + "received data: ", chunk.toString(), " : " + res.statusCode);
        }

        data = JSON.parse(chunk.toString());

      } catch (err) {
        if (D) {
          console.log(className + fnName + " UNABLE TO PARSE JSON. >> err ", err);
          console.log(chunk.toString());
        }
        callback({
          "errorType": "invalid_json",
          "errorCode": 1000,
          "message": [
            "Server response isn't in valid JSON format. Response : " + chunk
          ]
        });
      }

      if (200 === res.statusCode || 204 === res.statusCode) {
        callback(null, data);
      } else {
        callback(data);
      }
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    console.log('######## Warning: Check weather Service Server is up and running ... ########');
    callback({
      "errorType": "internal_library_error",
      "errorCode": 0,
      "message": [
        "Internal library Error occurs. Unable to connect to Swisher.",
        e.message
      ]
    });
  });
  req.end(JSON.stringify(request));
};

/**
 * When successful response, doesn't send data. If there is an error occurs, send back
 * @param url
 * @param request
 * @param callback
 * Ex: function(err) {
 *       //-- Code Here
 *     }
 */
Service.prototype.apiCallFireAndForget = function (url, request, callback) {
  var fnName = "APICallFireAndForget: ";
  if (D) {
    console.log(className + fnName + " url:" + JSON.stringify(url) + "\n request:" + JSON.stringify(request));
  }
  var req = https.request(url, function (res) {
    /** If it's a successful response, callback (don't wait for the results) */
    if (199 < res.statusCode && res.statusCode < 300) {
      callback();
    } else {
      var chunk = "";
      res.on('data', function (tempChunk) {
        chunk += tempChunk;
      });

      res.on('end', function () {
        try {
          /** If https status code is not 200, send pass the error */
          chunk = JSON.parse(chunk.toString());
          callback(chunk);
        } catch (err) {
          if (D) {
            console.log(className + fnName + " UNABLE TO PARSE JSON. >> " + JSON.stringify(chunk.toString()));
          }
          callback({
            "errorType": "invalid_json",
            "errorCode": 1000,
            "message": [
              "Server response isn't in valid JSON format. Response : "
            ],
            "serverResponse": chunk
          });
        }
      });
    }
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    console.log('######## Warning: Check weather Service Server is up and running ... ########');
    callback({
      "errorType": "internal_library_error",
      "errorCode": 0,
      "message": [
        "Internal library Error occurs. Unable to connect to Swisher.",
        e.message
      ]
    });
  });
  req.end(JSON.stringify(request));
};

Service.mixin = function (destinationObject) {
  ['getAccessToken', 'apiCall', 'apiCallFireAndForget'].forEach(function (property) {
    destinationObject.prototype[property] = Service.prototype[property];
  });
};

exports.Service = Service;
