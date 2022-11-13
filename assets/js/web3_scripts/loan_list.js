import { get_loanDetails } from "../API_consumer.js";

const nfts__wrapper = document.querySelector('.nfts__wrapper');

function checkTokenType(tokenType){
    if(tokenType === 'ERC721'){
        return '<img src="/assets/images/eth-1.svg" alt="solana-icon" />'
    }
}

async function loan_listing(){
    // get loan list from database, display on site
    // ./loan-listing-1/
    await get_loanDetails().then(data => data.forEach((e) => {
        let html = `
            <a href="./loan-listing-1/"  class="nfts__card" id="${e.id}">
                <div class="nfts__card__left">
                <img src="${e.image_URL}" alt="owner image" />
                </div>
                <div class="nfts__card__right">
                <p class="nft-name">${e.NFT_name}</p>
                <div class="status">
                    <div class="status__item">
                    <img src="/assets/images/clock.svg" alt="clock-icon" />
                    ${e.duration.split(' ')[0]} days
                    </div>
                    <div class="status__item">
                    <img src="/assets/images/cylinder.svg" alt="cylinder-like-icon" />
                    ${e.interest}%
                    </div>
                    <div>
                    <span class="green-text">LTF</span>
                    ${e.LTF}
                    </div>
                    <div>
                    <span class="green-text">APY</span>
                    ${e.APY}
                    </div>
                </div>
                <div class="card__footer">
                    Loan + Return
                    <div class="solana-amount">
                    ${checkTokenType(e.tokenType)}
                    ${e.max_return}
                    </div>
                </div>
                </div>
            </a>
        `
        nfts__wrapper.innerHTML += html;
    }))
    
}




await loan_listing().then(() => {
    nfts__wrapper.addEventListener('click', (e) => {
        if(e.target.tagName !== "A"){
            if (e.target.tagName === "IMG"){
                localStorage.setItem('id', e.target.parentElement.parentElement.getAttribute('id'))
            }
        }else{
            localStorage.setItem('id', e.target.getAttribute('id'))
        }
    })
})

