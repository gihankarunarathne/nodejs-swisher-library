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

var http = require('http');

function Service() {
  if (!(this instanceof Service)) {
    return new Service();
  }

  console.log("Start up swisher Service >>>>");
};

Service.prototype.getAccessToken = function (url, grantType, appSecret, appId, scope, callback) {
  var req = http.request(url, function (res) {
    res.on('data', function (chunk) {
      /** If http status code is 200, it's a valid accessToken */
      chunk = JSON.parse(chunk.toString());
      if (200 === res.statusCode) {
        callback(null, chunk);
      } else {
        callback(chunk);
      }
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    console.log('######## Warning: Check weather Service Server is up and running ... ########');
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
  var req = http.request(url, function (res) {
    res.on('data', function (chunk) {
      /** If http status code is 200, it's a valid response */
      chunk = JSON.parse(chunk.toString());
      if (200 === res.statusCode) {
        callback(null, chunk);
      } else {
        callback(chunk);
      }
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    console.log('######## Warning: Check weather Service Server is up and running ... ########');
  });
  req.end(JSON.stringify(request));
};

/**
 * When successful response doesn't send have and data
 * @param url
 * @param request
 * @param callback
 * Ex: function(err) {
 *       //-- Code Here
 *     }
 */
Service.prototype.apiCallFireAndForget = function (url, request, callback) {
  var req = http.request(url, function (res) {
    if (200 === res.statusCode) callback();
    res.on('data', function (chunk) {
      /** If http status code is 200, it's a valid response */
      chunk = JSON.parse(chunk.toString());
      callback(chunk);
    });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    console.log('######## Warning: Check weather Service Server is up and running ... ########');
  });
  req.end(JSON.stringify(request));
};

Service.mixin = function (destinationObject) {
  ['getAccessToken', 'apiCall','apiCallFireAndForget'].forEach(function (property) {
    destinationObject.prototype[property] = Service.prototype[property];
  });
};

exports.Service = Service;