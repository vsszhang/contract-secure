require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

const { 
  privateKeyAlith,
  privateKeyBaltathar,
  privateKeyCharleth
} = require('./secrets.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("parseEther", "parse number string to a BigNumber")
  .addParam("num", "string of number")
  .setAction(async (taskArgs, hre) => {
    console.log(hre.ethers.utils.parseEther(taskArgs.num));
  });

task("formatEther", "format a BigNumber to a ether number")
  .addParam("num", "BigNumber")
  .setAction(async (taskArgs, hre) => {
    console.log(hre.ethers.utils.formatEther(taskArgs.num));
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",

  networks: {
    moondev: {
      url: "http://127.0.0.1:9933",
      accounts: [
        privateKeyAlith,
        privateKeyBaltathar,
        privateKeyCharleth
      ] 
    }
  },

  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false
  }

};
