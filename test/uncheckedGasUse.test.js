const { ethers } = require("hardhat");
const { expect } = require("chai");

describe('UncheckedMisuse contract(report unchecked syntax gas used)', () => {

    it('Gauge withdraw func', async () => {
        const owner = await ethers.getSigner(0);
        const Bank = await ethers.getContractFactory('UncheckedMisuse', owner);
        const bank = await Bank.deploy();
        await bank.deployed();

        await bank.deposit(1000);
        expect(1000).to.equal(await bank.balance(owner.address));

        await bank.withdraw(700);
        expect(300).to.equal(await bank.balance(owner.address));
        
    });
});