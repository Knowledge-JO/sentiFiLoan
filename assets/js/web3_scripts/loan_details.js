import { ethers } from "./ethersJS/ethers-5.2.esm.min.js";
import { get_loanDetails, patch_nft_details } from "../API_consumer.js"
import { accountAddress, signer, checkMetamask } from "./connect_wallet.js";
import { LOAN_CONTRACT_FACTORY_ADDRESS, LOAN_CONTRACT_FACTORY_ABI } from './variables/addressAndAbi.js';

const fund_loan_btn = document.querySelector('.fund-loan-btn');
const form_info = document.querySelector('.form-info');
const nft_image = document.querySelector('.slider-item .card-image img');
const title = document.querySelector('.title1 .green-text');
const id = Number(localStorage.getItem('id'))
const status = document.querySelector('.status')
const pay_loan = document.querySelector('.pay-loan-btn');
const cancel_loan = document.querySelector('.cancel-loan-btn')


function filterLoanDets() {
    data = data.filter((item) => {
        return item.id === id;
    })
}

function checkTokenType(tokenType){
    if(tokenType === 'ERC721'){
        return '/assets/images/eth-1.svg'
    }
}


let data =  await get_loanDetails();

async function loan_dets() {
    filterLoanDets()
    let item = data[0];
    status.textContent = `${item.status}`
    let html = `
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        <img src="/assets/images/link-icon.svg" alt="link icon" class="info-icon" />
        Floor
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value solana-amount">
        <img src=${checkTokenType(item.tokenType)} alt="solana icon" />
        ${item.floor_Price} ETH
        </div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        <img src="/assets/images/link-icon.svg" alt="link icon" class="info-icon" />
        Floor
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value solana-amount">
        <img src=${checkTokenType(item.tokenType)} alt="solana icon" />
        ${item.floor_Price} ETH
        </div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Collection Size
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value solana-amount">
        <img src=${checkTokenType(item.tokenType)} alt="solana icon" />
        ${item.collection_size}
        </div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Funding Amount
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value solana-amount">
        <img src=${checkTokenType(item.tokenType)} alt="solana icon" />
        ${item.amount}
        </div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Duration
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value">${item.duration.split(' ')[0]} days</div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        LTF
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value">${item.LTF}</div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        APY
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value">${item.APY}</div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Early Repayment&nbsp;<span class="red-text">
            (Before 5.1 Days)
        </span>
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value solana-amount">
        <img src=${checkTokenType(item.tokenType)} alt="solana icon" />
        ${item.min_return}
        </div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Min Return
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value">${item.min_return}</div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Maturity Repayment&nbsp;<span class="red-text">
            (Day ${item.duration.split(' ')[0]})
        </span>
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value solana-amount">
        <img src=${checkTokenType(item.tokenType)} alt="solana icon" />
        ${item.max_return}
        </div>
    </div>
    <!-- Item -->
    <div class="form-info__item">
        <div class="title green-text">
        Max Return
        <img src="/assets/images/info-icon.svg" alt="info icon" class="info-icon" />
        </div>
        <div class="value"> ${item.max_return}</div>
    </div>
    <!-- Item -->
    <p>
        Loans can be paid back early with a minimum of 30% of total
        interest. Loans have a 6h grace after the initial loan
        period ends.
    </p>
    
    `

    title.textContent = item.NFT_name;
    form_info.innerHTML = html;

    nft_image.setAttribute('src', item.image_URL)

    checkMetamask().then((state) => {
        if(state){
            fund_loan_btn.textContent = 'Fund Loan';
            fund_loan_btn.removeAttribute('data-modal-target');
            if(item.loanee_address === accountAddress){
                pay_loan.style.display = 'block';
                cancel_loan.style.display = 'block';
            }
        }
    })
}




const loan_factory_contract = new ethers.Contract(LOAN_CONTRACT_FACTORY_ADDRESS, LOAN_CONTRACT_FACTORY_ABI, signer);

async function fundLoan(loan_contract_index, loanee_address, amount){
    // fund the loan
    await loan_factory_contract.LFFundLoan(Number(loan_contract_index), loanee_address, {value: amount})
    .catch(err => {
        console.log(err.message)
    })
}

async function payLoan(loan_contract_index, loanee_address, amount) {
    // pay back loan
    await loan_factory_contract.interest(loan_contract_index, loanee_address).then(response => console.log(ethers.utils.parseEther((Number(ethers.utils.formatEther(response[0]))+Number(amount)).toString())))
    console.log(amount)
    await loan_factory_contract.interestValidPeriod(loan_contract_index, loanee_address).then(() => {
        loan_factory_contract.on('ValidInterestNow', async ( validInterestNow ) => {
            await loan_factory_contract.getInterestInValidPeriod(loan_contract_index, loanee_address)
            .then(async (response) => {
                let interest = Number(ethers.utils.formatEther(response))
                console.log(amount)
                console.log(interest)
                let amountToPay = ethers.utils.parseEther((Number(amount)+interest).toString())
                await loan_factory_contract.LFPayLoan(loan_contract_index, loanee_address, {value:amountToPay});
            })
            
        })
    }).catch(err => console.log(err))
    
}

async function cancelLoan(loan_contract_index, loanee_address) {
    // cancel loan 
    await loan_factory_contract.LFCancelLoan(loan_contract_index, loanee_address)
    .then(response => console.log(response))
    .catch(err => console.log(err))
}

loan_dets().then(() => {
    filterLoanDets()
    let amount = data[0].amount.split(' ')[0]
    
    fund_loan_btn.addEventListener('click', async () => { 
        amount = ethers.utils.parseEther(amount)  
        await fundLoan(data[0].loan_contract_index, data[0].loanee_address, amount)
        loan_factory_contract.on("LoanFunded", async () => {
            await patch_nft_details(data[0].id, "Loan Funded")
        })
    })

    pay_loan.addEventListener('click', async () => {
        await payLoan(data[0].loan_contract_index, data[0].loanee_address, amount)
        loan_factory_contract.on("LoanPayed", async () => {
            await patch_nft_details(data[0].id, "Loan Payed")
        })
    })

    cancel_loan.addEventListener('click', async () => {
        await cancelLoan(data[0].loan_contract_index, data[0].loanee_address);
        loan_factory_contract.on("LoanCanceled", async () => {
            await patch_nft_details(data[0].id, "Loan Canceled")
        })
    })
        
})

