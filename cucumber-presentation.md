Cucumber for API testing

What is Cucumber?

* An automated testing framework
* Supports "Behavior Driven Development" (henceforth BDD)
* _Not_ a language

_Just_ a test framework. Can be used for:

* Unit testing
* Integration testing
* Test-driven development
* Behavior-driven development

So, what level of test isolation are we talking about?

* Local, in-process
* Throwaway environment
* Fully integrated system

Cucumber is _just a test driver_, and that means that ultimately, it just execute code. If NUnit, or Karma, or Mocha, or RSpec, or unittest can do it, so can Cucumber.

What is Gherkin?

* The language that cucumber understands for specifying tests
* Does _not_ implement test execution
* Usually, synonymous with Cucumber

Anatomy of a Gherkin feature

  Lines 2–4 are unparsed text, which is expected to describe the business value of this feature. Line 6 starts a scenario. Lines 7–13 are the steps for the scenario. Line 15 starts next scenario and so on

  1: Feature: Some terse yet descriptive text of what is desired
  2:   Textual description of the business value of this feature
  3:   Business rules that govern the scope of the feature
  4:   Any additional information that will make the feature easier to understand
  5:
  6:   Scenario: Some determinable business situation
  7:     Given some precondition
  8:       And some other precondition
  9:     When some action by the actor
  10:       And some other action
  11:       And yet another action
  12:     Then some testable outcome is achieved
  13:       And something else we can check happens too
  14:
  15:   Scenario: A different situation
  16:       ...

Steps (Given, When, Then)

* Compose a scenario
* Reusable components of testing
* May call other steps internally
* May be templated with regular expressions
* May be iterated over with tables

^ will come back that during code examples

Step Definitions

  this.When(/^I GET the root path$/,
    function(callback) {
      this.lastResponse = this.get('/', callback)
  })

  this.Then(/^I should receive a successful response$/, function(callback) {
    if (this.lastResponse.statusCode != 200 ) {
      callback.fail('Expected HTTP status 200, but received: ' + this.lastResponse.statusCode)
    } else {
      callback()
    }
  })

^ reusable, so now that I've written this step, I could write many tests that hit the root path, and I could write many tests that assert successful resposnes.

But we can do better!

  this.When(/^I GET the root path$/,
    function(callback) {
      this.step('I GET /', callback)
  })

  this.When(/I GET (\S+)$)/, function(path, callback) {
    this.lastResponse = this.get(path, callback)
  })

Or, better yet:

  this.When(/^I GET the root path$/,
    function(callback) {
      this.step('I GET /', callback)
  })

  this.When(/I (\w+) (\S+)$)/, function(httpVerb, path, callback) {
    httpMethod = this[httpVerb.toLowerCase()]
    this.lastResponse = httpMethod(path, callback)
  })

That feels better. What about my *Then*?

  this.Then(/^I should receive a successful response$/, function(callback) {
    this.step('the response status code should be 200')
  })

  this.Then(/^the response status code should be (\d+)$/, function(statusCode, callback) {
    if (this.lastResponse.statusCode != statusCode) {
      callback.fail('Expected HTTP status ' + statusCode + ', but received: ' + this.lastResponse.statusCode)
    } else {
      callback()
    }
  })

So far, this should feel like unit testing with some interesting reusability mechanisms. But its still just executing arbitrary code.

More Ways to Execute Arbitrary Code

  Feature-wide setup (equivalent of a unit test framework's setup method)
  Background:
    Given a $100 microwave was sold on 2015-11-03
    And today is 2015-11-18

  Tags

  @mockDeliveryOptionsService
  Scenario: user types in shipping instructions
    ...

  @ignore
  Scenario: user yells shipping instructions at computer
    ...

^ Group tags for execution; change behavior. Could use to acquire JWTs for each persona with different scopes. I prefer to just use explicit steps (Given instead of tag). Could be used to mock services, change their configuration (in throwaway env), or change global behavior (e.g. error handling - most API calls test that we aren't exceeding a throttling limit, but for a very specific test, we want to make assertions about what happens when we do)

Tables

Scenario Outline: feeding a suckler cow
  Given the cow weighs <weight> kg
  When we calculate the feeding requirements
  Then the energy should be <energy> MJ
  And the protein should be <protein> kg

  Examples:
    | weight | energy | protein |
    |    450 |  26500 |     215 |
    |    500 |  29500 |     245 |
    |    575 |  31500 |     255 |
    |    600 |  37000 |     305 |

^ really nice for testing edge cases, IF you can manage to keep your tests following the exact same step format. I find that you can't often do that. Good for calculations, not great for testing different paths (success vs failure) because of additional assertions you might have to make, and you get away from...

Language

What language? Any. Or many (although then you can't share steps). But, try JS if you are dealing purely with APIs. Javascript speaks JSON natively.

Step Definitions

Just code!
(demo)

Why Cucumber?

Involving non-technical stakeholders

Did you notice that the features I wrote were completely human readable, and I abstracted away the details of how to execute them?
* Means non-technical stakeholders can (not should, just can) be involved
* Can divorce feature/scenario writing from implementation
* Clean path to incrementally raising the level of abstraction
* Living, breathing documentation that (should) always be in sync with reality

How does this fit into your lifecycle?
* Basic workflow: dev only. Dev writes code, dev tests code with Cucumber.
* Basic+: Dev writes test, dev writes minimum code to implement, dev refactors code.
* QA & Dev: QA writes features/scenarios, dev writes tests to fulfill.
^ Dev builds a library of tests for QA to use and eventually QA can write tests that don't need step implementations
* PO -> QA -> Dev
^ alignment around acceptance criteria. living documentation that proves your feature set. no one ever asks you "how does this work again?"

Going further
* Cucumber as part of continuous integration
* Cucumber as a gating factor for continuous deployment
* Cucumber running periodically against an integration environment
^ Catches bugs in data. We have this problem all the time. Catches transient failures in the lieu of better alarms.
* Experimental: build exploratory "users" that persist data between runs to effectively mutate test scenarios

When to Cuke

My personal opinion: anytime you need to test the user's perspective. Without building deep hooks into your stack, these tests exist at the level of the interface that you expose. This is the same level a user/client sees. We often test individual systems (up to the service level), but end-to-end integration testing is hard.

* API integration testing
* Web application testing
* Mobile device testing

When Not to Cuke

My personal opinion: When you need to test internals. You end up managing a lot of state that I think is better accomplished with tools made to go in that deep. However, Cucumber is just code and it is doable.

A word on APIs as products

API products are not just APIs.
* Documentation
* A portal that may have custom-built functionality
* Interactive consoles swagger

^ test that your documentation at least exists. Browser testing against swagger to prove your console works. Have a user actually "sign up" through your portal, and then make an API call.

Think like a client - what might they do?

^ Probably exactly what you tell them to do. Did you test that?

Resources

Cucumber
* Cucumber documentation https://cucumber.io/docs/reference
* Cucumber wiki https://github.com/cucumber/cucumber/wiki
Implementations
* C#: SpecFlow http://www.specflow.org/
* http://www.slideshare.net/ask4answers/rest-api-testing-with-specflow
* Cucumber.js https://github.com/cucumber/cucumber-js
API Testing
* https://github.com/apickli/apickli
* https://github.com/jayzes/cucumber-api-steps
BDD
* BDD & Cucumber (first half only) http://www2.smartbear.com/rs/800-TIV-782/images/Achieving%20API%20Agility%20with%20BDD%20and%20CI.pdf
* BDD for APIs http://www.slideshare.net/JasonHarmon1/bdd-for-apis
