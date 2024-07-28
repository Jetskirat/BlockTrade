import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import PropTypes from "prop-types";

// INTERNAL IMPORTS
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "./constants.js";

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signerOrProvider);

export const MarketplaceContext = React.createContext();

export const MarketplaceProvider = ({ children }) => {
  const titleData = "Marketplace";
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState(null);

  const createProduct = async (product) => {
    const { name, price } = product;

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createProduct(name, ethers.utils.parseUnits(price, 18));
      await transaction.wait();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const purchaseProduct = async (id, price) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.purchaseProduct(id, { value: ethers.utils.parseUnits(price, 18) });
      await transaction.wait();
      console.log("Transaction Mined", transaction);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getProducts = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const products = await contract.getProductCount();  // Adjust this according to your contract

    const parsedProducts = [];
    for (let i = 1; i <= products.toNumber(); i++) {
      const product = await contract.products(i);
      parsedProducts.push({
        id: product.id.toNumber(),
        name: product.name,
        price: ethers.utils.formatEther(product.price.toString()),
        owner: product.owner,
        purchased: product.purchased,
      });
    }

    return parsedProducts;
  };

  const ifWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        setError("Install Metamask");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        return true;
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("Something wrong while connecting to the wallet ", error);
      return false;
    }
  };

  useEffect(() => {
    ifWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Install Metamask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Something wrong while connecting to the wallet", error);
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        titleData,
        currentAccount,
        connectWallet,
        createProduct,
        purchaseProduct,
        getProducts,
        error,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
MarketplaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};