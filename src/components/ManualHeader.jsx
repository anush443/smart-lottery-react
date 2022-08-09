import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"

const ManualHeader = () => {
    const { enableWeb3, Moralis, isWeb3Enabled, deactivateWeb3 } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) {
            return
        }
        if (typeof window != "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Accoutn changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])
    return (
        <>
            <button
                onClick={async () => {
                    await enableWeb3()
                    if (typeof window != "undefined") {
                        localStorage.setItem("connected", "injected")
                    }
                }}
            >
                Connect
            </button>
        </>
    )
}

export default ManualHeader
