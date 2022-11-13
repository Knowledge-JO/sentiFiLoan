// get nfts from address
export async function fetchNFTSFromAddress(currentAddress){
    const options = {method: 'GET', headers:{Accept: 'application/json'}}
    const fetchNFTs = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${currentAddress}&order_direction=desc&offset=0&limit=20&include_orders=false`, options)
    .then((response) => response.json())
    .catch(err => console.error(err))
    return (fetchNFTs['assets'])
}


// get loan details
export async function get_loanDetails() {
    const options =  {
        headers: {
            'Authorization': 'Basic ' + btoa(`John:123Awesome123`)
        }
    }
    const response = await fetch('https://sentifiapi.herokuapp.com/api/loan/', options);
    
    const data = await response.json();

    return data;
}


// get floor_price
export async function floorPrice(slug) {
    const options = {method: 'GET', "Content-Type": "application/json"};
    const response = await fetch (`https://testnets-api.opensea.io/api/v1/collection/${slug}`, options);
    const floor_price = response.json();

    return floor_price;
}


export async function post_nft_details(token_details, stored_loanDetails, info, FP, APY, minAndMax, collection_size, accountAddress) {
    const options = {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify({
            "NFT_name": token_details["name"],
            "image_URL": token_details["image_url"],
            "token_id": token_details["token_id"],
            "NFT_contract_address": token_details["token_address"],
            "loanee_address": accountAddress,
            "loan_contract_index": info["index"].split('.')[0],
            "loan_contract_address":info["address"],
            "collection_size": collection_size,
            "floor_Price": FP,
            "duration": `${stored_loanDetails["duration"]} days`,
            "interest": stored_loanDetails["interest"],
            "amount": `${stored_loanDetails["amount"]}`,
            "max_return": `${minAndMax["max_return"]}`,
            "min_return": `${minAndMax["min_return"]}`,
            "tokenType": token_details["token_schema_name"],
            "LTF": `${stored_loanDetails["amount"]*100/FP}%`,
            "APY": `${APY}%`,
            "status": 'Loan Awaiting Funds'
        }),
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Basic ' + btoa(`John:123Awesome123`)
        }
    }
    const response = await fetch('https://sentifiapi.herokuapp.com/api/loan/', options);
    const data = response.json();
    return data;
}


export async function patch_nft_details(id, status) {
    const options = {
        method: "PATCH",
        mode: 'cors',
        body: JSON.stringify({
            "status": status
        }),
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Basic ' + btoa(`John:123Awesome123`)
        }
    }
    const response = await fetch(`https://sentifiapi.herokuapp.com/api/loan/${id}/`, options);
    const data = response.json();
    return data;
}