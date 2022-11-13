import { ethers } from './ethersJS/ethers-5.2.esm.min.js';
import { accountAddress, signer } from './connect_wallet.js';
import { fetchNFTSFromAddress, floorPrice, post_nft_details } from '../API_consumer.js';
import { LOAN_CONTRACT_FACTORY_ADDRESS, LOAN_CONTRACT_FACTORY_ABI } from './variables/addressAndAbi.js';
import { IERC721 } from './variables/IERC721.js';

const loanButton = document.querySelector('.loan');
loanButton.onclick = init_loan;

let stored_loanDetails = JSON.parse(localStorage.getItem('loan_form'));
const nft = localStorage.getItem("collection_slug");
// console.log(stored_loanDetails, nft);
const nft_slug = nft.split('_')[0];
const nft_token_id = nft.split('_')[1];
// console.log(nft_slug, nft_token_id);

// get chosen nft details
let assets = await fetchNFTSFromAddress(accountAddress);
let token_details = {};
assets.forEach((e) => {
    if (nft_slug == e.collection.slug && nft_token_id == e.token_id){
        token_details["name"] = e.name
        token_details["slug"] = e.collection.slug
        token_details["token_id"] = e.token_id
        token_details["token_address"] = e.asset_contract.address
        token_details["token_schema_name"] = e.asset_contract.schema_name
        token_details["image_url"] = e.image_preview_url
    };
})

// console.log(token_details);


// retrieve floor price
let FP = await floorPrice(token_details["slug"]);
let collection_size = FP["collection"]["stats"]["total_supply"];
FP = (FP["collection"]["stats"]["total_supply"]);

// ...................Interest..........................
// LFT == LA * 100/FP
// interest IN 30days== 30days/duration * interest (To get interest in 30days)
// APY == interest IN 30days * 12(To get APY in 12months(ANNUAL INTEREST RATE))
// 1day in mintutes == 1440 mintutes 
// 3odays in minutes == 1440 * 30 = 43200
// Assuming the duration inputs are all in mintutes
//..........................................................


// calculating APY
function get_APY(duration, interest) {
    let interestIn30Days = (30/duration)*interest;
    let annualInterest = interestIn30Days*12;
    
    return annualInterest;
}


const minAndMax = {}
function calculateMinAndMaxReturns(){
    const APY = get_APY(stored_loanDetails["duration"], stored_loanDetails["interest"]);
    // console.log(APY)
    let maxReturn = Number(stored_loanDetails["amount"])/100*APY;
        maxReturn = maxReturn + Number(stored_loanDetails["amount"])
        minAndMax["max_return"] = maxReturn.toFixed(3);

    let minReturn = (APY/12)/6;
        minReturn = Number(stored_loanDetails["amount"])/100*minReturn;
        minReturn = minReturn + Number(stored_loanDetails["amount"]);
        minAndMax["min_return"] = minReturn.toFixed(3);
}

calculateMinAndMaxReturns()
// console.log(minAndMax)

const loan_factory_contract = new ethers.Contract(LOAN_CONTRACT_FACTORY_ADDRESS, LOAN_CONTRACT_FACTORY_ABI, signer);
const IERC721_ABI = new ethers.Contract(token_details["token_address"], IERC721, signer);


async function  init_loan() {
    const create_loan_contract = await loan_factory_contract.createP2PLoanContract(token_details["token_address"])
    .catch((err) => console.log(err.message))

    loan_factory_contract.on("LoanContract", async(_p2ploan, index) => {
        let info = {
            address: _p2ploan,
            index: ethers.utils.formatUnits(index, 0)
        };

        // approve contract
        await IERC721_ABI.approve(info["address"], token_details["token_id"])
        .catch((err) => console.log(err.message))

        IERC721_ABI.on("Approval", async(owner,approved,tokenId) => {
            // create loan
            await loan_factory_contract.LFCreateLoan(
                info["index"].split('.')[0],
                ethers.utils.parseEther(stored_loanDetails["amount"]),
                stored_loanDetails["duration"],
                ethers.utils.parseEther(stored_loanDetails["interest"]),
                token_details["token_id"]
            ).catch((err) => console.log(err.message))

            loan_factory_contract.on('LoanCreated', async(loanCreated) => {
                 // make post request to database.
                 const APY = get_APY(stored_loanDetails["duration"], stored_loanDetails["interest"]);
                 await post_nft_details(token_details, 
                    stored_loanDetails, 
                    info, 
                    FP, 
                    APY, 
                    minAndMax, 
                    collection_size, 
                    accountAddress).then((data) => {
                     console.log(data)
                     localStorage.clear()
                 }).catch((err) => console.log(err.message))
                 
                 
            })
            
        })
    })
}