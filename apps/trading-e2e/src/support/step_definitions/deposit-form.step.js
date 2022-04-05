import { Then } from 'cypress-cucumber-preprocessor/steps';
import DepositPage from '../pages/deposit-page';

const depositPage = new DepositPage();

Then('I can submit a deposit', () => {
  depositPage.validateFormIsDisplayed();
  depositPage.submitDeposit();
});
