import "../styles/globals.css";
import * as React from "react";

import type { AppProps } from "next/app";
import { providers } from "ethers";
import NextHead from "next/head";
import "@rainbow-me/rainbowkit/styles.css";
import {
	apiProvider,
	configureChains,
	getDefaultWallets,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
	Chain,
	chain,
	createClient,
	etherscanBlockExplorers,
	WagmiProvider,
} from "wagmi";
import { ChakraProvider } from '@chakra-ui/react'

const cantoChain: Chain = {
	id: 7700,
	name: "Canto",
	nativeCurrency: { name: "Canto", symbol: "$CANTO", decimals: 18 },
	rpcUrls: {
		default: "https://canto.slingshot.finance/",
	},
	testnet: false,
};

const { provider, chains } = configureChains(
	[cantoChain],
	[apiProvider.jsonRpc((chain) => ({ rpcUrl: chain.rpcUrls.default }))]
);

const { connectors } = getDefaultWallets({
	appName: "Happy Rabbit",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<ChakraProvider>
		<WagmiProvider client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				<NextHead>
					<title>HappyRabbit</title>
				</NextHead>

				<Component {...pageProps} />
			</RainbowKitProvider>
		</WagmiProvider>
		</ChakraProvider>

	);
};

export default App;
