const CONTRACT_ADDRESS_GOERLI = process.env.CONTRACT_ADDRESS_GOERLI;
const CONTRACT_ADDRESS_FUJI = process.env.CONTRACT_ADDRESS_FUJI;

const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory(
    "ChristmasGame"
  );

  const gameContract = await gameContractFactory.attach(
    CONTRACT_ADDRESS_GOERLI
  );

  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  console.log("TESTING CONTRACT");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Character minted");

  txn = await gameContract.attackBoss();
  await txn.wait();
  console.log("Boss attacked #1");

  txn = await gameContract.attackBoss();
  await txn.wait();
  console.log("Boss attacked #2");

  console.log("Done!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
