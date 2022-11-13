import { ethers } from './ethersJS/ethers-5.2.esm.min.js'

const connectWallet = document.querySelector('.dropdown-btn')
const connectWithMetamask = document.getElementById('metamask');
connectWithMetamask.onclick = connectMetamask;

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = provider.getSigner();
//export const accountAddress = await signer.getAddress()
export let accountAddress = await provider.listAccounts()
accountAddress = accountAddress[0]
export async function checkMetamask(){
    if (typeof window.ethereum !== "undefined"){

        let listAccounts = await provider.listAccounts()
        
        if (listAccounts.length != 0){
            connectWallet.innerHTML = '<img src="/assets/images/wallet.svg" alt="img" />Wallet Connected'
            return true;
    
        }else{
            console.log('Not Connected')
            return false;
        }
    }
}

await checkMetamask()


async function connectMetamask() {
    if (typeof window.ethereum !== "undefined") {
        try{
            await provider.send("eth_requestAccounts", []);
            location.reload()
        }catch (error) {
            console.log(error);
        }
        connectWallet.innerHTML = '<img src="/assets/images/wallet.svg" alt="img" />Wallet Connected'
    }
}

