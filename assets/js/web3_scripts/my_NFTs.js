import { ethers } from './ethersJS/ethers-5.2.esm.min.js'
import {VERIFIED_NFTS} from './variables/addressAndAbi.js'
import { fetchNFTSFromAddress } from '../API_consumer.js';
import {accountAddress} from './connect_wallet.js';



const cards = document.querySelector('.cards');

export const dictionary = {};

const CHOSEN_NFTS = []

async function createNFTCards(){
    let assets = await fetchNFTSFromAddress(accountAddress);
    assets.forEach((element) => {
        if (VERIFIED_NFTS.includes(element.asset_contract.address)){
            let html = `<div class="card nft-collateral" id=${element.collection.slug}_${element.token_id}>
            <div class="card-image">
            <img src="${element.image_preview_url}" alt="img" /></div>
            <div class="card-text">
            <p class="title">${element.name}</p>
            <p class="name">${element.asset_contract.name}</p>
            <div class="solana-amount">
            <span></div></div>`
            cards.innerHTML += html;
            let keys_in_dict = Object.keys(dictionary)
            dictionary[`${element.collection.slug}_address`] = element.asset_contract.address;
            if(keys_in_dict.includes(`${element.collection.slug}_token_id`)){
                dictionary[`${element.collection.slug}_token_id`].push(element.token_id);
            }else{
                dictionary[`${element.collection.slug}_token_id`] = [element.token_id];
            }
        }
    })
}



await createNFTCards()
.then(() => {
    cards.addEventListener('click', (e) => {

        let elementId = e.target.parentElement.parentElement.getAttribute('id');
        console.log(elementId)
        //elementId = elementId.split('_')[0];
    
        if (!(CHOSEN_NFTS.includes(elementId))){
            CHOSEN_NFTS.push(elementId);
        }
        localStorage.setItem("collection_slug", JSON.stringify(CHOSEN_NFTS));
        
    })
})
console.log(dictionary)