// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UncheckedMisuse {
    mapping (address=>uint256) public balance;

    function deposit(uint256 _num) public returns (uint256) {
        require(_num <= 2 ** 256 -1, "Your deposit too much number at once!!");
        balance[msg.sender] += _num;
        return balance[msg.sender];
    }

    function withdraw(uint256 _num) public returns (uint256) {
        unchecked {
            balance[msg.sender] -= _num;
        }
        return balance[msg.sender];
    }
}