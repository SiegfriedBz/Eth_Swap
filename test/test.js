const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("EthSwap + DApp_Token Contracts", function () {
  let ethSwap, token
  let signer1
  let prov = ethers.provider // Local HardHat Provider
  let trx

  beforeEach(async () => {
    // Get Signers
    ;[_, signer1] = await ethers.getSigners()

    // Deploy EthSwap contract + Deploy DApp_Token contract w/ 1000 Tokens initSupply assigned to EthSwap
    const EthSwap = await hre.ethers.getContractFactory("EthSwap")
    ethSwap = await EthSwap.deploy(
      100,
      ethers.utils.parseEther("1000"),
      "DApp_Token",
      "DTK"
    )
    await ethSwap.deployed()
    console.log("EthSwap deployed to:", ethSwap.address)

    // Get DApp_Token contract Address
    let tokenAddress = await ethSwap.token()
    // Get DApp_Token contract Instance
    const DApp_Token = await hre.ethers.getContractFactory("DApp_Token")
    token = DApp_Token.attach(tokenAddress)
    console.log("DApp_Token deployed to:", token.address)
  })

  describe("EthSwap Contract", () => {
    it("Should return the name of the EthSwap contract", async function () {
      let name = await ethSwap.name()
      expect(name).to.equal("EthSwap Instant Exchange")
    })
    it("Should return the tokenRate of the deployed token contract", async function () {
      let tokenRate = await ethSwap.tokenRate()
      expect(tokenRate).to.equal(100)
    })
  })

  describe("DApp_Token Contract", () => {
    it("Should return the name of the token contract", async function () {
      let name = await token.name()
      expect(name).to.equal("DApp_Token")
    })

    it("Should return the 'DApp_Token' token supply ", async function () {
      let totalSupply = await token.totalSupply()
      console.log(
        "DApp_Token TotalSupply :" + ethers.utils.formatEther(totalSupply)
      )
    })
  })

  describe("EthSwap Contract + DApp_Token Contract", () => {
    it("Should show ethSwap balance === 'DApp_Token' totalSupply", async function () {
      let totalSupply = await token.totalSupply()
      console.log(
        "DApp_Token TotalSupply :" + ethers.utils.formatEther(totalSupply)
      )

      // Check ethSwap balance === 'DApp_Token' totalSupply
      expect(await token.balanceOf(ethSwap.address)).to.equal(totalSupply)
    })

    it("Should allow to buy 'DApp_Token'", async function () {
      // Check ethSwap 'DTK' Balance Before Buy
      let ethSwapBalBefore = await token.balanceOf(ethSwap.address)
      console.log(
        "ethSwap 'DTK' Bal Before Buy :" +
          ethers.utils.formatEther(ethSwapBalBefore)
      )

      // Get 'DTK' rate
      let rate = await ethSwap.tokenRate()
      console.log("DTK Rate : " + rate)

      // Check signer1 'DTK' Balance Before Buy
      let balBeforeBuy = await token.balanceOf(signer1.address)
      console.log(
        "Signer1 'DTK' Bal Before Buy : " +
          ethers.utils.formatEther(balBeforeBuy)
      )
      // Check signer1 ETH Balance Before Buy
      let ethBalBefore = await prov.getBalance(signer1.address)
      console.log(
        "Signer1 ETH Bal Before Buy : " + ethers.utils.formatEther(ethBalBefore)
      )

      // signer1 buys 'DTK' by sending "1" ether
      trx = await ethSwap
        .connect(signer1)
        .buyToken({ value: ethers.utils.parseEther("1") })
      await trx.wait()

      // Check signer1 'DTK' Balance After Buy
      let balAfterBuy = await token.balanceOf(signer1.address)
      console.log(
        "Signer1 'DTK' Bal After Buy : " + ethers.utils.formatEther(balAfterBuy)
      )

      // Get total supply
      let totalSupply = await token.totalSupply()
      console.log("'DTK' TotalSupply :" + ethers.utils.formatEther(totalSupply))

      // Check ethSwap balance After Buy
      let ethSwapBalAfterBuy = await token.balanceOf(ethSwap.address)
      console.log(
        "ethSwap 'DTK' Bal After Buy :" +
          ethers.utils.formatEther(ethSwapBalAfterBuy)
      )
    })
    it("Should allow to Sell 'DApp_Token'", async function () {
      //** BUY
      // signer1 buys 'DTK' by sending "1" ether
      trx = await ethSwap
        .connect(signer1)
        .buyToken({ value: ethers.utils.parseEther("1") })
      await trx.wait()

      // Check signer1 'DTK' Balance After Buy
      let balAfterBuy = await token.balanceOf(signer1.address)
      console.log(
        "Signer1 'DTK' Bal After Buy : " + ethers.utils.formatEther(balAfterBuy)
      )
      //** SELL
      // Check signer1 ETH Balance Before Sell
      let ethBalBeforeSell = await prov.getBalance(signer1.address)
      console.log(
        "signer1 ETH Bal Before Sell : " +
          ethers.utils.formatEther(ethBalBeforeSell) +
          " ether"
      )

      // signer1 Sells 25 'DTK'
      // Require signer1 to 1st approve the ethSwapContract, directly on ERC20Token Contract.
      trx = await token
        .connect(signer1)
        .approve(ethSwap.address, ethers.utils.parseEther("25"))
      await trx.wait()

      trx = await ethSwap
        .connect(signer1)
        .sellToken(ethers.utils.parseEther("25"))
      await trx.wait()

      // Check signer1 "DTK" Balance After Sell
      let balAfterSell = await token.balanceOf(signer1.address)
      console.log(
        "signer1 'DTK' Bal After Sell : " +
          ethers.utils.formatEther(balAfterSell)
      )
      expect(balAfterBuy.sub(balAfterSell)).to.equal(
        ethers.utils.parseEther("25")
      )

      // Check signer1 ETH Balance After Sell
      let ethBalAfterSell = await prov.getBalance(signer1.address)
      console.log(
        "signer1 ETH Bal After Sell : " +
          ethers.utils.formatEther(ethBalAfterSell) +
          " ether"
      )

      // Check ethSwap balance
      let bal = await token.balanceOf(ethSwap.address)
      console.log("ethSwap 'DTK' Bal :" + ethers.utils.formatEther(bal))
    })

    it("Should NOT allow to Sell 'DApp_Token' that User does NOT HOLD - Unhappy Path", async function () {
      //** BUY
      // signer1 buys 'DTK' by sending "1" ether
      trx = await ethSwap
        .connect(signer1)
        .buyToken({ value: ethers.utils.parseEther("1") })
      await trx.wait()

      // Check signer1 'DTK' Balance After Buy
      let balAfterBuy = await token.balanceOf(signer1.address)

      //// signer1 Tries to SELL 'DTK' => Should Revert
      // signer1 1st approves ethSwapContract
      trx = await token
        .connect(signer1)
        .approve(ethSwap.address, ethers.utils.parseEther("1000"))
      await trx.wait()

      await expect(
        ethSwap.connect(signer1).sellToken(ethers.utils.parseEther("1000"))
      ).to.be.revertedWith("Not enough Tokens in your account")

      // Check signer1 "DTK" Balance After Sell Try
      let balAfterSellTry = await token.balanceOf(signer1.address)
      expect(balAfterSellTry).to.equal(balAfterBuy)
    })
  })
})
