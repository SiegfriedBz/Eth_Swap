//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./DApp_Token.sol";

contract EthSwap {

    event BuyEvent(address _buyer, uint256 _amount,uint256 _tokenRate);
    event SellEvent(address _seller, uint256 _amount,uint256 _tokenRate);

    string public name = "EthSwap Instant Exchange";
    DApp_Token public token;
    uint256 public tokenRate; // 1ETH => x DApp_Tokens

    constructor(uint256 _tokenRate, uint256 _initSupply,string memory _tokenName,string memory _tokenSymbol) {
        tokenRate = _tokenRate;
        token = new DApp_Token(_initSupply, _tokenName, _tokenSymbol);
    }

    function buyToken() public payable {
        uint256 _amount = msg.value * tokenRate;
        require(token.balanceOf(address(this)) >= _amount, "Not enough Tokens in this Exchange");
        token.transfer(msg.sender, _amount);
        emit BuyEvent(msg.sender, _amount, tokenRate);
    }

    function sellToken(uint256 _amount) public payable {
        uint256 ethAmount = _amount/ tokenRate;
        require(token.balanceOf(msg.sender) >= _amount, "Not enough Tokens in your account");
        require(address(this).balance >= ethAmount, "Not enough ETH in this Exchange to Swap your tokens");
        payable(msg.sender).transfer(ethAmount);
        token.transferFrom(msg.sender, address(this), _amount);
        emit SellEvent(msg.sender, _amount, tokenRate);
    }
}

