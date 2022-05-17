import { ethers } from "ethers"
import ethSwapArtifact from "../artifacts/contracts/EthSwap.sol/EthSwap.json"
import tokenArtifact from "../artifacts/contracts/DApp_Token.sol/DApp_Token.json"
// Contract EthSwap
const ethSwapAddress = "0xBF1e5a05F43C58719cbEAeEA16D0Af1dd56FBE3e"
const ethSwapABI = ethSwapArtifact.abi
// Contract DApp_Token
const tokenAddress = "0xDaf12062dB44BDeEBa986c82f3122f98339779b7"
const tokenABI = tokenArtifact.abi

// Get Contracts : EthSwap
export const getEthSwapContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(ethSwapAddress, ethSwapABI, provider)
  return contract
}
export const getEthSwapContractWithS = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithS = new ethers.Contract(ethSwapAddress, ethSwapABI, signer)
  return contractWithS
}

// Get Contracts : DApp_Token
export const getTokenContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(tokenAddress, tokenABI, provider)
  return contract
}
export const getTokenContractWithS = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contractWithS = new ethers.Contract(tokenAddress, tokenABI, signer)
  return contractWithS
}
