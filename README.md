# swisher-client [![Build Status](https://secure.travis-ci.org/gihankarunarathne/nodejs-swisher-library.png?branch=master)](http://travis-ci.org/gihankarunarathne/nodejs-swisher-library)

<Coming Soon> NodeJS Client library for Swisher platform.
"swisher.io" is under construction. It will be available for public usage in next month.

# Getting Started

* Get register on [Swisher Platform](http://swisher.io/)
* Create a new application (It'll provide an Application Secret and an Application ID)
* Install the module with: `npm install swisher-client`
* Read following documentation for more details

Example :

```javascript

var swisher_client = require('swisher-client'),
    dbService = new swisher_client.DataBase("AppSecretObtainFromSwisher.io",
    "AppObtainFromSwisher.io", {
      grantType : "access_token",
      scope     : ["DBRead", "DBWrite"]
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

# Documentation

Following Web Services are available in Swisher Platform.

1. [DataBase Service](#1-database)
2. [SMS Service](#2-sms)
3. [Email Service](#3-email)
4. [Scheduler Service](#4-scheduler)
5. [Notification Service](#5-notification)

## 1. DataBase Service
Document Storage Service.

| Method | Method Signature |
| ---- | ----- |
| `Constructor` | [*swisher_client.DataBase("appSecret", "appId", [options])*](#swisher_clientdatabaseappsecret-appid-options) |
| `Create` | [*dbService.create(data, callback)*](#dbservicecreatedata-callback) |
| `Read` | [*dbService.read(find, callback)*](#dbservicereadfind-callback) |
| `Reads` | [*dbService.reads(find, optional, callback)*](#dbservicereadsfind-optional-callback) |
| `Update` | [*dbService.update(find, data, callback)*](#dbserviceupdatefind-data-callback) |
| `Delete` | [*dbService.delete(find, callback)*](#dbservicedeletefind-callback) |
| `Connections` | [*dbService.connections(from, to, callback)*](#dbserviceconnectionsfrom-to-callback) |
| `Storage` | [*dbService.storage(callback)*](#dbservicestoragecallback) |

### swisher_client.DataBase("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    dbService = new swisher_client.DataBase("AppSecretObtainFromSwisher.io",
    "AppIdObtainFromSwisher.io", {
      grantType : "access_token",
      scope     : ["DBRead", "DBWrite"]
    });
```

### dbService.create(data, callback)
Parameters:
#### data (JSON)
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

### dbService.read(find, callback)
Parameters:
#### find (JSON)
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

### dbService.reads(find, [optional], callback)
Parameters:

#### find (JSON)
JSON query to find the document in the storage.

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **fields (JSON object)**
Parameter specifies which fields to return.
The parameter contains either include or exclude specifications, not both, unless the exclude is for the _id field.

* **limit (number)**
Limits the number of documents in the results set.

* **skip (number)**
Sets the starting point of the results set.


```javascript

dbService.reads({"name":"John"}, {}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### dbService.update(find, data, callback)
Parameters:
#### find (JSON)
JSON query to find the document in the storage.

#### data (JSON)
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

### dbService.delete(find, callback)
Parameters:
#### find (JSON)
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

### dbService.connections(from, to, callback)
Parameters:
#### from (String)
Start date of the time period which the statistics should be obtained.
#### to (String)
End date of the time period which the statistics should be obtained.

```javascript

dbService.connections("2014-07-01", "2014-07-31", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
    console.dir(result);
  }
});
```

### dbService.storage(callback)

```javascript

dbService.storage(function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
    console.dir(result);
  }
});
```

## 2. SMS
SMS Service.

| Method | Method Signature |
| ---- | ----- |
| `Constructor` | [*swisher_client.SMS("appSecret", "appId", [options])*](#swisher_clientsmsappsecret-appid-options) |
| `Send` | [*sms.send(number, text, callback)*](#smssendnumber-text-callback) |
| `Stats` | [*sms.stats(from, to, callback)*](#smsstatsfrom-to-callback) |

### swisher_client.SMS("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    sms = new swisher_client.SMS("AppSecretObtainFromSwisher.io",
    "AppIdObtainFromSwisher.io", {
      grantType : "access_token",
      scope     : ["SMS"]
    });
```

### sms.send(number, text, callback)
Parameters:
#### number (String)
Telephone number.
#### text (String)
Message to be send.

```javascript

sms.send("009477xxxxxxx", "Hey, This is send via Swisher.io", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### sms.stats(from, to, callback)
Parameters:
#### from (String)
Start date of the time period which the statistics should be obtained.
#### to (String)
End date of the time period which the statistics should be obtained.

```javascript

sms.stats("2014-07-01", "2014-07-31", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
    console.dir(result);
  }
});
```

## 3. Email
Email Service.

| Method | Method Signature |
| ---- | ----- |
| `Constructor` | [*swisher_client.Email("appSecret", "appId", [options])*](#swisher_clientemailappsecret-appid-options) |
| `Send` | [*email.send(to, from, subject, message, optional, callback)*](#emailsendto-from-subject-message-optional-callback) |
| `Stats` | [*email.stats(from, to, callback)*](#emailstatsfrom-to-callback) |

### swisher_client.Email("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    email = new swisher_client.Email("AppSecretObtainFromSwisher.io",
    "AppIdObtainFromSwisher.io", {
      grantType : "access_token",
      scope     : ["Email"]
    });
```

