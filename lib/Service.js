/*
 * swisher-client
 * https://github.com/gihankarunarathne/nodejs-swisher-library
 *
 * Copyright (c) 2014 Gihan Karunarathne
 * Licensed under the MIT license.
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
 *
 * @param url
 * @param request
 * @param callback
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