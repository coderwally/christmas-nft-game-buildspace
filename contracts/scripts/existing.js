const CONTRACT_ADDRESS_GOERLI = process.env.CONTRACT_ADDRESS_GOERLI;
const CONTRACT_ADDRESS_FUJI = process.env.CONTRACT_ADDRESS_FUJI;
const CONTRACT_ADDRESS_LOCAL = process.env.CONTRACT_ADDRESS_LOCAL;

const PRIVATE_KEY_DUMMY1 = process.env.PRIVATE_KEY_DUMMY1;
const PRIVATE_KEY_DUMMY2 = process.env.PRIVATE_KEY_DUMMY2;
const PRIVATE_KEY_DUMMY3 = process.env.PRIVATE_KEY_DUMMY3;

const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory(
    "ChristmasGame"
  );

  const gameContract = await gameContractFactory.attach(CONTRACT_ADDRESS_LOCAL);

  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  console.log("TESTING CONTRACT");

  //await hre.network.provider.send("hardhat_reset");

  //const players = await gameContract.getAllPlayers();
  //console.log(players);

  let dummyWallets = [];

  //console.log('PROVIDER:');
  //console.log(hre.ethers.provider);

  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();

  let hasNft = await gameContract.checkIfUserHasNFT();
  console.log(`Has NFT: ${hasNft}`);

  let count = 0;

  console.log(`Character minted ${++count}`);

  let provider = hre.ethers.provider;

  let walletWithProvider1 = new ethers.Wallet(PRIVATE_KEY_DUMMY1, provider);
  let walletWithProvider2 = new ethers.Wallet(PRIVATE_KEY_DUMMY2, provider);
  let walletWithProvider3 = new ethers.Wallet(PRIVATE_KEY_DUMMY3, provider);

  let contractWithSigner1 = await gameContract.connect(walletWithProvider1);
  let contractWithSigner2 = await gameContract.connect(walletWithProvider2);
  let contractWithSigner3 = await gameContract.connect(walletWithProvider3);

  txn = await contractWithSigner1.mintCharacterNFT(2);
  await txn.wait();
  console.log(`Character minted ${++count}`);

  hasNft = await contractWithSigner1.checkIfUserHasNFT();
  console.log(`Has NFT: ${hasNft}`);

  txn = await contractWithSigner2.mintCharacterNFT(1);
  await txn.wait();
  console.log(`Character minted ${++count}`);

  txn = await contractWithSigner3.mintCharacterNFT(0);
  await txn.wait();
  console.log(`Character minted ${++count}`);

  /*
    txn = await gameContract.connect(addr2).mintCharacterNFT(0);
    await txn.wait();
    console.log(`Character minted ${++count}`);

    txn = await gameContract.connect(addr3).mintCharacterNFT(0);
    await txn.wait();
    console.log(`Character minted ${++count}`);
    */
  /*
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Character minted");

  txn = await gameContract.attackBoss();
  await txn.wait();
  console.log("Boss attacked #1")

  txn = await gameContract.attackBoss();
  await txn.wait();
  console.log("Boss attacked #2");
    */

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
