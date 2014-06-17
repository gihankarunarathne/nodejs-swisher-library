# swisher-client [![Build Status](https://secure.travis-ci.org/gihankarunarathne/nodejs-swisher-library.png?branch=master)](http://travis-ci.org/gihankarunarathne/nodejs-swisher-library)

<Coming Soon> NodeJS Client library for Swisher platform.
"swisher.io" is under construction. It will be available for public usage in next month.

## Getting Started
Install the module with: `npm install swisher-client`

Example :

```javascript

var swisher_client = require('swisher-client'),
    dbService = swisher_client.DataBase("7780aa6c75f9439ed416e0501294a3831abe1a05", "8", {
      grantType : "access_token",
      scope     : "test"
    });

dbService.create({"name":"John","age":"30"}, function(err){
  if (err) {
    // Handle Error Here
  } else {
     // -- Code Here
  }
});

dbService.read({"name":"John"}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

## Documentation

Following Web Services are available in Swisher Platform.

1. [DataBase Service](#1-database)
2. [SMS Service](#2-sms)
3. [Email Service](#3-email)
4. [Scheduler Service](#4-scheduler)
5. [Notification Service](#5-notification)

### 1. DataBase Service
Document Storage Service.

* [Constructor](#swisher_clientdatabaseappsecret-appid-options)
* [Read](#dbservicereadfind-callback)
* [Reads](#dbservicereadsfind-optional-callback)
* [Update](#dbserviceupdatefind-data-callback)
* [Delete](#dbservicedeletefind-callback)

#### swisher_client.DataBase("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    dbService = swisher_client.DataBase("7780aa6c75f9439ed416e0501294a3831abe1a05", "8", {
      grantType : "access_token",
      scope     : "test"
    });
```

#### dbService.create(data, callback)
Parameters:
###### data (JSON)
Document to be created/added. Should be a valid JSON object.

```javascript

dbService.create({"name":"John","age":"30"}, function(err){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

#### dbService.read(find, callback)
Parameters:
###### find (JSON)
JSON query to find the document in the storage.

```javascript

dbService.read({"name":"John"}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

#### dbService.reads(find, [optional], callback)
Parameters:
###### find (JSON)
JSON query to find the document in the storage.

```javascript

dbService.reads({"name":"John"}, {}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

#### dbService.update(find, data, callback)
Parameters:
###### find (JSON)
JSON query to find the document in the storage.

###### data (JSON)
Document to be created/added. Should be a valid JSON object.

```javascript

dbService.update({"name":"John"}, {"age":"45"}, function(err){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

#### dbService.delete(find, callback)
Parameters:
###### find (JSON)
JSON query to find the document in the storage.

```javascript

dbService.delete({"name":"John"}, function(err){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### 2. SMS
SMS Service.

* [Constructor](#swisher_clientsmsappsecret-appid-options)
* [Send](#dbservicereadfind-callback)

#### swisher_client.SMS("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    sms = swisher_client.SMS("7780aa6c75f9439ed416e0501294a3831abe1a05", "8", {
      grantType : "access_token",
      scope     : "test"
    });
```

#### sms.send(number, text, callback)
Parameters:
###### number (String)
Telephone number.
###### text (String)
Message to be send.

```javascript

sms.send("00947xxxxxxxx", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### 3. Email
Email Service.

* [Constructor](#swisher_clientemailappsecret-appid-options)
* [Send](#emailsendto-from-subject-message-optional-callback)

#### swisher_client.Email("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    email = swisher_client.Email("7780aa6c75f9439ed416e0501294a3831abe1a05", "8", {
      grantType : "access_token",
      scope     : "test"
    });
```

#### email.send(to, from, subject, message, optional, callback)
Parameters:
###### to (Array of JSON  Objects)
In this parameter, it should be specified recipients’details as a json array.

###### from (JSON Object)
Details of the sender.This also should be specified as a json object. Single email and name parameters as a object.

###### subject (String)
Subject of the email which it to be sent..

###### message (JSON Object)
Message that you want to send. This should be specified as a json array.

###### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* cc (Array of JSON objects)
Carbon Copy address. This also should be specified as a json array.

* bcc (Array of JSON objects)
Blind Carbon Copy address. This also should be specified as a json array.

```javascript

email.send(
  [
    {"name": "JohnTaylor", "email": "john@example.com"},
    {"name": "JimmyHolder", "email": "jimmy@example.com"}
  ],
  {"name": "AndrewSmith", "email": "smith@example.com"},
  "Introducing New Service",
  [
    {"type": "text", "content": "TestMessage"}
  ],
  {
    "bcc": [
      {"name": "SandraCollins", "email": "collins@example.com"}
    ],
    "cc": [
      {"name": "MikeTracer", "email": "mike@example.com"}
    ]
  },
  function (err, result) {
    if (err) {
      // Handle Error Here
    } else {
      // -- Code Here
    }
  });

```

### 4. Scheduler


### 5. Notification


## Contributing
@Author : Gihan Karunarathne
@Email  : gckarunarathne@gmail.com

## Release History
_0.1.8_

## License
Copyright (c) 2014 Gihan Karunarathne  
Licensed under the MIT license.
