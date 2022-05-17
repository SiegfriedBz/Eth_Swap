require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: "./client/src/artifacts",
  },
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: process.env.REACT_APP_API_URL,
      accounts: [`0x${process.env.REACT_APP_PRIVATE_KEY}`],
    },
  },
}
