// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Selfdestruct {
    address owner;

    constructor() payable {
        owner = msg.sender;
    }

    function ownedETH() public view returns (uint256) {
        return address(this).balance;
    }

    function killmyself(address payable _target) public {
        selfdestruct(_target);
    }

    receive() external payable {}
    fallback() external payable {}
}