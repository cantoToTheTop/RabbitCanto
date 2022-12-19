import styles from "../styles/Home.module.css";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import { useAccount, useContract, useContractRead, useSigner } from "wagmi";

import { XRAB_ABI } from "../abi/xRabAbi.js";
import { BigNumber, ethers } from "ethers";
import { AiOutlineArrowDown } from 'react-icons/ai';
import { Connect } from "../components";
import Link from "next/link";
import { Box, Button, Divider, Flex, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";

const Page = () => {


	const RabAddress = "0x241f6A1Ea972EEDB05F76e25179347719e4e8B72";
	const XrabAddress = "0xd60e28936Ee53F813B8185f83cdc3D87D7eE4559";
	const { data: signer } = useSigner();
	const { data: accountData, isLoading } = useAccount();
	const [rabBalance, setRabBalance] = useState(0);
	const [xRabBalance, setXRabBalance] = useState(0);
	const [approving, setApproving] = useState(false);
	const [depositing, setDepositing] = useState(false);
	const [redeeming, setRedeeming] = useState(false);
	const [rabAllowance, setRabAllowance] = useState(0);
	const [rabAmount, setRabAmount] = useState(0);
	const [xrabAmount, setXrabAmount] = useState(0);
	const [error, setError] = useState("");
	const [depositPrice, setDepositPrice] = useState(0);
	const [redeemPrice, setRedeemPrice] = useState(0);
	const [isDeposit, setIsDeposit] = useState(true);





	const contractXrab = useContract({
		addressOrName: XrabAddress,
		contractInterface: XRAB_ABI,
		signerOrProvider: signer,
	});

	const contractRab = useContract({
		addressOrName: RabAddress,
		contractInterface: XRAB_ABI,
		signerOrProvider: signer,
	});

	const validateRabAmount = () => {
		if (rabAmount < 0.002 || rabAmount > (rabBalance / 10 ** 18)) {
			setError("Amount out of range");
		} else {
			setError("");
		}
	};

	const validateXRabAmount = () => {
		if (xrabAmount < 0.002 || xrabAmount > (xRabBalance / 10 ** 18)) {
			setError("Amount out of range");
		} else {
			setError("");
		}
	};


	// 	const [depositAmount, setDepositAmount] = useState(0);
	// 	const [approving, setApproving] = useState(false);
	//   const [depositing, setDepositing] = useState(false);
	// 	const [error, setError] = useState("");
	//   const [sucessDepositing, setSuccessDepositing] = useState(false)






	const { refetch: getRabBalance } = useContractRead(
		{
			addressOrName: RabAddress,
			contractInterface: XRAB_ABI,
		},
		"balanceOf",
		{
			args: [accountData?.address]
		}
	);

	const { refetch: getXRabBalance } = useContractRead(
		{
			addressOrName: XrabAddress,
			contractInterface: XRAB_ABI,
		},
		"balanceOf",
		{
			args: [accountData?.address]
		}
	);


	const { refetch: getRabAllowance } = useContractRead(
		{
			addressOrName: RabAddress,
			contractInterface: XRAB_ABI,
		},
		"allowance",
		{
			args: [accountData?.address, XrabAddress]
		}
	);

	const { refetch: previewRedeem } = useContractRead(
		{
			addressOrName: XrabAddress,
			contractInterface: XRAB_ABI,
		},
		"previewRedeem",
		{
			args: ["1000000000000000000"]
		}
	);

	const { refetch: previewDeposit } = useContractRead(
		{
			addressOrName: XrabAddress,
			contractInterface: XRAB_ABI,
		},
		"previewDeposit",
		{
			args: ["1000000000000000000"]
		}
	);





	const handleMax = () => {
		const amount = (rabBalance - 1)/(10**18);
		setRabAmount(Math.round(amount));
	};

	const handleXMax = () => {
		const amount = (xRabBalance - 1)/(10**18);
		setXrabAmount(Math.round(amount));
	};

	const handleChange = () => {
		setIsDeposit(!isDeposit);
	};




	// 	useEffect(() => {
	// 		const fetchRabBalance = () =>
	// 			console.log("fetching RabBalance")
	// 			getRabBalance().then((data) =>
	// 				setRabBalance(data.data ?  data.data : 0)
	// 			);

	// 		const interval = setInterval(fetchRabBalance, 10000);
	// 		fetchRabBalance();

	// 		return () => clearInterval(interval);
	// 	}, [accountData?.address]);

	//   useEffect(() => {
	// 		const fetchXrabBalance = () =>
	// 			console.log("fetching XrabBalance")
	// 			getXrabBalance().then((data) =>
	// 				setXrabBalance(data.data ?  data.data : 0)
	// 			);

	// 		const interval = setInterval(fetchXrabBalance, 10000);
	// 		fetchXrabBalance();

	// 		return () => clearInterval(interval);
	// 	}, [accountData?.address]);


	useEffect(() => {
		const fetchRabAllowance = () =>
			console.log("fetching Rab allowance")
		getRabAllowance().then((data) =>
			setRabAllowance(data.data ? parseInt(data.data) : 0)
		);

		const fetchRabBalance = () =>
			console.log("fetching Rab balance")
		getRabBalance().then((data) =>
			setRabBalance(data.data ? parseInt(data.data) : 0)

		);

		const fetchXRabBalance = () =>
			console.log("fetching XRab balance")
		getXRabBalance().then((data) =>
			setXRabBalance(data.data ? parseInt(data.data) : 0)
		);

		const fetchDeposit = () =>
			console.log("fetching preview deposit")
		previewDeposit().then((data) =>
			setDepositPrice(data.data ? parseInt(data.data) : 0)
		);
		const fetchRedeem = () =>
			console.log("fetching preview redeem")
		previewRedeem().then((data) =>
			setRedeemPrice(data.data ? parseInt(data.data) : 0)
		);

		if (accountData?.address) {
			fetchRabAllowance()
			fetchXRabBalance()
			fetchRabBalance()
			fetchDeposit()
			fetchRedeem()
		}
	}, [accountData?.address, approving, depositing, redeeming]);

	const handleApprove = async () => {
		setApproving(true);
		try {
			const tx = await contractRab.approve(XrabAddress, "10000000000000000000000000000000");
			await tx.wait();
			setApproving(false);
		} catch (e) {
			console.log(e)
			console.error(e);
			setApproving(false);
		}
	};

	const handleDeposit = async () => {
		setDepositing(true);
		const amount = BigNumber.from(rabAmount).mul(BigNumber.from(10).pow(18));
		try {
			const tx = await contractXrab.deposit(amount.toString(), accountData?.address);
			await tx.wait();
			setDepositing(false);
		} catch (e) {
			console.log(e)
			console.error(e);
			setDepositing(false);
		}
	};

	const handleRedeem = async () => {
		setRedeeming(true);
		const amount = BigNumber.from(rabAmount).mul(BigNumber.from(10).pow(18));
		try {
			const tx = await contractXrab.redeem(amount.toString(), accountData?.address, accountData?.address);
			await tx.wait();
			setRedeeming(false);
		} catch (e) {
			console.log(e)
			console.error(e);
			setRedeeming(false);
		}
	};





	return (
		<main className={styles.main}>
			<div className=" bg-[#000000] p-8 pr-4 flex justify-center">
				<div className="flex justify-between w-3/4">
						<span className="font-bold text-5xl text-[#ffffff]">
							Happy Rabbits Vault
						</span>
					<Connect />
				</div>
			</div>

			<div className="flex flex-row items-center justify-evenly p-20">
				<div className="flex-column w-92">
					<div className="flex flex-row">
						<img src={"/images/nftRab.png"} className={styles.imageWrapper} />
						<div className="text-3xl text-[#ffffff] self-center">
							5% NFT Trading fees
						</div>
					</div>
					<div className="flex flex-row">
						<img src={"/images/tokenRab.jpeg"} className={styles.imageWrapper} />
						<div className="text-3xl text-[#ffffff] self-center">
							1% $RAB Transfer fees
						</div>
					</div>
				</div>
				<div>
					<div className="flex flex-row items-center justify-evenly ">
						<img src={"/images/neon.png"} className={styles.imageWrapper2} />
						<div className="text-5xl text-[#c1ffdd] self-center">
							...% APR
						</div>
					</div>
				</div>
			</div>

			<Flex justifyContent={"center"} marginTop={"-60px"}>
				{
					accountData?.address ?
						<>
						{isDeposit ?
							<Box padding={'10px'} border={"solid"} borderColor={"white"} width={'30%'} borderRadius={"15px"} justifyContent={'center'}>
								<Flex direction={"column"} justifyContent={"center"} >
									<Flex direction={"row"} justifyContent={"space-between"} margin={"5px"}>
										<Text color={'white'} fontSize={"18px"}>	Deposit $RAB in the XRAB Vault </Text>
										<Button fontSize={"10px"} bg={'black'} size={"xs"} border={'solid 1px'} borderColor={'white'}>
											<Text color={'white'} onClick={handleChange}>	Switch  </Text>
										</Button>
									</Flex>
									<Divider />
									<Flex direction={"column"} justifyContent={"center"} placeSelf={'center'} width={"60%"} marginTop={'10px'}>
										<Box border={"solid 1px"} borderColor={'white'}>
											<input
												type='number'
												className='outline-none focus:outline-none text-center w-full bg-black font-semibold text-2xl  md:text-basecursor-default flex items-center text-white  outline-none'
												name='custom-input-number'
												onChange={(e) => {
													setRabAmount(e.target.valueAsNumber);
												}}
												onBlur={validateRabAmount}
												value={rabAmount}></input>

										</Box>
										{error && <p className='text-red-500'>{error}</p>}
										<Flex direction={"row"} justifyContent={"space-between"} marginTop={"5px"}>
											<Text fontSize={"12px"} color={"white"} placeSelf={'center'} fontWeight={'light'}>
												Rab Balance : {(rabBalance / 10 ** 18).toLocaleString()}
											</Text>
											<Button size={"xs"} onClick={handleMax}> Max</Button>

										</Flex>
										<Box placeSelf={'center'}>
											<AiOutlineArrowDown color="white" size={"50px"} />
										</Box>

										<Text color={"white"} fontWeight={"extrabold"} fontSize={"1xl"} alignSelf={'center'}>
											You'll get {((rabAmount * depositPrice) / 10 ** 18).toFixed(3)}  $XRAB
										</Text>


									</Flex>

									<Text fontSize={"12px"} color={"white"} placeSelf={'center'} fontWeight={'light'}>
										XRab Balance : {(xRabBalance / 10 ** 18).toLocaleString()}
									</Text>


									{
										rabAllowance > 0 ?
											depositing ?
												<Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'30%'} placeSelf={'center'}>
													<Text color={"white"}>
														Depositing...
													</Text>
												</Button>
												:
												<Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'30%'} placeSelf={'center'} onClick={handleDeposit}>
													<Text color={"white"}>
														Deposit
													</Text>
												</Button>
											:
											approving === false ?
												<Button fontSize={"15px"} _hover={{ bg: '#39ff14' }} bg={"black"} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'30%'} placeSelf={'center'} onClick={handleApprove}>
													<Text color={"white"}>
														Approve Rab
													</Text>
												</Button> :
												<Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'30%'} placeSelf={'center'}>
													<Text color={"white"}>
														Approving ...
													</Text>
												</Button>
									}
								</Flex>
							</Box> 
							:
							<Box padding={'10px'} border={"solid"} borderColor={"white"} width={'30%'} borderRadius={"15px"} justifyContent={'center'}>
								<Flex direction={"column"} justifyContent={"center"} >

									<Flex direction={"row"} justifyContent={"space-between"} margin={"5px"}>
										<Text color={'white'} fontSize={"18px"}>	Withdrax $RAB from the XRAB Vault </Text>
										<Button fontSize={"10px"} bg={'black'} size={"xs"} border={'solid 1px'} borderColor={'white'}>
											<Text color={'white'} onClick={handleChange}>	Switch  </Text>
										</Button>
									</Flex>
									<Divider />

									<Flex direction={"column"} justifyContent={"center"} placeSelf={'center'} width={"60%"} marginTop={'10px'}>
										<Box border={"solid 1px"} borderColor={'white'}>
											<input
												type='number'
												className='outline-none focus:outline-none text-center w-full bg-black font-semibold text-2xl  md:text-basecursor-default flex items-center text-white  outline-none'
												name='custom-input-number'
												onChange={(e) => {
													setXrabAmount(e.target.valueAsNumber);
												}}
												onBlur={validateXRabAmount}
												value={xrabAmount}></input>

										</Box>
										{error && <p className='text-red-500'>{error}</p>}
										<Flex direction={"row"} justifyContent={"space-between"} marginTop={"5px"}>
											<Text fontSize={"12px"} color={"white"} placeSelf={'center'} fontWeight={'light'}>
												XRab Balance : {(xRabBalance / 10 ** 18).toLocaleString()}
											</Text>

											<Button size={"xs"} onClick={handleXMax}> Max</Button>

										</Flex>
										<Box placeSelf={'center'}>
											<AiOutlineArrowDown color="white" size={"50px"} />
										</Box>

										<Text color={"white"} fontWeight={"extrabold"} fontSize={"1xl"} alignSelf={'center'}>
											You'll get {((xrabAmount * redeemPrice) / 10 ** 18).toFixed(3)}  $RAB
										</Text>


									</Flex>

									<Text fontSize={"12px"} color={"white"} placeSelf={'center'} fontWeight={'light'}>
										Rab Balance : {(rabBalance / 10 ** 18).toLocaleString()}
									</Text>

									{
										redeeming ?
											<Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'30%'} placeSelf={'center'} onClick={handleRedeem}>
												<Text color={"white"}>
													Redeeming...
												</Text>
											</Button>
											:
											<Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'30%'} placeSelf={'center'} onClick={handleRedeem}>
												<Text color={"white"}>
													Redeem
												</Text>
											</Button>
									}


								</Flex>
							</Box>
							}
						</>
						:
						
						<Text fontWeight={"bold"} color={"white"}>Connect Wallet to Deposit/Withdraw in the XRab Vault</Text>
				}
			</Flex> 
		</main>
	);
};

export default Page;
