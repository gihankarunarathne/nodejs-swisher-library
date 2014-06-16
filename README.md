# swisher-client [![Build Status](https://secure.travis-ci.org/gihankarunarathne/nodejs-swisher-library.png?branch=master)](http://travis-ci.org/gihankarunarathne/nodejs-swisher-library)

NodeJS Client library of Swisher platform

## Getting Started
Install the module with: `npm install swisher-client`

```javascript

var swisher_client = require('swisher-client'),
    dbService = swisher_client.DataBase("7780aa6c75f9439ed416e0501294a3831abe1a05", "8", {
      grantType : "access_token",
      scope     : "test"
    });
```

## Documentation

### DataBase Service
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

```javascript

dbService.read({"name":"John"}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

#### dbService.reads(find, callback)

```javascript

dbService.reads({"name":"John"}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

#### dbService.update(find, data, callback)

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

```javascript

dbService.delete({"name":"John"}, function(err){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### SMS
...
### Email
...

## Contributing
@Author : Gihan Karunarathne
@Email  : gckarunarathne@gmail.com

## Release History
_0.1.4_

## License
Copyright (c) 2014 Gihan Karunarathne  
Licensed under the MIT license.
