import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { connect } from "./helpers/connect"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom"
import {
  getEthSwapContract,
  getEthSwapContractWithS,
  getTokenContract,
  getTokenContractWithS,
} from "./helpers/contractConfig"
import Banner from "./components/Banner"
import Switch from "./components/Switch"
import BuyForm from "./components/BuyForm"
import SellForm from "./components/SellForm"

function App() {
  const [account, setAccount] = useState(undefined)
  const [tokenRate, setTokenRate] = useState("")
  const [ethBalance, setEthBalance] = useState("")
  const [tokenBalance, setTokenBalance] = useState("")
  const [input, setInput] = useState(0)
  const [output, setOutput] = useState(0)

  useEffect(() => {
    ;(async () => {
      const account = await connect()
      setAccount(account)

      const ethSwapContract = getEthSwapContract()
      const rate = await ethSwapContract.tokenRate()
      setTokenRate(rate.toNumber())

      await getEthBalance(account)
      await getTokenBalance(account)
    })()
  }, [account])

  const getEthBalance = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const bal = await provider.getBalance(account)
    setEthBalance(ethers.utils.formatEther(bal))
  }

  const getTokenBalance = async (account) => {
    const tokenContract = getTokenContract()
    const bal = await tokenContract.balanceOf(account)
    setTokenBalance(ethers.utils.formatEther(bal))
  }

  const handleBuyToken = async (e) => {
    e.preventDefault()
    const EthSwapContractWithS = getEthSwapContractWithS()
    let trx = await EthSwapContractWithS.buyToken({
      value: ethers.utils.parseEther(input),
      gasLimit: 300000,
    })
    await trx.wait()
    await getEthBalance(account)
    await getTokenBalance(account)
    setInput(0)
    setOutput(0)
  }

  const handleSellToken = async (e) => {
    e.preventDefault()
    const EthSwapContractWithS = getEthSwapContractWithS()
    const EthSwapContractAddress = EthSwapContractWithS.address
    // Approve EthSwapContract
    const tokenContractWithS = getTokenContractWithS()
    let trx = await tokenContractWithS.approve(
      EthSwapContractAddress,
      ethers.utils.parseEther(input)
    )
    await trx.wait()
    // Sell
    trx = await EthSwapContractWithS.sellToken(ethers.utils.parseEther(input), {
      gasLimit: 300000,
    })
    await trx.wait()
    await getEthBalance(account)
    await getTokenBalance(account)
    setInput(0)
    setOutput(0)
  }

  return (
    <div>
      <Banner
        account={account}
        ethBalance={ethBalance}
        tokenBalance={tokenBalance}
      />
      <Router>
        <Routes>
          <Route path='/' element={<Switch />}>
            <Route
              path='buy'
              element={
                <BuyForm
                  handleBuyToken={handleBuyToken}
                  input={input}
                  setInput={setInput}
                  output={output}
                  setOutput={setOutput}
                  ethBalance={ethBalance}
                  tokenBalance={tokenBalance}
                  tokenRate={tokenRate}
                />
              }
            />
            <Route
              path='sell'
              element={
                <SellForm
                  handleSellToken={handleSellToken}
                  input={input}
                  setInput={setInput}
                  output={output}
                  setOutput={setOutput}
                  ethBalance={ethBalance}
                  tokenBalance={tokenBalance}
                  tokenRate={tokenRate}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
