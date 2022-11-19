import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../constants";
import christmasGame from "../../utils/ChristmasGame.json";
import "./Gallery.css";

import uuid from "react-uuid";
import TokenCard from "../TokenCard";
import { shouldShowFallbackImage } from "@chakra-ui/react";
//import LoadingIndicator from "../LoadingIndicator";

const Gallery = () => {
  const [holders, setHolders] = useState([]);
  const [attribs, setAttribs] = useState([]);

  useEffect(() => {
    console.log("GALLERY LOADING");
    const { ethereum } = window;
    let isMounted = true;

    let contract;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        christmasGame.abi,
        signer
      );
    } else {
      console.log("Ethereum object not found");
    }

    const fetchAllPlayers = async () => {
      contract.getAllPlayers().then((response, err) => {
        if (isMounted) {
          setHolders(response[0]);
          setAttribs(response[1]);
        }
      });
    };

    fetchAllPlayers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="gallery-main-container">
      <h2 className="gallery-header">All players</h2>
      <div className="break"></div>
      <div className="gallery-container">
        {holders.map((hld, idx) => {
          const owner = hld;
          const name = attribs[idx]?.name;
          const tokenId = attribs[idx]?.tokenId?.toNumber();
          const jp = attribs[idx]?.joyPoints?.toNumber();
          const maxJp = attribs[idx]?.maxJoyPoints?.toNumber();
          const imageURI = attribs[idx]?.imageURI
            ? `https://ipfs.io/ipfs/${attribs[idx]?.imageURI}`
            : "";

          const displayOwner = `${hld?.substring(0, 6)}....${hld?.slice(-6)}`;

          return (
            <div key={uuid()}>
              <TokenCard
                title={`${name} (#${tokenId})`}
                jp={jp}
                maxJp={maxJp}
                imageURI={imageURI}
                bgColor={"green.700"}
                footerLabel={"OWNER"}
                footerText={displayOwner}
                showFooter={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
