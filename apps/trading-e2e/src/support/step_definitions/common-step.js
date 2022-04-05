import { Given, When } from 'cypress-cucumber-preprocessor/steps';
import MarketsPage from '../pages/markets-page';
import DealTicketPage from '../pages/deal-ticket-page';
import DepositPage from '../pages/deposit-page';

const marketsPage = new MarketsPage();
const dealTicketPage = new DealTicketPage();
const depositPage = new DepositPage();

Given('I am on the homepage', () => {
  cy.visit('/');
});

Given('I navigate to markets page', () => {
  marketsPage.navigateToMarkets();
});

Given('I navigate to portfolio page', () => {
  marketsPage.navigateToPortfolio();
});

Given('I navigate to the deposit page', () => {
  depositPage.navigateToDeposit();
});

When('I connect to Vega Wallet', () => {
  marketsPage.navigateToConnectVegaWallet();
  marketsPage.fillInWalletForm(
    'UI_Trading_Test',
    Cypress.env('tradingWalletPassphrase')
  );
  marketsPage.clickConnectVegaWallet();
  dealTicketPage.reloadPageIfPublicKeyErrorDisplayed();
});
