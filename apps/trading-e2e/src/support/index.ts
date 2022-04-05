// Import commands.js using ES2015 syntax:
import '@vegaprotocol/cypress';
import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    connectEthereumWallet(): void;
  }
}

const TEST_PRIVATE_KEY =
  '0xe580410d7c37d26c6ad1a837bbae46bc27f9066a466fb3a66e770523b4666d19';
export const TEST_ADDRESS = new Wallet(TEST_PRIVATE_KEY).address;

class CustomizedBridge extends Eip1193Bridge {
  chainId = 3;

  async sendAsync(...args) {
    console.debug('sendAsync called', ...args);
    return this.send(...args);
  }

  async send(...args) {
    console.debug('send called', ...args);
    const isCallbackForm =
      typeof args[0] === 'object' && typeof args[1] === 'function';
    let callback;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS] });
      } else {
        return Promise.resolve([TEST_ADDRESS]);
      }
    }
    if (method === 'eth_chainId') {
      if (isCallbackForm) {
        callback(null, { result: '0x3' });
      } else {
        return Promise.resolve('0x3');
      }
    }
    try {
      const result = await super.send(method, params);
      console.debug('result received', method, params, result);
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } catch (error) {
      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  }
}

Cypress.on('window:before:load', (win) => {
  win.localStorage.clear();
  const provider = new JsonRpcProvider(
    'https://ropsten.infura.io/v3/4f846e79e13f44d1b51bbd7ed9edefb8'
  );
  const signer = new Wallet(TEST_PRIVATE_KEY, provider);
  // @ts-ignore win.ethereum not defined
  win.ethereum = new CustomizedBridge(signer, provider);
});

// @ts-ignore - ignoring Cypress type error which gets resolved when Cypress uses the command
Cypress.Commands.add('connectEthereumWallet', () => {
  cy.window().then((win) => win.localStorage.clear());
  cy.get(`[data-testid="ethereum-wallet-connect"]`).click();
  cy.get(`[data-testid="web3-connector-list"]`)
    .children()
    .should('have.length', 2);
  cy.get('[data-testid="web3-connector-metamask"]').click();
  cy.get('[data-testid="ethereum-active"]').should('be.visible');
});
