import React, { useEffect, useState } from "react"
import { abi, contractAddresses } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const EnterRaffle = () => {
    const [entranceFee, setEntranceFee] = useState("0")
    const [nosOfPlayers, setNosOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const { chainId: chainIdHex, isWeb3Enabled, enableWeb3 } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    // console.log(chainId)
    console.log(raffleAddress)
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })
    const updateUIvalues = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberofPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()

        setEntranceFee(entranceFeeFromCall)
        setNosOfPlayers(numberofPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }
    const dispatch = useNotification()

    const handleSuccessNotification = async () => {
        dispatch({
            type: "info",
            title: "Transaction Notification",
            message: "Transaction Compelete",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUIvalues()
        handleSuccessNotification(tx)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIvalues()
        }
    }, [isWeb3Enabled])
    return (
        <>
            {raffleAddress ? (
                <>
                    <button
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Lottery
                    </button>
                    <div>
                        <h3>Enterance Fee:{ethers.utils.formatUnits(entranceFee)}</h3>
                        <h3>Number of players:{nosOfPlayers}</h3>
                        <h3>Recent Winner:{recentWinner}</h3>
                    </div>
                </>
            ) : (
                <h3>Connceted to a supported chain</h3>
            )}
        </>
    )
}

export default EnterRaffle