### email.send(to, from, subject, message, optional, callback)
Parameters:
#### to (Array of JSON  Objects)
In this parameter, it should be specified recipients’details as a json array.

#### from (JSON Object)
Details of the sender.This also should be specified as a json object. Single email and name parameters as a object.

#### subject (String)
Subject of the email which it to be sent..

#### message (JSON Object)
Message that you want to send. This should be specified as a json array.

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **cc (Array of JSON objects)**
Carbon Copy address. This also should be specified as a json array.

* **bcc (Array of JSON objects)**
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

### email.stats(from, to, callback)
Parameters:
#### from (String)
Start date of the time period which the statistics should be obtained.
#### to (String)
End date of the time period which the statistics should be obtained.

```javascript

email.stats("2014-07-01", "2014-07-31", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
    console.dir(result);
  }
});
```

## 4. Scheduler
SMS Service.

| Method | Method Signature |
| ---- | ----- |
| `Constructor` | [*swisher_client.Scheduler("appSecret", "appId", [options])*](#swisher_clientschedulerappsecret-appid-options) |
| `Insert` | [*scheduler.insert(title, timeZone, startDate, optional, callback)*](#schedulerinserttitle-timezone-startdate-optional-callback) |
| `Get` | [*scheduler.get(_id, callback)*](#schedulerget_id-callback) |
| `List` | [*scheduler.list(optional, callback)*](#schedulerlistoptional-callback) |
| `Delete` | [*scheduler.delete(optional, callback)*](#schedulerdeleteoptional-callback) |
| `Stats` | [*scheduler.stats(from, to, callback)*](#schedulerstatsfrom-to-callback) |

### swisher_client.Scheduler("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    scheduler = new swisher_client.Scheduler("AppSecretObtainFromSwisher.io",
    "AppIdObtainFromSwisher.io", {
      grantType : "access_token",
      scope     : ["SchedulerRead", "SchedulerWrite"]
    });
```

### scheduler.insert(title, timeZone, startDate, optional, callback)
Parameters:

#### title (String)
Title of the scheduler event ( Max:500 characters).

#### timeZone (String)
TimeZone to process the start/end Times( Timezone should be standards TZ string values
from [TIMEZONES](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones) ).
ex: Asia/Colombo

#### startDate (String)
Start date of the scheduling event in the format yyyy-MM-dd.

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **description (String)**
Short description of the scheduler event(Max:1000 characters).

* **startTime (String)**
Start time of the scheduling event in the 24 hour format HH:mm:ss.If this not given then event will consider as a whole
 day event starting from 00:00:00.

* **endDate (String)**
Start date of the scheduling event in the format yyyy-MM-dd.

* **endTime (String)**
Start time of the scheduling event in the 24 hour format HH:mm:ss.If this not given then event will consider as a whole
 day event starting from 00:00:00.

* **location (String)**
Location of the current event.

* **organizer (String)**
Email Address of the event organizer if available.

* **attendees (String)**
Array of email addresses who attending to current event.These email will get a notification if specified.

* **notifyTypes (String)**
If provided then attendees will get a notification according to the time threshold of the event.Valid notify types
are ['email','sms','push'].

* **notifyNumbers (String)**
If notifyType provided as SMS then these are the numbers get notified.

* **callbackLink (String)**
If provided then this url will called (GET request) according to the threshold time.

* **thresholds (String)**
Threshold value ( when to fire the event before it happens).This must be a integer and it will be considered as minutes.
ex:5 (this means event will send notifications and execute callBackLink before 5 minutes of its start time).

```javascript

scheduler.insert(
  "Wake Up Its Christmas!",
  "Asia/Colombo",
  "2014-12-25",
  {
    "description": "Shake up the happiness. Wake up the happiness. Shake up the happiness. Its christmas time",
    "attendees": ["bob@myfriends.com", "john@myfriends.com"],
    "callbackLink": "http://wakeupmydad.com/hay-dad",
    "notifyTypes": ["sms"],
    "notifyNumbers": ["NOBILE_NUMBER1"],
    "startTime": "08:30:00"
  },
  function (err, result) {
    if (err) {
      // Handle Error Here
    } else {
      // -- Code Here
    }
  });
```

### scheduler.get(_id, callback)
Parameters:

#### \_id (String)
\_id received from the /insert or /list request which is the unique id of the scheduler event

```javascript

scheduler.get("75f9439ed416e0501294a3831abe", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### scheduler.list(optional, callback)
Should use one of the following key-params.You can have multiple key-value pairs as new POST param set.

Parameters:

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **title (String)**
Title of the scheduler event ( Max:500 characters).

* **description (String)**
Short description of the scheduler event(Max:1000 characters).

* **timeZone (String)**
TimeZone to process the start/end Times( Timezone should be standards TZ string values
from [TIMEZONES](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones) ).
ex: Asia/Colombo

* **startDate (String)**
Start date of the scheduling event in the format yyyy-MM-dd.

* **startTime (String)**
Start time of the scheduling event in the 24 hour format HH:mm:ss.
If this not given then event will consider as a whole day event starting from 00:00:00.

* **endDate (String)**
Start date of the scheduling event in the format yyyy-MM-dd.

* **endTime (String)**
Start time of the scheduling event in the 24 hour format HH:mm:ss.
If this not given then event will consider as a whole day event starting from 00:00:00.

* **organizer (String)**
Email Address of the event organizer if available.

```javascript

scheduler.list({"startDate":"2014-12-25"}, function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### scheduler.delete(optional, callback)
Should use one of the following key-params.You can have multiple key-value pairs as new POST param set.

Parameters:

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **title (String)**
Title of the scheduler event ( Max:500 characters).

* **description (String)**
Short description of the scheduler event(Max:1000 characters).

* **timeZone (String)**
TimeZone to process the start/end Times( Timezone should be standards TZ string values
from [TIMEZONES](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones) ).
ex: Asia/Colombo

* **startDate (String)**
Start date of the scheduling event in the format yyyy-MM-dd.

* **startTime (String)**
Start time of the scheduling event in the 24 hour format HH:mm:ss.
If this not given then event will consider as a whole day event starting from 00:00:00.

* **endDate (String)**
Start date of the scheduling event in the format yyyy-MM-dd.

* **endTime (String)**
Start time of the scheduling event in the 24 hour format HH:mm:ss.
If this not given then event will consider as a whole day event starting from 00:00:00.

* **organizer (String)**
Email Address of the event organizer if available.

```javascript

scheduler.delete({"title":"Wake Up Its Christmas!","startDate":"2014-12-25"}, function(err){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
  }
});
```

### scheduler.stats(from, to, callback)
Parameters:
#### from (String)
Start date of the time period which the statistics should be obtained.
#### to (String)
End date of the time period which the statistics should be obtained.

```javascript

scheduler.stats("2014-07-01", "2014-07-31", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
    console.dir(result);
  }
});
```

## 5. Notification
Notification Service.

| Method | Method Signature |
| ---- | ----- |
| `Constructor` | [*swisher_client.Notification("appSecret", "appId", [options])*](#swisher_clientnotificationappsecret-appid-options) |
| `SendMessagesToRecipients` | [*notification.sendMessagesToRecipients(recipients, msg, optional, callback)*](#notificationsendmessagestorecipientsrecipients-msg-optional-callback) |
| `SendMessagesToChannel` | [*notification.sendMessagesToChannel(channel, msg, optional, callback)*](#notificationsendmessagestochannelchannel-msg-optional-callback) |
| `Stats` | [*notification.stats(from, to, callback)*](#notificationstatsfrom-to-callback) |

### swisher_client.Notification("appSecret", "appId", [options])

```javascript

var swisher_client = require('swisher-client'),
    notification = new swisher_client.Notification("AppSecretObtainFromSwisher
    .io", "AppIdObtainFromSwisher.io", {
      grantType : "access_token",
      scope     : ["Notification"]
    });
```

### notification.sendMessagesToRecipients(recipients, msg, optional, callback)
Parameters:
#### recipients (Array of String)
Array of recipient IDs who are going to receive the message.

#### msg (String)
Message to deliver among users who are registered and subscribe to a specific channel.

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **deliverOffline (boolean)**
Sending offline messages (true/false).When it is true offline messages will deliver to particular channel.

```javascript

notification.sendMessagesToRecipients(["RecipientID1","RecipientID2"],"Hey!", {"deliverOffline":"true"},
  function(err, result){
    if (err) {
      // Handle Error Here
    } else {
      // -- Code Here
    }
});
```

### notification.sendMessagesToChannel(channel, msg, optional, callback)
Parameters:
#### channel (String)
Array of recipient IDs who are going to receive the message.

#### msg (String)
Message to deliver among users who are registered and subscribe to a specific channel.

#### optional (JSON)
Optional parameters (Empty object such as {} or JSON object provide with key value pairs);

* **deliverOffline (boolean)**
Sending offline messages (true/false).When it is true offline messages will deliver to particular channel.

```javascript

notification.sendMessagesToRecipients("ChannelName", "Hey!", {"deliverOffline":"true"},
  function(err, result){
    if (err) {
      // Handle Error Here
    } else {
      // -- Code Here
    }
});
```

### notification.stats(from, to, callback)
Parameters:
#### from (String)
Start date of the time period which the statistics should be obtained.
#### to (String)
End date of the time period which the statistics should be obtained.

```javascript

notification.stats("2014-07-01", "2014-07-31", function(err, result){
  if (err) {
    // Handle Error Here
  } else {
    // -- Code Here
    console.dir(result);
  }
});
```

## Contributing
* Gihan Karunarathne <gckarunarathne@gmail.com>

## Release History
_0.2.3_

## License
thinkCube Systems (Pvt) Ltd. (http://thinkcube.com/)
Copyright (c) 2014 thinkCube Systems (Pvt) Ltd
