// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './P2PLoan.sol';

contract P2PLoanFactory{

    address public owner;
    address[] public loaneeList;
    uint256 public call_window;
    mapping (address => LoanFactoryObject) public loanFactory;
    mapping ( address => bool ) acceptableNFTs;

    mapping (address => mapping(P2PLoan => LoanDetails)) loanDetail;

    event LoanContract(P2PLoan _p2ploan, uint256 index);
    event LoanCreated(string loanCreated);
    event LoanFunded(string loanFunded);
    event LoanPayed(string loanPayed);
    event LoanCanceled(string loanCanceled);
    event ValidInterestNow(uint256 validInterestNow);
    event UpdatedLoanDetails(string loanDetsUpdated);
    enum InterestUpdated{INTEREST_VALUE_PERIOD_NOT_CALLED,INTEREST_VALUE_PERIOD_CALLED}
    constructor () {
        owner = msg.sender;
    }

    struct LoanFactoryObject{
        address loanee;
        P2PLoan[] p2ploans;
        mapping (P2PLoan => uint256) p2ploanIndexFromCA;
        InterestUpdated interestUpdated;
    }

    struct LoanDetails {
        address LFBorrower;
        address LFLoaner;
        uint256 LFLoanAmountInWEi;
        uint256 LFDurationOfLoan;
        uint256 LFInterestInWEI;
        uint256 validInterestNow;
    }


    function createP2PLoanContract(address _NFTAddress) public {
        require(acceptableNFTs[_NFTAddress] == true, "NFT not supported at the moment.");
        P2PLoan p2ploanContract = new P2PLoan(_NFTAddress, msg.sender);
        loanFactory[msg.sender].loanee = msg.sender;
        loanFactory[msg.sender].p2ploans.push(p2ploanContract);
        loanFactory[msg.sender].p2ploanIndexFromCA[p2ploanContract] = loanFactory[msg.sender].p2ploans.length -1;
        loanFactory[msg.sender].interestUpdated = InterestUpdated.INTEREST_VALUE_PERIOD_NOT_CALLED;
        loaneeList.push(msg.sender);
        emit LoanContract(p2ploanContract, loanFactory[msg.sender].p2ploanIndexFromCA[p2ploanContract]);
    }


    function getLoanContract(uint256 _index, address _loanee) public view returns (P2PLoan) {
        P2PLoan p2pLoanContract = P2PLoan(address(loanFactory[_loanee].p2ploans[_index]));

        return p2pLoanContract;
    }

    function listOfP2PLoans(address _loanee) public view returns(P2PLoan[] memory){
        return loanFactory[_loanee].p2ploans;
    }


    function LFCreateLoan(uint256 _index,
    uint256 _loanAmountInWEi,
    uint256 _durationOfLoan, 
    uint256 _interestInWEI, 
    uint256 _tokenID
    ) public {
        P2PLoan p2pLoanContract = getLoanContract(_index, msg.sender);
        loanDetail[msg.sender][p2pLoanContract].LFBorrower = msg.sender;
        loanDetail[msg.sender][p2pLoanContract].LFLoanAmountInWEi = _loanAmountInWEi;
        loanDetail[msg.sender][p2pLoanContract].LFDurationOfLoan = _durationOfLoan * 1 minutes;
        loanDetail[msg.sender][p2pLoanContract].LFInterestInWEI = _interestInWEI;
        p2pLoanContract.createLoan(_loanAmountInWEi, _durationOfLoan, _interestInWEI, _tokenID, msg.sender, address(p2pLoanContract),msg.sender);
        emit LoanCreated('Loan created');
    }


    function LFLoanDetail(uint256 _index, address _loanee) public view returns(LoanDetails memory) {
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        return loanDetail[_loanee][p2pLoanContract];
    }


    function LFUpdateLoanDetail(uint256 _index, 
    address _loanee, 
    uint256 _updateDurationOfLoan, 
    uint256 _updateInterestInWEI, 
    uint256 _updateLoanAmount
    ) public {
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        loanDetail[_loanee][p2pLoanContract].LFDurationOfLoan = _updateDurationOfLoan;
        loanDetail[_loanee][p2pLoanContract].LFInterestInWEI = _updateInterestInWEI;
        loanDetail[_loanee][p2pLoanContract].LFLoanAmountInWEi = _updateLoanAmount;
        p2pLoanContract.updateLoanDetail(_updateDurationOfLoan, _updateInterestInWEI, _updateLoanAmount);

        emit UpdatedLoanDetails("Loan details updated");
    }


    function LFCancelLoan(uint256 _index, address _loanee) public{
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        p2pLoanContract.cancelLoan(address(p2pLoanContract), msg.sender);
        emit LoanCanceled('Loan canceled');
    }


    function LFFundLoan(uint256 _index, address _loanee) public payable {
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        require(msg.value == loanDetail[_loanee][p2pLoanContract].LFLoanAmountInWEi, "");
        p2pLoanContract.fundBorrower(msg.sender, msg.value);
        payable(_loanee).transfer(msg.value);   
        loanDetail[_loanee][p2pLoanContract].LFLoaner = msg.sender;
        emit LoanFunded('Loan funded');
    }


    function LFPayLoan(uint256 _index, address _loanee) public payable {
        if (block.timestamp > call_window ){
            loanFactory[msg.sender].interestUpdated = InterestUpdated.INTEREST_VALUE_PERIOD_NOT_CALLED;
        }
        require(loanFactory[_loanee].interestUpdated == InterestUpdated.INTEREST_VALUE_PERIOD_CALLED, "State Not Changed.");
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        require(msg.value == loanDetail[_loanee][p2pLoanContract].LFLoanAmountInWEi+loanDetail[_loanee][p2pLoanContract].validInterestNow, "value must be equal to loanAmount + interest");
        p2pLoanContract.payLoan(address(p2pLoanContract), msg.sender);
        payable(loanDetail[_loanee][p2pLoanContract].LFLoaner).transfer(msg.value);
        emit LoanPayed('Loan payed');
    }


    function interest(uint256 _index, address _loanee) public view returns(uint256, uint256){
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        (uint256 x, uint256 y)=p2pLoanContract.getInterest();
        return (x, y);
    }


    function interestValidPeriod(uint256 _index, address _loanee) public {
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        (uint256 x, uint256 y) = interest(_index, _loanee);
        if (block.timestamp <= y) {
            loanDetail[_loanee][p2pLoanContract].validInterestNow = x;
        }else{
            (uint256 xNow,) = interest(_index, _loanee);
            loanDetail[_loanee][p2pLoanContract].validInterestNow = xNow;
        }
        loanFactory[msg.sender].interestUpdated = InterestUpdated.INTEREST_VALUE_PERIOD_CALLED;
        call_window = block.timestamp + 1 minutes;

        emit ValidInterestNow(loanDetail[_loanee][p2pLoanContract].validInterestNow);
    }
    

    function getInterestInValidPeriod(uint256 _index, address _loanee) public view returns(uint256){
        require(loanFactory[msg.sender].interestUpdated == InterestUpdated.INTEREST_VALUE_PERIOD_CALLED, "");
        P2PLoan p2pLoanContract = getLoanContract(_index, _loanee);
        return (loanDetail[_loanee][p2pLoanContract].validInterestNow);
    }


    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }


    function updateAcceptableNFTs(address _NFTAddress) public onlyOwner {
        acceptableNFTs[_NFTAddress] = true;
    }

    function removeNFT(address _removeNFT) public onlyOwner returns(address, string memory){
        //uint256 index = acceptableNFTsIndex[_removeNFT];
        delete acceptableNFTs[_removeNFT];

        return(_removeNFT, "Removed");
    }


}