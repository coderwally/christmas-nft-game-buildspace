require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_GOERLI_API_KEY_URL = process.env.ALCHEMY_GOERLI_API_KEY_URL;
const ALCHEMY_MUMBAI_API_KEY_URL = process.env.ALCHEMY_MUMBAI_API_KEY_URL;
const QUICKNODE_AVAX_FUJI_URL = process.env.QUICKNODE_AVAX_FUJI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

const PRIVATE_KEY_DUMMY1 = process.env.PRIVATE_KEY_DUMMY1;
const PRIVATE_KEY_DUMMY2 = process.env.PRIVATE_KEY_DUMMY2;
const PRIVATE_KEY_DUMMY3 = process.env.PRIVATE_KEY_DUMMY3;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: ALCHEMY_GOERLI_API_KEY_URL,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: ALCHEMY_MUMBAI_API_KEY_URL,
      accounts: [PRIVATE_KEY],
    },
    fuji: {
      url: QUICKNODE_AVAX_FUJI_URL,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      chainId: 886688,
      accounts: [
        {
          privateKey: PRIVATE_KEY,
          balance: "13500000000000000000"
        },
        {
          privateKey: PRIVATE_KEY_DUMMY1,
          balance: "321000000000000000000"
        },
        {
          privateKey: PRIVATE_KEY_DUMMY2,
          balance: "654000000000000000000"
        },
        {
          privateKey: PRIVATE_KEY_DUMMY3,
          balance: "987000000000000000000"
        }
      ]
    }
  
  },  

  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },    
};
