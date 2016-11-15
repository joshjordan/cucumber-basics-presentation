var jsonPath = require('JSONPath').eval;
var url = require('url')

var BreweryDbStepsWrapper = function () {

  this.World = require('../support/world.js').World

  var BEER_IDS = {
    "Lagunitas IPA": "iLlMCb"
  }
  this.When(/^I fetch the details for (.*)$/, function(beerName, callback) {
    var beerId = BEER_IDS[beerName];
    if(this.apiKey)
      this.get("beer/" + beerId + "?key=" + this.apiKey, callback);
    else
      this.get("beer/" + beerId , callback);
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
    this.apiKey = '407404bac21ffcf4ae440c003c1936f8';
    callback()
  });

  this.Then(/^I should see that the beer is (.*)% ABV$/, function(expectedAbv, callback) {

    var json = JSON.parse(this.lastResponse.body)
    if(json.data.abv != expectedAbv)
      callback.fail("Expected " + expectedAbv + "% ABV, but got: " + json.data.abv)

    callback()
  });
}

module.exports = BreweryDbStepsWrapper
