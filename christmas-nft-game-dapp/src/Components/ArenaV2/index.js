import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import christmasGame from "../../utils/ChristmasGame.json";
import "./ArenaV2.css";
import LoadingIndicator from "../LoadingIndicator";
import TokenCard from "../TokenCard";
import { Button, Flex, Heading } from "@chakra-ui/react";

const ArenaV2 = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        christmasGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      setBoss(transformCharacterData(bossTxn));
    };

    const onAttackComplete = (from, newBossHp, newPlayerHp) => {
      const bossJoyPoints = newBossHp.toNumber();
      const playerJoyPoints = newPlayerHp.toNumber();

      console.log(
        `AttackComplete: Boss Hp: ${bossJoyPoints} Player Hp: ${playerJoyPoints}`
      );

      setBoss((prevState) => {
        return { ...prevState, hp: bossJoyPoints };
      });
      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerJoyPoints };
      });
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on("AttackComplete", onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract, setCharacterNFT]);

  const getTitle = (name, tokenId) => {
    if (tokenId) {
      return `${name} (#${tokenId})`;
    }
    return `${name}`;
  }

  return (
    <Flex className="arena-container" justifyContent={'space-evenly'} >
      {/* {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )} */}

      <Flex flexGrow={2} justifyContent={'flex-end'} bg={'pink'} flexDir={'column'}>
      {characterNFT && (
        <>
            <Heading color={'white'} size={'lg'} py={2} border={'1px dashed red'}>Your Character</Heading>
            <TokenCard
              title={getTitle(characterNFT.name, characterNFT.tokenId)}
              imageURI={`https://ipfs.io/ipfs/${characterNFT.imageURI}`}
              jp={characterNFT.joyPoints}
              maxJp={characterNFT.maxJoyPoints}
              bgColor={"gray"}
              showFooter={true}
              footerLabel={"Attack Damage"}
              footerText={characterNFT.attackDamage}
            />
        </>
      )}
      </Flex>

      <Flex flexGrow={1}>
      {boss && (
        <Flex alignItems={'center'}>
          <Button onClick={runAttackAction} colorScheme={"orange"}>
            {`💥 Attack ${boss.name}`}
          </Button>
        </Flex>
      )}
      </Flex>

    <Flex flexGrow={2}>
      {boss && (
        <div className="boss-container">
          <Heading color={'white'} size={'lg'} py={2}>Boss</Heading>
          <TokenCard
            title={boss.name}
            imageURI={`https://ipfs.io/ipfs/${boss.imageURI}`}
            jp={boss.joyPoints}
            maxJp={boss.maxJoyPoints}
            bgColor={"red.700"}
          />
        </div>
      )}
      </Flex>
    </Flex>
  );
};

export default ArenaV2;
