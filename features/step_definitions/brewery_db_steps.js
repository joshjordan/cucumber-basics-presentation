
'use strict';

/* jshint -W061 */
// wtf jshint? eval can be harmful? But that is not eval, it's JSONPath#eval
var jsonPath = require('JSONPath').eval;
/* jshint +W061 */
var url = require('url')

var BreweryDbStepsWrapper = function () {

  this.World = require('../support/world.js').World

  var BEER_IDS = {
    "Lagunitas IPA": "iLlMCb"
  }
  this.When(/^I fetch the details for (.*)$/, function(beerName, callback) {
    var beerId = BEER_IDS[beerName];
    this.get("beer/"+beerId, callback);
  });

  this.Then(/^I should receive a response indicating that I haven't authenticated$/, function(callback) {
    if(this.lastResponse.statusCode != 401)
      callback.fail("Expected 401 Unauthorized, but got: " + this.lastResponse.statusCode)

    var json = JSON.parse(this.lastResponse.body)
    if(json.errorMessage != 'API key is not set in the query string.')
      callback.fail("Expected error message regarding API, but got: " + json.errorMessage || this.lastResponse.body)

      callback()
  });

  this.Given(/^I am an authenticated Brewery DB user$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.When(/^I fetch the details for Laguniatas IPA$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^I should see that the beer is (\d+)\.(\d+)% ABV$/, function(arg1, arg2, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });
}

module.exports = BreweryDbStepsWrapper
