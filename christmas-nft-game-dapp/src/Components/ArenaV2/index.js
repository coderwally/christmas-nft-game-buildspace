import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import christmasGame from "../../utils/ChristmasGame.json";
import "./ArenaV2.css";
import LoadingIndicator from "../LoadingIndicator";
import TokenCard from "../TokenCard";
import { Box, Button, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

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
  };

  return (
    <SimpleGrid columns={3}>
      <Box>
        {characterNFT && (
          <Flex
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Heading color={"white"} size={"lg"} py={2}>
              Your Character
            </Heading>
            <TokenCard
              title={getTitle(characterNFT.name, characterNFT.tokenId)}
              imageURI={`https://ipfs.io/ipfs/${characterNFT.imageURI}`}
              jp={characterNFT.joyPoints}
              maxJp={characterNFT.maxJoyPoints}
              bgColor={"gray"}
              showFooter={true}
              footerLabel={"🌟 Attack Damage 🌟"}
              footerText={characterNFT.attackDamage}
            />
          </Flex>
        )}
      </Box>
      <Box alignItems={"center"} justifyContent={"flex-start"} display={"flex"}>
        {boss && (
          <Button onClick={runAttackAction} colorScheme={"pink"} m={"auto"}>
            {`💥 Attack ${boss.name}`}
          </Button>
        )}
      </Box>
      <Box>
        {boss && (
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Heading color={"white"} size={"lg"} py={2}>
              Boss
            </Heading>
            <TokenCard
              title={boss.name}
              imageURI={`https://ipfs.io/ipfs/${boss.imageURI}`}
              jp={boss.joyPoints}
              maxJp={boss.maxJoyPoints}
              bgColor={"red.700"}
            />
          </Flex>
        )}
      </Box>
    </SimpleGrid>
  );
};

export default ArenaV2;
