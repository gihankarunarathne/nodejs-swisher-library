describe('Notification swisher client', function(){
  var Notifications = require('../lib/Notification');
  var assert = require('assert');
  var testConf = require('./config_test.json');

  var notifService;

  before(function (done) {
    notifService = new Notifications.Notification(testConf.testAppSecret, testConf.testAppId, {
      grantType: "access_token",
      scope: ['Notification']
    });
    console.log("Start Tests");
    done();
  });

  it('Should successfully trigger events', function(done){
    notifService.trigger('myChannel', 'myEvent', 'my message', function(err, data){
      console.log(err)

      if(!err){
        assert.equal(data.msg, "Success");
        done();
      }
    });
  });
});
