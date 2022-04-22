import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getConfig from './config.js';
import * as nearAPI from 'near-api-js';

//near wallet selector imports
import NearWalletSelector from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import nearWalletIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import senderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";

const { networkId, contractName } = getConfig(process.env.NODE_ENV || 'development')
// Initializing contract
async function initContract() {
  // get network configuration values from config.js
  // based on the network ID we pass to getConfig()
  const nearConfig = getConfig(process.env.NEAR_ENV || 'testnet');

  const selector = await NearWalletSelector.init({
    network: "testnet",
    contractId: "dev-1650658697814-32747213993531",
    wallets: [
      setupNearWallet({iconUrl: nearWalletIconUrl}),
      setupSender({iconUrl: senderIconUrl}),
  
    ],
  });

  
/*
  // create a keyStore for signing transactions using the user's key
  // which is located in the browser local storage after user logs in
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  // Initializing connection to the NEAR testnet
  const near = await nearAPI.connect({ keyStore, ...nearConfig });

  // Initialize wallet connection
  const walletConnection = new nearAPI.WalletConnection(near);
*/
window.sector = selector;

selector.on("signIn", () => window.location.replace(window.location.origin + window.location.pathname));
  // Load in user's account data
  
  let currentUser;
  if (selector.isSignedIn()) {

    const account = (await selector.getAccounts())[0];
    console.log(account)
    window.accountId = account.accountId;
    const provider = new nearAPI.providers.JsonRpcProvider({
      url: selector.network.nodeUrl,
    });

    currentUser = {
      // Gets the accountId as a string
      accountId:  window.accountId,
      // Gets the user's token balance
      balance:  (await provider.query(`account/${account.accountId}`, "")).amount
    };
  }



  return { currentUser, nearConfig, selector };
}

window.nearInitPromise = initContract().then(
  ({ currentUser, nearConfig, selector }) => {
    ReactDOM.render(
      <App
        
        currentUser={currentUser}
        nearConfig={nearConfig}
        selector={selector}
      />,
      document.getElementById('root')
    );
  }
);
