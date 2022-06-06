const { ethers } = require("hardhat");

async function main() {
    const [ owner, user ] = await ethers.getSigners();
    const Selfdestruct = await ethers.getContractFactory('Selfdestruct', owner);
    const selfdestruct = await Selfdestruct.deploy();
    await selfdestruct.deployed();
    console.log(`selfdestruct addr: ${selfdestruct.address}`);

    // console.log(`owner send 1 Ether to Selfdestruct contract...`);
    console.log(`owenr balance: ${ethers.utils.formatEther(await owner.getBalance())} ether`);
    let tx = owner.sendTransaction({
        to: selfdestruct.address,
        gasPrice: 766828498,
        value: ethers.utils.parseEther('1.0')
    });
    (await tx).wait;
    console.log(`owenr balance: ${ethers.utils.formatEther(await owner.getBalance())} ether`);
    // console.log(`user balance: ${await user.getBalance()} ether`);
    // console.log(`user call killmyself()...`);
    // await selfdestruct.connect(user).killmyself(user.address);
    // console.log(`user balance: ${await user.getBalance()} ether`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });