import { ethers } from './ethersJS/ethers-5.2.esm.min.js';
import { accountAddress } from './connect_wallet.js';
import { fetchNFTSFromAddress } from '../API_consumer.js';

const slider = document.querySelector('.slider');
const duration = document.querySelector('#duration');
const amount = document.querySelector('#amount');
const interest = document.querySelector('#interest');
const loan = document.querySelector('.loan');


let stored = JSON.parse(localStorage.getItem("collection_slug"));
console.log(stored);


const assets = await fetchNFTSFromAddress(accountAddress);

assets.forEach((element) => {
    let html = '<div class="slider-item">'
        html += '<div class="card-image">'
        html += `<img src="${element.image_preview_url}" alt="nft image" /></div>`
        html += '<div class="card-text"><div>'
        html += `<p class="title fw-bold">${element.name}</p>`
        html += `<p class="name red-text">${element.asset_contract.name}</p></div>`

    if (stored.includes(`${element.collection.slug}_${element.token_id}`)){
        slider.innerHTML += html;
    }
})

// let slider_html = `<a class="previous">
//   <img src="/assets/images/arrow-left.svg" alt="arrow left" /></a>
//   <a class="next">
//   <img src="/assets/images/arrow-right.svg" alt="arrow right"></a></div>
//    `

// slider.innerHTML += slider_html;

let loanDetails = {};
loan.addEventListener('click', () => {
  loanDetails['duration'] = duration.value;
  loanDetails['interest'] = interest.value;
  loanDetails['amount'] = amount.value;
  localStorage.setItem('loan_form', JSON.stringify(loanDetails))
})


