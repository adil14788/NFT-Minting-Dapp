import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { abi, NFT_CONTRACT_ADDRESS } from "../constant";
import { useRouter } from "next/router";

export default function Home() {
	const [wallerConnected, setWalletConnected] = useState(false);

	const [tokensLeft, settokensLeft] = useState("");

	const [preSaleStarted, setPreSaleStarted] = useState(false);

	const [preSaleEnded, setPreSaleEnded] = useState(false);

	const [isOwner, setIsOwner] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [mintingNft, setMintingNft] = useState(false);

	const web3ModalRef = useRef();
	const router = useRouter();

	const getMintedTokensNumber = async () => {
		try {
			const provider = await getSignerOrProvider();
			const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

			const tokens = await NFTContract.totalTokenIds();
			console.log(tokens.toString());
			settokensLeft(tokens.toString());
		} catch (err) {
			console.error(err);
		}
	};

	const _preSaleMint = async () => {
		try {
			const signer = await getSignerOrProvider(true);
			const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

			const txn = await NFTContract.preSaleMint({
				value: ethers.utils.parseEther("0.005"),
			});
			await txn.wait();

			alert("Congratulations you successfully minted a crypto Dev!!!");
		} catch (err) {
			console.error(err);
		}
	};

	const publicMint = async () => {
		try {
			const signer = await getSignerOrProvider(true);
			const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

			setMintingNft(true);

			const txn = await NFTContract.mint({
				value: ethers.utils.parseEther("0.01"),
			});
			await txn.wait();

			alert("Congratulations you successfully minted a crypto Dev!!!");

			setMintingNft(false);
		} catch (err) {
			console.error(err);
			alert("Transaction rejected");
			setMintingNft(false);
		}
	};

	const checkIfPresaleEnded = async () => {
		try {
			const provider = await getSignerOrProvider();

			const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

			// this will return a big number
			const PreSaleEndTime = await NFTContract.preSaleEnded();

			//Date.now() returns time in milliseconds therefore divide it by 1000
			const timeInSeconds = Date.now() / 1000;

			const checkIfPreSaleEnded = PreSaleEndTime.lt(Math.floor(timeInSeconds));

			setPreSaleEnded(checkIfPreSaleEnded);
		} catch (err) {
			console.error(err);
		}
	};

	const startPreSale = async () => {
		try {
			const signer = await getSignerOrProvider(true);
			const NFTContract = new ethers.Contract(
				NFT_CONTRACT_ADDRESS,
				abi,
				signer
			);

			setIsLoading(true);
			const txn = await NFTContract.startPresale();
			await txn.wait();
			setIsLoading(false);
			console.log("Presale started");

			setPreSaleStarted(true);
		} catch (err) {
			console.error(err);
		}
	};

	// Checks if presale has started or not
	const checkIfPreSaleStarted = async () => {
		try {
			const provider = await getSignerOrProvider();

			const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

			const _preSaleStarted = await NFTContract.preSaleStarted();

			// console.log("Return of Presale Started inside function", _preSaleStarted);

			setPreSaleStarted(_preSaleStarted);
			return _preSaleStarted;
		} catch (err) {
			console.error(err);
			return false;
		}
	};

	// Gets the Owner of the Contract
	const getOwner = async () => {
		try {
			const provider = await getSignerOrProvider();

			const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

			const _owner = await NFTContract.owner();

			const signer = await getSignerOrProvider(true);
			// Get the address associated to the signer which is connected to  MetaMask
			const address = await signer.getAddress();
			// setConnectedAccount(address.toString());

			// console.log("Signer", address);
			// console.log("Owner", _owner);

			if (_owner === address) {
				setIsOwner(true);
			}
			// console.log(`Owner`, isOwner);
		} catch (err) {
			console.error(err);
		}
	};
	// Gets Provider and Signer
	const getSignerOrProvider = async (signer = false) => {
		try {
			const provider = await web3ModalRef.current.connect();
			const web3Provider = new ethers.providers.Web3Provider(provider);

			const { chainId } = await web3Provider.getNetwork();

			if (chainId != 5) {
				alert("Change the network to goerli");
				throw new Error("Change the network to goerli");
			}

			if (signer) {
				const signer = web3Provider.getSigner();
				return signer;
			}

			return web3Provider;
		} catch (err) {
			console.error(err);
		}

		// We need to get provider or signer from metamsk
	};

	//Connect the Wallet
	const connectWallet = async () => {
		try {
			await getSignerOrProvider(false);

			//When Account is Changed it reloads the page
			const provider = await web3ModalRef.current.connect();
			provider.on("accountsChanged", () => {
				router.reload(window.location.pathname);
			});

			// update the state of the wallet connected
			setWalletConnected(true);
			console.log("Wallet Connected ", wallerConnected);
		} catch (err) {
			console.error(err);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onPageLoad = async () => {
		await connectWallet();
		await getOwner();
		const _preSaleStarted = await checkIfPreSaleStarted();
		if (_preSaleStarted) {
			await checkIfPresaleEnded();
		}

		await getMintedTokensNumber();

		setInterval(async () => {
			await getMintedTokensNumber();
		}, 5 * 1000);

		setInterval(async () => {
			const _preSaleStarted = await checkIfPreSaleStarted();
			if (_preSaleStarted) {
				await checkIfPresaleEnded();
			}
		}, 5 * 1000);
	};

	useEffect(() => {
		if (!wallerConnected) {
			web3ModalRef.current = new Web3Modal({
				network: "goerli",
				disableInjectedProvider: false,
				providerOptions: {},
			});
			onPageLoad();
		}
	}, [onPageLoad, wallerConnected]);

	const renderBody = () => {
		if (!wallerConnected) {
			return (
				<button className={styles.button} onClick={connectWallet}>
					Connect Wallet
				</button>
			);
		}

		if (isOwner && !preSaleStarted) {
			//render button to start preSale
			return (
				<button className={styles.button} onClick={startPreSale}>
					Start PreSale
				</button>
			);
		}

		if (isLoading) {
			return <h1>Loading...</h1>;
		}

		if (!preSaleStarted) {
			return (
				<div className={styles.description}>
					<span> The Presale has not started yet. Come Back Later </span>
				</div>
			);
		}

		if (preSaleStarted && !preSaleEnded) {
			// allow whitelisted user to mint an nft
			return (
				<div className={styles.description}>
					<div>PreSale Started. WhiteLIsted Accounts Can Mint Now</div>
					<br />
					<br />
					<button className={styles.button} onClick={_preSaleMint}>
						PreSale Mint
					</button>
				</div>
			);
		}

		if (preSaleEnded) {
			// allow normal users to mint the NFt
			return (
				<div className={styles.description}>
					<div>The PreSale has ended. Public Mint Alive</div>
					<br />

					{mintingNft ? (
						<h2 className={styles.title}> Minting Your NFT Please Wait ... </h2>
					) : (
						<button className={styles.button} onClick={publicMint}>
							Public Mint
						</button>
					)}
				</div>
			);
		}
	};
	return (
		<div>
			<Head>
				<title>CryptoDev NFT</title>
			</Head>
			<div className={styles.main}>
				<div>
					<div>
						<h1 className={styles.title}>Welcome To CryptoDevs NFT</h1>
						<span className={styles.description}>
							Crypto Devs NFTs are for Web 3 Develepors <br />
							<br />
							{tokensLeft} / 20 Minted.
						</span>
						<br />
						<br />
						<br />
					</div>
					{renderBody()}
				</div>
				<div>
					<img src="/cryptodevs/19.svg" alt="" />
				</div>
			</div>
			<footer className={styles.footer}>
				<div>
					Made with &#10084; by{" "}
					<a href="https://twitter.com/AdilIrshad73">
						{" "}
						<b> Adil Irshad </b>
					</a>
				</div>
			</footer>
		</div>
	);
}
