const hre = require("hardhat")

async function main() {
  // Deploy EthSwap contract + Deploy DApp_Token contract w/ Tokens initSupply assigned to EthSwap
  const EthSwap = await hre.ethers.getContractFactory("EthSwap")
  const ethSwap = await EthSwap.deploy(
    100, // tokenRate
    ethers.utils.parseEther("1000"), // initSupply
    "DApp_Token", // name
    "DTK" // symbol
  )
  await ethSwap.deployed()
  console.log("EthSwap deployed to:", ethSwap.address)

  // Get DApp_Token contract Address
  let tokenAddress = await ethSwap.token()
  console.log(tokenAddress)
  // Get DApp_Token contract Instance
  const DApp_Token = await hre.ethers.getContractFactory("DApp_Token")
  let token = DApp_Token.attach(tokenAddress)
  console.log("DApp_Token deployed to:", token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
