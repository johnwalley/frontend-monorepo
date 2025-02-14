@ignore
Feature: Withdrawals

  Scenario: Can prepare a withdrawal
    Given I am on withdraw page
    And I connect eth wallet
    And I connect vega wallet
    And I can see the withdrawals warning info
    And I can see the from ethereum address field is automatically populated with current connected key
    And I select asset 'tBTC'
    And I input '100' tokens to withdraw
    And the withdraw button is enabled
    When I click the withdraw button
    Then The vega transaction is sent
    Then The Ethereum transaction is triggered

  Scenario: Form field validation if fields are incomplete
    Given I am on withdraw page
    And I connect eth wallet
    And I connect vega wallet
    When I click the withdraw button
    Then I can see validation errors on incomplete fields

  Scenario: Can prepare a withdrawal to send to another eth wallet
    Given I am on withdraw page
    And I connect eth wallet
    And I connect vega wallet
    And I select asset 'tBTC'
    And I can see an eth address is already filled in the withdraw to field
    When I click the enter manually button
    Then I can enter a new eth address
    And I input '100' tokens to withdraw
    And the withdraw button is enabled
    When I click the withdraw button
    Then The vega transaction is sent
    Then The Ethereum transaction is triggered

  Scenario: Eth key validation on form
    Given I am on withdraw page
    And I connect eth wallet
    And I connect vega wallet
    And I select asset 'tBTC'
    When I click the enter manually button
    And I enter eth address 'MMMMNNNN'
    Then the invalid eth address error is shown

  Scenario: Validation error if trying to withdraw more than available
    Given I am on withdrawals page
    And I have connected
    And I select asset 'tBTC'
    And I input '1088494949494949940' tokens to withdraw
    When I click the withdraw button
    Then validation error is shown for token input amount

  Scenario: Can see pending / unfinished withdrawals
    Given I am on the withdrawals page
    And I can see there are unfinished withdrawals
    And I can see the complete withdrawals button

  # Needs capsule
  @manual
  Scenario: Finish withdrawal to eth wallet
    Given I am on the withdrawals page
    And I can see there are unfinished withdrawals
    And I click on an unfinished withdrawal button
    Then I approve transaction on ethereum
    Then I can see the withdrawal button state has changed to pending
    When The transaction is complete
    Then My balance has been updated

  @manual
  Scenario: Withdrawals after chain reset
    Given I am on the withdrawals page
    And I previously had withdrawals
    And There has been a chain reset
    Then There should be no incomplete withdrawals
