// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UncheckedMisuse {
    mapping (address=>uint256) public balance;

    function deposit(uint256 _num) public returns (uint256) {
        balance[msg.sender] += _num;
        return balance[msg.sender];
    }

    function withdraw(uint256 _num) public returns (uint256) {
        // require(_num <= balance[msg.sender], "withdraw number must less than your balance");
        unchecked {
            balance[msg.sender] -= _num;
        }
        return balance[msg.sender];
    }
}