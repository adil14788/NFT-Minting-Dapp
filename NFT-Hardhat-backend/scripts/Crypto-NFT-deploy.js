const { ethers } = require("hardhat");

const { WHITE_LIST_CONTRACT_ADDRESS, baseURI } = require("../constants/index");

async function main() {
	// const [owner, account] = await ethers.getSigners();
	const CryptoNftFactory = await ethers.getContractFactory("CryptoNFT");
	const CryptoNftContract = await CryptoNftFactory.deploy(
		baseURI,
		WHITE_LIST_CONTRACT_ADDRESS
	);
	await CryptoNftContract.deployed();
	console.log("CryptoNft Contract deployed to:", CryptoNftContract.address);

	// console.log(baseURI);
	// console.log(WHITE_LIST_CONTRACT_ADDRESS);
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
