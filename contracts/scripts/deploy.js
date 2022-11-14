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
    [1000, 2500, 5000], // HP values
    [500, 250, 100], // Attack damage values
    "The Grinch",
    "https://bafybeiauc7xjqcjxx5zzmlom6jhkn5anod3jd42liabcyfzuje3glv6c5a.ipfs.nftstorage.link/grinch.png",
    100000, // Boss joy points
    250 // Boss attack damate
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

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
