import styles from "../styles/Home.module.css";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import { useAccount, useContract, useContractRead, useSigner } from "wagmi";

import { XRAB_ABI } from "../abi/xRabAbi.js";
import { NFT_ABI } from "../abi/nftAbi.js";



import { ethers } from "ethers";
import { AiOutlineArrowDown } from 'react-icons/ai';
import { Connect } from "../components";
import Link from "next/link";
import { Box, Button, Divider, Flex, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, VStack } from "@chakra-ui/react";

const Mint = () => {


const NoteAddress = "0x4e71a2e537b7f9d9413d3991d37958c0b5e1e503";
const NFT = "0x26CC9988186A58e5Be0B63E8f89e552869B0A156";

const { data: signer } = useSigner();
const { data: accountData, isLoading } = useAccount();
const [rabBalance, setRabBalance] = useState(0);
const [rabAllowance, setRabAllowance] = useState(0);
const [nftSupply, setNftSupply] = useState(0);
const [userNftBalance, setUserNftBalance] = useState(0);

const [mintAmount, setMintAmount] = useState(0);

const [approving, setApproving] = useState(false);
const [minting, setMinting] = useState(false);
const [error, setError] = useState("");




const contractRab = useContract({
	addressOrName: NoteAddress,
	contractInterface: XRAB_ABI,
	signerOrProvider: signer,
});

const contractNFT = useContract({
	addressOrName: NFT,
	contractInterface: NFT_ABI,
	signerOrProvider: signer,
});



const validateMintAmount = () => {
	if (mintAmount < 1 || mintAmount > 10) {
		setError("Invalid Mint Amount");
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
			addressOrName: NoteAddress,
			contractInterface: XRAB_ABI,
		},
		"balanceOf",
    {
      args:[accountData?.address]
    }
	);

	

	const { refetch: getRabAllowance } = useContractRead(
		{
			addressOrName: NoteAddress,
			contractInterface: XRAB_ABI,
		},
		"allowance",
    {
      args:[accountData?.address, NFT]
    }
	);

    const { refetch: getSupply } = useContractRead(
		{
			addressOrName: NFT,
			contractInterface: NFT_ABI,
		},
		"totalSupply",
    {
      args:[]
    }
	);

    const { refetch: getUserNftBalance } = useContractRead(
		{
			addressOrName: NFT,
			contractInterface: NFT_ABI,
		},
		"balanceOf",
    {
      args:[accountData?.address]
    }
	);


  useEffect(() => {
	const fetchRabAllowance = () =>
        console.log("fetching Note Allowance")
		getRabAllowance().then((data) =>
			setRabAllowance(data.data ? parseInt(data.data) : 0)			
		);

	const fetchRabBalance= () =>
		console.log("fetching Note Balance")
		getRabBalance().then((data) =>
		  setRabBalance(data.data ? parseInt(data.data) : 0)
			
		);

	const fetchTotalSupply= () =>
		console.log("fetching supply")
		getSupply().then((data) =>
        setNftSupply(data.data ? parseInt(data.data) : 0)
		);

    const fetchUserNftBalance= () =>
		console.log("fetching user balance")
		getUserNftBalance().then((data) =>
        setUserNftBalance(data.data ? parseInt(data.data) : 0)
		);



	if(accountData?.address){
		fetchRabAllowance()
		fetchRabBalance()
		fetchTotalSupply()
	}
	}, [accountData?.address, approving, minting]);

	const handleApprove = async () => {
		setApproving(true);
		try {
			const tx = await contractRab.approve(NFT, "10000000000000000000000000000000");
			await tx.wait();
			setApproving(false);
		} catch (e) {
			console.log(e)
			console.error(e);
			setApproving(false);
		}
	};

		const handleMint = async () => {
		setMinting(true);
		try {
			const tx = await contractNFT.mint(mintAmount);
			await tx.wait();
			setMinting(false);
		} catch (e) {
			console.log(e)
			console.error(e);
			setError("Not Enough Note");
			setMinting(false);
		}
	};

	



  return (
    <main className={styles.main}>
			<div className=" bg-[#000000] p-8 pr-4 flex justify-center">
				<div className="flex justify-between w-3/4">
						<span className="font-bold text-5xl text-[#ffffff]">
							Happy Rabbits NFT
						</span>
					<Connect />
				</div>
			</div>
        <Box margin={"50px"}>
       <Flex direction={"column"} alignItems={'center'}>
        <HStack spacing={"30px"}>
            <img src={"/images/rabgif.gif"} className={styles.imageWrapper2} />
            {/* <Divider orientation='vertical' color={"white"}/> */}
            <VStack spacing={"30px"}>
                <Text color={"white"} fontWeight={'extrabold'} fontSize={'2xl'}>
                    Total Supply : {nftSupply} / 2222
                </Text>
                <VStack spacing={"5px"}>
                <Box width={"50%"}>
                <input
							type='number'
							className='outline-none focus:outline-none text-center w-full bg-white-300 font-semibold text-2xl hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none'
							name='custom-input-number'
							onChange={(e) => {
								setMintAmount(e.target.valueAsNumber);
							}}
							onBlur={validateMintAmount}
							value={mintAmount}></input>
                            </Box>
                <Text fontWeight={"light"} color={'white'}>
                    $NOTE Balance : {(rabBalance / (10**18)).toLocaleString()}
                </Text>
                {error && <p className='text-red-500'>{error}</p>}
                   </VStack>
                   <Text color={'white'}>
                    Total Spending : {mintAmount * 25} $NOTE 
                </Text>
                {
				    rabAllowance > 0 ?
                        minting == true ?
					        <Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'60%'} placeSelf={'center'}>
					        	<Text color={"white"}>
					        		Minting...
					        	</Text>
					        </Button>
					        :
					        <Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'60%'} placeSelf={'center'} onClick={handleMint}>
					        	<Text color={"white"}>
					        		Mint
					        	</Text>
					        </Button>
                    :
                    approving === false ?
							<Button fontSize={"15px"} _hover={{ bg: '#39ff14' }} bg={"black"} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'60%'} placeSelf={'center'} onClick={handleApprove}>
								<Text color={"white"}>
									Approve Rab
								</Text>
							</Button> :
							<Button fontSize={"15px"} bg={"black"} _hover={{ bg: '#39ff14' }} border={"solid"} borderColor={"#39ff14"} margin={"15px"} width={'60%'} placeSelf={'center'}>
								<Text color={"white"}>
									Approving ...
								</Text>
							</Button>}
            </VStack>
            </HStack>
            {
                userNftBalance > 0 ?
                <Text fontWeight={'extrabold'} color={'white'} marginTop={'25px'}>You own {userNftBalance} Happy Rabbits!</Text>
                :
                <Text fontWeight={'extrabold'} color={'white'} marginTop={'25px'}>You don't have any Happy Rabbits, mint some cute Rabbits!</Text>
            }
            
       </Flex>
       </Box>
    </main>
  );
};

export default Mint;
