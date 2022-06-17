//
// @dev Simulate access private storage attack
// @description Even the variable is declared as private type, attacker can read
// it through {provider.getStorageAt(addr, pos)}.
// @notice Suggest u use this script and 'hardhat console' to simulate the etire
// attack. Also, the development environment based on Moonbeam Dev Node
//
// Hardhat console command line:
// > let ADDR = CONTRACT_ADDR
// > const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:9933')
// > const Contract = await ethers.getContractFactory('AccessStorage')
// > const contract = await Contract.attach(ADDR)
// > await provider.getStorageAt(ADDR,0)
// > await provider.getStorageAt(ADDR,1)
// (Use script before console. Also, setting 11&22 before setting 1&2)
//

const { ethers } = require('hardhat');

async function main() {
    const owner = await ethers.getSigners();

    const AccessStorage = await ethers.getContractFactory('AccessStorage', owner);
    const access = await AccessStorage.deploy();
    await access.deployed();
    console.log(`contract AccessStorage address: ${access.address}`);

    // owner set number
    console.log(`Owner set _num1 is 11, _num2 is 22...`);
    await access.setNum(11, 22);

    // const AccessStorage = await ethers.getContractFactory('AccessStorage', owner);
    // const access = AccessStorage.attach('0xb6F2B9415fc599130084b7F20B84738aCBB15930');
    // console.log(`Owner set _num1 is 1, _num2 is 2...`);
    // await access.setNum(1, 2);
    // let [a, b] = await access.getNum();
    // console.log(`a: ${a}, b: ${b}`);

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });