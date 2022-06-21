// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
	const tokenId = req.query.tokenId;
	const name = `Crypto Dev #${tokenId}`;
	const description = "Crypto Devs are NFTs for Web3 Devs";
	res.status(200).json({ name: tokenId });
}
