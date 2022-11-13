export const VERIFIED_NFTS = [
  '0x7b2ca44102a2899e97dded0dd17370962996e193',
  '0x46ee8a0193f4973b5f5936e1db54bf6821873746', 
  '0x1bd20f16f27F3F063D321A05704C6fE6C8f127CD'
]

export const LOAN_CONTRACT_FACTORY_ADDRESS = '0x1219d8582fA04176227cD450aD8D42b04F7a2622'

export const LOAN_CONTRACT_FACTORY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "loanCanceled",
        "type": "string"
      }
    ],
    "name": "LoanCanceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "contract P2PLoan",
        "name": "_p2ploan",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "LoanContract",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "loanCreated",
        "type": "string"
      }
    ],
    "name": "LoanCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "loanFunded",
        "type": "string"
      }
    ],
    "name": "LoanFunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "loanPayed",
        "type": "string"
      }
    ],
    "name": "LoanPayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "loanDetsUpdated",
        "type": "string"
      }
    ],
    "name": "UpdatedLoanDetails",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "validInterestNow",
        "type": "uint256"
      }
    ],
    "name": "ValidInterestNow",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "LFCancelLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_loanAmountInWEi",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationOfLoan",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_interestInWEI",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tokenID",
        "type": "uint256"
      }
    ],
    "name": "LFCreateLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "LFFundLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "LFLoanDetail",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "LFBorrower",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "LFLoaner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "LFLoanAmountInWEi",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "LFDurationOfLoan",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "LFInterestInWEI",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "validInterestNow",
            "type": "uint256"
          }
        ],
        "internalType": "struct P2PLoanFactory.LoanDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "LFPayLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_updateDurationOfLoan",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_updateInterestInWEI",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_updateLoanAmount",
        "type": "uint256"
      }
    ],
    "name": "LFUpdateLoanDetail",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "call_window",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_NFTAddress",
        "type": "address"
      }
    ],
    "name": "createP2PLoanContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "getInterestInValidPeriod",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "getLoanContract",
    "outputs": [
      {
        "internalType": "contract P2PLoan",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "interest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "interestValidPeriod",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_loanee",
        "type": "address"
      }
    ],
    "name": "listOfP2PLoans",
    "outputs": [
      {
        "internalType": "contract P2PLoan[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "loanFactory",
    "outputs": [
      {
        "internalType": "address",
        "name": "loanee",
        "type": "address"
      },
      {
        "internalType": "enum P2PLoanFactory.InterestUpdated",
        "name": "interestUpdated",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "loaneeList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_removeNFT",
        "type": "address"
      }
    ],
    "name": "removeNFT",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_NFTAddress",
        "type": "address"
      }
    ],
    "name": "updateAcceptableNFTs",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]