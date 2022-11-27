import React, { useEffect, useState } from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";

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
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
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

  const changeToCorrectNetwork = async () => {
    const { ethereum } = window;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
      console.log("You have switched to the right network");
    } catch (switchError) {
      // The network has not been added to MetaMask
      if (switchError.code === 4902) {
        console.log("Please add the Goerli network to MetaMask");
      }
      console.log("Cannot switch to the network");
      console.log(switchError);
    }
  };

  useEffect(() => {
    const checkNetwork = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();

      try {
        //if (chainId !== 80001 && chainId !== 886688) {
        if (chainId !== 5 && chainId !== 886688) {
          setShowNetworkWarning(true);
        } else {
          setShowNetworkWarning(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    });

    provider.provider.on("accountsChanged", function (accounts) {
      window.location.reload();
    });

    setIsLoading(true);
    checkNetwork();
    checkIfWalletIsConnected();

    console.log("Contract Address on load:");
    console.log(CONTRACT_ADDRESS);
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

      try {
        const characterNFT = await gameContract.checkIfUserHasNFT();

        if (characterNFT.name) {
          console.log("User has character NFT");
          setCharacterNFT(transformCharacterData(characterNFT));
        }
      } catch (error) {}
      setIsLoading(false);
    };

    if (currentAccount) {
      if (!showNetworkWarning) {
        fetchNFTMetadata();
      }
    }
  }, [currentAccount, showNetworkWarning]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (showNetworkWarning) {
      return <></>;
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
            <PageHeader currentAccount={currentAccount} />
          </div>
          <div className="content-container">
            {showNetworkWarning && (
              <>
                <Alert status="error" justifyContent={"center"}>
                  <AlertIcon />
                  <AlertTitle>Incorrect network</AlertTitle>
                  <AlertDescription>
                    Please change to the Goerli network
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={changeToCorrectNetwork}
                  size="lg"
                  m={5}
                  colorScheme="red"
                >
                  Change network
                </Button>
              </>
            )}
            {!showNetworkWarning && renderContent()}
          </div>
          <PageFooter />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
