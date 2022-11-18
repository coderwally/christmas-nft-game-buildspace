import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../constants";
import christmasGame from "../../utils/ChristmasGame.json";
import "./Gallery.css";

import uuid from 'react-uuid'
//import LoadingIndicator from "../LoadingIndicator";

const Gallery = () => {
  //const [gameContract, setGameContract] = useState(null);

  const [holders, setHolders] = useState([]);
  const [attribs, setAttribs] = useState([]);

  useEffect(() => {
    console.log('GALLERY LOADING');
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

    if (contract)
    {
      console.log('WE HAVE A CONTRACT');
      console.log(contract);
    }
    //setGameContract(contract);
    const fetchAllPlayers = async () => {
      contract.getAllPlayers().then((response, err) => {
        if (isMounted) {
          console.log('HOLDERS2');
          console.log(response[0]);
          console.log(response[1]);
  
          setHolders(response[0]);
          setAttribs(response[1]);
        }
      });

      console.log('ATTRIBUTES FETCHED FROM CONTRACT');
    }

    fetchAllPlayers();
    
    return () => {
      isMounted = false;
    };
  }, []);


  const showCharacter = (attrib) => {
    if (!attrib) return <></>;
    return (
      <>
        <h2 key={uuid()}>NAME: {attrib?.name}</h2>
        <h5 key={uuid()}>TOKENID: {attrib?.tokenId}</h5>
        <img className="gallery-image" alt="" src={`https://ipfs.io/ipfs/${attrib?.imageURI}`} />
      </>
    );
  }

  return (
    <div className="gallery-main-container">
      <h2 className="gallery-header">All players</h2>
      <div className="gallery-container">
        <div></div>
        <div>
          {holders.map((hld, idx) => {
            return (
              <ul key={`${uuid()}`}>
                <li key={uuid()}>
                  <h2 key={`HOLDER${uuid()}`}>HOLDER ({idx}): {hld.toString()}</h2>
                </li>
                <li key={uuid()}>
                  {showCharacter(attribs[idx])}
                </li>
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
