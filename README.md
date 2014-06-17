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

1. [DataBase Service](#database-service)
2. [SMS Service](#sms-service)
3. [Email Service](#email-service)
4. [Scheduler Service](#scheduler-service)
5. [Notification Service](#notification-service)

### 1. DataBase Service
Document Storage Service.

#### swisher_client.DataBase("appSecret", "appId", [options]);

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
...

### 3. Email
...

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
