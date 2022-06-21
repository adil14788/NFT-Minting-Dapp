const checkIfPresaleEnded = async () => {
	try {
		const provider = await getSignerOrProvider();

		const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

		// this will return a big number
		const _preSaleEnded = await NFTContract.preSaleEnded();

		//Date.now() returns time in milliseconds therefore divide it by 1000
		const timeInSeconds = Date.now() / 1000;

		const hasPresaleEnded = _preSaleEnded.lt(Math.floor(timeInSeconds));

		setPreSaleEnded(hasPresaleEnded);
	} catch (err) {
		console.error(err);
	}
};

// Some sort of function to connect wallet
