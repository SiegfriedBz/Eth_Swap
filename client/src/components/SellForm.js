import { spinner } from "../helpers/loadingSpinner"
import ethLogo from "./assets/eth-logo.png"
import tokenLogo from "./assets/token-logo.png"

const SellForm = ({
  handleSellToken,
  input,
  setInput,
  output,
  setOutput,
  ethBalance,
  tokenBalance,
  tokenRate,
}) => {
  return (
    <form onSubmit={handleSellToken}>
      <div className='d-flex flex-column align-items-center my-3'>
        <div>
          <div className='container'>
            <div className='d-flex justify-content-between mt-2 mb-1'>
              <div className='fw-bold'>Input</div>
              <div className=''>
                Balance:
                {!tokenBalance
                  ? spinner("blue")
                  : ` ${tokenBalance.slice(0, 10)} Tokens`}
              </div>
            </div>
            <div className='d-flex'>
              <div className='d-flex'>
                <input
                  id='input'
                  className='form-control'
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setOutput(+e.target.value / tokenRate)
                  }}
                />
              </div>
              <div className='d-flex ms-2'>
                <img src={tokenLogo} heigth='32' alt='' />
              </div>
            </div>
          </div>

          <div className='container'>
            <div className='d-flex justify-content-between mt-2 mb-1'>
              <div className='fw-bold'>Output</div>
              <div className=''>
                Balance:
                {!ethBalance
                  ? spinner("blue")
                  : ` ${ethBalance.slice(0, 5)} ETH`}
              </div>
            </div>
            <div className='d-flex flex-row'>
              <div className='d-flex'>
                <input
                  id='output'
                  readOnly
                  className='form-control'
                  value={output}
                />
              </div>
              <div className='d-flex ms-2'>
                <img src={ethLogo} heigth='32' alt='' />
              </div>
            </div>
          </div>

          <div className='container'>
            <div className='d-flex justify-content-between mt-2 mb-1'>
              <div className='fw-bold'>Exchange Rate :</div>
              <div className=''>
                1ETH : {!tokenRate ? spinner("blue") : tokenRate} Tokens
              </div>
            </div>
          </div>

          <div className='container'>
            <button className='btn btn-lg btn-primary w-100' type='submit'>
              Swap
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default SellForm
