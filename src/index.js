// Import Solana web3 functinalities
const {
	Connection,
	PublicKey,
	clusterApiUrl,
	Keypair,
	LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

let userPubKey = "";

const getPublicKey = async () => {
	try {
		const ps = require("prompt-sync");
		const prompt = ps();
		const alreadyHavePublicKey = prompt(
			"Do you already have a public key?(y/n)"
		);
		if (alreadyHavePublicKey === "n" || alreadyHavePublicKey === "N") {
			// Create a new keypair
			const newPair = new Keypair();

			// Exact the public and private key from the keypair
			const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
			const privateKey = newPair._keypair.secretKey;
			// Make a wallet (keypair) from privateKey and get its balance
			const myWallet = await Keypair.fromSecretKey(privateKey);

			userPubKey = newPair.publicKey;
		} else {
			userPubKey = prompt("Enter your public key: ");
			console.log("Public Key of the generated keypair", userPubKey);
		}
	} catch (e) {
		console.log(e);
	}
};

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
	try {
		// Connect to the Devnet
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
		console.log("Connection object is:", connection);

		const walletBalance = await connection.getBalance(
			new PublicKey(userPubKey)
		);
		console.log(
			`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
		);
	} catch (err) {
		console.log(err);
	}
};

const airDropSol = async () => {
	try {
		// Connect to the Devnet and make a wallet from privateKey
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

		// Request airdrop of 2 SOL to the wallet
		console.log("Airdropping some SOL to my wallet!");
		const fromAirDropSignature = await connection.requestAirdrop(
			new PublicKey(userPubKey),
			2 * LAMPORTS_PER_SOL
		);
		await connection.confirmTransaction(fromAirDropSignature);
	} catch (err) {
		console.log(err);
	}
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
	await getPublicKey();
	await getWalletBalance();
	await airDropSol();
	await getWalletBalance();
};

mainFunction();
