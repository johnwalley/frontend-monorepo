import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';

export const metamask = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions)
);

export const walletconnect = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: {
        1: `https://mainnet.infura.io/v3/${process.env['NX_INFURA_ID']}`,
        3: `https://ropsten.infura.io/v3/${process.env['NX_INFURA_ID']}`,
      },
    }),
  [1, 3]
);

export const Connectors = {
  metamask,
  walletconnect,
};