import { spinner } from "../helpers/loadingSpinner"

const Banner = ({ account, ethBalance, tokenBalance }) => {
  return (
    <div
      id='banner'
      className='d-flex flex-row align-items-center justify-content-between p-3'
      style={{ opacity: "0.85" }}
    >
      <div className='d-flex flex-column'>
        <h1>EthSwap</h1>
        <p>Instant Exchange</p>
      </div>
      <div className='d-flex flex-column btn btn-primary'>
        <div>
          {account && ` ${account.slice(0, 8)}...${account.slice(34, 42)}`}
        </div>
        <div>
          {!ethBalance ? spinner("white") : `${ethBalance.slice(0, 5)} ETH`}
        </div>
        <div>
          {!tokenBalance
            ? spinner("white")
            : `${tokenBalance.slice(0, 10)} Tokens`}
        </div>
      </div>
    </div>
  )
}

export default Banner
