const { ethers } = require("hardhat");

async function main() {
	// const [owner, account] = await ethers.getSigners();
	const CryptoNftFactory = await ethers.getContractFactory("CryptoNFT");
	const CryptoNftContract = await CryptoNftFactory.deploy(
		"CryptoDevNFT.com",
		"0xb322114cbf4d4707c63ac837f1e372ad1422ecb2"
	);
	await CryptoNftContract.deployed();
	console.log("CryptoNft Contract deployed to:", CryptoNftContract.address);

	// let txn;

	// txn = await CryptoNftContract.startPresale();

	// txn = await CryptoNftContract.mint({
	// 	value: ethers.utils.parseEther("0.01"),
	// });
	// await txn.wait();
	// console.log("NFt minted #1");

	// txn = await CryptoNftContract.connect(account).mint({
	// 	value: ethers.utils.parseEther("0.01"),
	// });

	// console.log("NFt minted #2");

	// txn = await CryptoNftContract.connect(account).mint({
	// 	value: ethers.utils.parseEther("0.01"),
	// });

	// console.log("NFt minted #3");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
