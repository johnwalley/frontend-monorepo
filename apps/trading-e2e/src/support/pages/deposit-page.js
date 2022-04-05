import { TEST_ADDRESS } from '..';
import BasePage from './base-page';

export default class DepositPage extends BasePage {
  form = 'deposit-form';

  validateFormIsDisplayed() {
    cy.getByTestId(this.form).should('exist');
  }

  submitDeposit({
    from = TEST_ADDRESS,
    // tBTC on testnet
    asset = '5cfa87844724df6069b94e4c8a6f03af21907d7bc251593d08e4251043ee9f7c',
    to = 'f8885edfa7ffdb6ed996ca912e9258998e47bf3515c885cf3c63fb56b15de36f',
  }) {
    cy.get('input[name="from"]').should('have.value', from);
    cy.get('select[name="asset"]').select(asset);
    cy.get('input[name="to"]').clear().type(to);
    // cy.get('input[name="amount"]').clear().type('100');
    // cy.get('button[type="submit"]').click();
  }
}
