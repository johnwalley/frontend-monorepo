Feature: Deposits

  Scenario: Connect and deposit
    Given I am on the homepage
    And I navigate to the deposit page
    And my Ethereum wallet is not connected
    When I connect my wallet
    Then I can submit a deposit
