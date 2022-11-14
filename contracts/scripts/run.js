const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory(
    "ChristmasGame"
  );
  const gameContract = await gameContractFactory.deploy(
    ["Snowman", "Rudolph", "Santa"], // Names
    [
      "https://bafybeiauc7xjqcjxx5zzmlom6jhkn5anod3jd42liabcyfzuje3glv6c5a.ipfs.nftstorage.link/snowman.png", // Images
      "https://bafybeiauc7xjqcjxx5zzmlom6jhkn5anod3jd42liabcyfzuje3glv6c5a.ipfs.nftstorage.link/rudolph.png",
      "https://bafybeiauc7xjqcjxx5zzmlom6jhkn5anod3jd42liabcyfzuje3glv6c5a.ipfs.nftstorage.link/santa.png",
    ],
    [1000, 2500, 5000], // Joy points values
    [500, 250, 100], // Attack damage values
    "The Grinch",
    "https://bafybeiauc7xjqcjxx5zzmlom6jhkn5anod3jd42liabcyfzuje3glv6c5a.ipfs.nftstorage.link/grinch.png",
    100000, // Boss joy points
    250 // Boss attack damate
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;

  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);

  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();
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
