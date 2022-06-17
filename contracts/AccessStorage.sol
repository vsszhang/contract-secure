// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessStorage {
    
    uint256 private _num1;
    uint256 private _num2;

    function setNum(uint256 _a, uint256 _b) public {
        _num1 = _a;
        _num2 = _b;
    }

    function getNum() public view returns (uint256, uint256) {
        return (_num1, _num2);
    }

}