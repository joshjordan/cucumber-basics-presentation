Feature: BreweryDB integration
  As a beer snob
  I want to fetch beer details through the Brewery DB API
  so I know which beers are most delicious

  Scenario: Unauthenticated API request
    When I fetch the details for Lagunitas IPA
    Then I should receive a response indicating that I haven't authenticated

  Scenario: Get beer details
    Given I am an authenticated Brewery DB user
    When I fetch the details for Lagunitas IPA
    Then I should see that the beer is 6.2% ABV
