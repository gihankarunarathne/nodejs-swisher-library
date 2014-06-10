/*
 * swisher-client
 * https://github.com/gihankarunarathne/nodejs-swisher-library
 *
 * Copyright (c) 2014 Gihan Karunarathne
 * Licensed under the MIT license.
 */

'use strict';

function Service(){
  /*if(!(this instanceof Service)){
    return new Service(appSecret,appId);
  }
  this.appSecret = appSecret;
  this.appId = appId;*/

  console.log("Start up swisher Service >>>>");
};

Service.prototype.getAccessToken = function(scope , callback){
  console.log("Get AccessToken " + scope);
  callback({});
};

Service.mixin = function(destinationObject){
  ['getAccessToken'].forEach(function(property) {
    destinationObject.prototype[property] = Service.prototype[property];
  });
};

exports.Service = Service;