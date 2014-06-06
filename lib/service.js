/*
 * swisher-client
 * https://github.com/gihankarunarathne/nodejs-swisher-library
 *
 * Copyright (c) 2014 Gihan Karunarathne
 * Licensed under the MIT license.
 */

'use strict';

function Service(appSecret, appId){
  if(!(this instanceof Service)){
    return new Service(appSecret,appId);
  }

  console.log("Start up swisher client with App Secret : " + appSecret + " appID : " + appId);
};

Service.prototype.getAccessToken = function(scope , callback){
  console.log("Get AccessToken " + scope);
  callback();
};

exports.Service = Service;