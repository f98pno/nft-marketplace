import { MetaMaskInpageProvider } from "@metamask/providers"
import { Contract, providers } from "ethers"
import { SWRResponse } from "swr"

export type Web3Dependencies = {
    provider: providers.Web3Provider
    contract: Contract
    ethereum: MetaMaskInpageProvider
}

export type CryptoHookFactory<D = any, R = any, P = any> = {
(d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>
} // Partial mean that not all dependencies needs to be provided

export type CryptoHandlerHook<D = any, R = any, P = any> = (params?: P) => CryptoSWRResponse<D, R> // Could have referred to SWRResponse directly

// & R here means the same as writing & UseAccountResponse = { connect: () => void }
export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R

// export type CryptoHookFactory<D = any, P = any> = {
//    (d: Partial<Web3Dependencies>): (params: P) => SWRResponse<D>
// }
// D = Data
// P = Paramether