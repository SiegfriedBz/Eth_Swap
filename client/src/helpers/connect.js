export async function connect() {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    const account = handleAccountsChanged(accounts) // handleAccountsChanged returns an array of accounts, if there is more than 0, then it will give the 1st account in this array.
    return account
  } catch (error) {
    if (error.code === 4001) {
      // metamask code
      alert("Please Connect to MetaMask")
    } else {
      console.error(error)
    }
  }
}

export function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    alert("Please Connect to MetaMask")
  } else {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload()
    }) // adds a listener that will reload the page if account connected to MetaMask changes.
  }
  return accounts[0]
}
