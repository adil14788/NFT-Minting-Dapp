// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
	const tokenId = req.query.tokenId;
	const name = `Crypto Dev #${tokenId}`;
	const description = "Crypto Devs are NFTs for Web3 Devs";
	const image = `https://raw.githubusercontent.com/adil14788/NFT-Collection/main/nft-frontend/public/cryptodevs/${
		Number(tokenId) - 1
	}.svg`;

	return res.status(200).json({
		name: name,
		description: description,
		image: image,
	});
}
