//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
    //create Loan
    //quit loan if state is not change
    //deposit eth in relation to the amount of loan needed
    //see if the nft can back up the loan
    //deposit multiple NFTs

contract P2PLoan{

    address public borrower;
    address public lender;
    IERC721 public NFTContract;
    address public NFTContractAddress;
    uint256 public start;

    enum State{LOAN_CREATED, AWAITING_FUNDING, LOAN_FUNDED, LOAN_CANCLED, LOAN_PAYED, LOAN_EXPIRED}

    event CreatedLoan (uint256 loanAmount, uint256 durationOfLoan, uint256 interest, uint256 tokenID);
    event UpdatedLoan (uint256 updateDurationOfLoan, uint256 updateInterest, uint256 updateLoanAmount);
    event LoanFunded(address _sender, uint256 time, uint256 value, State _current);

    State public current_state;

    mapping(address => uint256) public loanAmountDeposited;
    mapping(IERC721 => uint256) public NFTToTokenID; //map nft to tokenID

    struct LoanDetails{
        address borrowerAddress;
        uint256 loanAmount;
        uint256  durationOfLoan;
        uint256 interest;
        uint256 tokenId;
    }

    LoanDetails public loanDetail;

    constructor (address _nftContractAddress, address _loanee){
        borrower = _loanee;
        NFTContract = IERC721(_nftContractAddress);
        NFTContractAddress = _nftContractAddress;
        current_state = State.LOAN_CREATED;
    }

    modifier onlyBorrower{
        require(msg.sender == borrower, "Only borrower can call this function.");
        _;
    }

    function createLoan(uint256 _loanAmountInWEi, 
    uint256 _durationOfLoan, 
    uint256 _interestInWEI, 
    uint256 _tokenID, 
    address _from, 
    address _to, 
    address _sender) public payable{
        require(_sender == borrower, "Only borrower can call this function.");
        require(current_state == State.LOAN_CREATED, "Loan already Created");
        NFTContract.transferFrom(_from, _to, _tokenID);
        NFTToTokenID[NFTContract] = _tokenID;
        loanDetail.borrowerAddress = borrower;
        loanDetail.loanAmount = _loanAmountInWEi;
        loanDetail.interest = _interestInWEI;
        loanDetail.tokenId = _tokenID;
        loanDetail.durationOfLoan = _durationOfLoan * 1 minutes;
        current_state = State.AWAITING_FUNDING;

        emit CreatedLoan(_loanAmountInWEi, loanDetail.durationOfLoan, _interestInWEI, _tokenID);
    }

    // Update Loan loanDetail
    function updateLoanDetail(uint256 _updateDurationOfLoan, uint256 _updateInterestInWEI, uint256 _updateLoanAmount) public {
        require(current_state == State.AWAITING_FUNDING,"");
        loanDetail.durationOfLoan =(_updateDurationOfLoan * 1 minutes);
        loanDetail.loanAmount = _updateLoanAmount;
        loanDetail.interest = _updateInterestInWEI;

        emit UpdatedLoan(_updateDurationOfLoan, _updateInterestInWEI, _updateLoanAmount);
    }


    function cancelLoan(address _from, address _sender) public{
        require(_sender == borrower, "Only borrower can call this function.");
        require(current_state == State.AWAITING_FUNDING || current_state ==State.LOAN_CANCLED , "Loan is already Funded");
        NFTContract.transferFrom(_from, borrower, NFTToTokenID[NFTContract]);
        current_state = State.LOAN_CANCLED;
    }


    
    function fundBorrower(address _sender, uint256 _value) public payable{
        require(current_state == State.AWAITING_FUNDING, "");
        //require(msg.value == loanDetail.loanAmount, "Value has too be equal to loan Amount");
        lender = _sender;
        loanAmountDeposited[lender] = _value;
        start = block.timestamp;
        loanDetail.durationOfLoan = start + loanDetail.durationOfLoan;
        current_state = State.LOAN_FUNDED;
        emit LoanFunded(lender, loanDetail.durationOfLoan, loanDetail.loanAmount, current_state);
    }


    function payLoan(address _from, address _sender) public payable {
        require(current_state == State.LOAN_FUNDED, "Loan is yet to be funded.");
        require(_sender == borrower, "Only borrower can call this function.");
        if (block.timestamp >= loanDetail.durationOfLoan) {
            loanExpired();
        }else{
            //require(_value == loanDetail.loanAmount, "Value has too be equal to loanAmount+interest");
            // transfer _from NFT contract to borrower if loan has not expired.
            NFTContract.transferFrom(_from, borrower, NFTToTokenID[NFTContract]);
        }
        current_state = State.LOAN_PAYED;
        // send money back with interest
    }


    function loanExpired() public {
        require(block.timestamp >= loanDetail.durationOfLoan, "Time Is not over");
        require(current_state == State.LOAN_FUNDED);
        NFTContract.transferFrom(address(this), lender, NFTToTokenID[NFTContract]);
        // send nft to lender when loan expires
    }


    function getInterest() public view returns(uint256 interestToBePaid, uint256 validStart) {
        //require (block.timestamp <= loanDetail.durationOfLoan, );
        require(current_state == State.LOAN_FUNDED, "");
        if (block.timestamp < loanDetail.durationOfLoan) {
            uint256 timeRemaining = (loanDetail.durationOfLoan - block.timestamp);
            uint256 interestRate = loanDetail.interest;
            validStart = block.timestamp + 1 minutes;
            // startTime == interestRate;
            // timeRemaining == newInterest;
            uint256 loanDuration = loanDetail.durationOfLoan - start;
            uint256 timeRemainingNow = loanDuration - timeRemaining;
            uint256 newInterest = (timeRemainingNow * interestRate)/loanDuration;
            interestToBePaid = (loanDetail.loanAmount * newInterest)/ 100 ether;
            //interestNow = interestToBePaid;
            return(interestToBePaid, validStart);
        }else {
            uint256 newInterest = loanDetail.interest;
            interestToBePaid = (loanDetail.loanAmount * newInterest)/ 100 ether;
            return(interestToBePaid, validStart);
        }
        // assume that the timestamp is in seconds
        // it's in wei
    }
}