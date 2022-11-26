import React, { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import "./AppV2.css";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import christmasGameContract from "./utils/ChristmasGame.json";
import { ethers } from "ethers";
import Gallery from "./Components/Gallery";
import LoadingIndicator from "./Components/LoadingIndicator";
import PageFooter from "./Components/PageFooter";
import PageHeader from "./Components/PageHeader";
import ConnectWallet from "./Components/ConnectWallet";
import ArenaV2 from "./Components/ArenaV2";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const checkNetwork = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    console.log(`Detected Chain ID: ${chainId}`);

    try {
      if (chainId !== 80001 && chainId !== 886688) {
        alert("Please connect to Polygon Mumbai!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkNetwork();
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        christmasGameContract.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();

      if (characterNFT.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(characterNFT));
      }

      setIsLoading(false);
    };

    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return <ConnectWallet setCurrentAccount={setCurrentAccount} />;
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return (
        <div className="content-subcontainer">
          <SelectCharacter setCharacterNFT={setCharacterNFT} />
          <hr />
          <Gallery />
        </div>
      );
    } else if (currentAccount && characterNFT) {
      return (
        <div className="content-subcontainer">
          <ArenaV2
            characterNFT={characterNFT}
            setCharacterNFT={setCharacterNFT}
          />
          <hr />
          <Gallery />
        </div>
      );
    }
  };

  return (
    <ChakraProvider>
      <div className="App">
        <div className="container2">
          <div className="header-container">
            <PageHeader />
          </div>
          <div className="content-container">{renderContent()}</div>
          <PageFooter />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
