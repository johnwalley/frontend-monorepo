import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

class EthereumWallet {
  connectBtn = 'ethereum-wallet-connect';
  disconnectBtn = 'ethereum-wallet-disconnect';
  wrongChainMessage = 'wrong-chain-message';
  connectedWrapper = 'ethereum-active';
  splash = 'ethereum-splash';

  validateConnectButtonDisplayed() {
    cy.getByTestId(this.connectBtn).should('be.visible');
  }

  validateEthereumWalletConnected() {
    cy.getByTestId(this.connectedWrapper).should('be.visible');
  }

  validateEthereumWalletNotConnected() {
    cy.getByTestId(this.splash).should('be.visible');
  }
}

const ethereumWallet = new EthereumWallet();

And('my Ethereum wallet is not connected', () => {
  ethereumWallet.validateEthereumWalletNotConnected();
});

And('my Ethereum wallet is connected', () => {
  ethereumWallet.validateEthereumWalletConnected();
});

When('I connect my wallet', () => {
  cy.connectEthereumWallet();
});

Then('connect to Ethereum wallet button displayed', () => {
  ethereumWallet.validateConnectButtonDisplayed();
});
