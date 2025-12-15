# Decentralized Lottery DApp

A fully decentralized lottery application built on Ethereum. It includes a Solidity smart contract deployed on the Sepolia testnet and a frontend built with React, HTML, CSS and JavaScript using ethers.js. Users can connect their MetaMask wallet, buy lottery tickets, and the contract owner draws a winner, and the owner automatically receives the owner fee for conducting the lottery and the remaining prize pool is automatically transfered to the winner— all enforced by immutable smart contract logic.

---

## Project Objective

The objective of this project is to demonstrate how blockchain technology can be used to create a **transparent, trustless, and tamper-proof lottery system** without relying on centralized authorities.

### Key Goals

- Allow users to buy lottery tickets using **ETH**
- Enable the **contract owner** to pick a winner
- Automatically transfer the **owner fee ETH** to the owner and **remaining accumalated ETH** to winner
- Ensure all logic is **on-chain, verifiable, and transparent**

---

## Core Features

- Fully decentralized lottery logic using Solidity
- MetaMask wallet integration
- ETH-based ticket purchasing
- Owner-restricted winner selection
- Automatic prize distribution
  -owner recieves owner fee for conducting lottery
  -winner recieves recieves remaining prize pool
- Live contract data display (players, balance, last winner)
- Deployed on **Sepolia Testnet**

---

## Technology Stack

- **Solidity** – Smart contract development
- **React (Vite)** – Frontend framework
- **ethers.js** – Blockchain interaction
- **MetaMask** – Wallet integration
- **Ethereum Sepolia Testnet**

---

## Prerequisites

Before running the project, the following was ensured:

- Node.js and npm installed
- MetaMask browser extension
- Sepolia testnet ETH for testing

---

## Smart Contract Deployment

1. The lottery smart contract logic was written in **Solidity** using the Remix IDE.
2. The contract was compiled using **Solidity version 0.8.20**.
3. After successful compilation, the contract was deployed to the **Sepolia Testnet** using Remix and MetaMask.
   - In the **Deploy** tab, the ticket price (fixed by the owner) and the owner fee percentage were entered as constructor parameters, after which the **Deploy** option was selected.
   - This redirected to the MetaMask wallet, where the transaction was confirmed to ensure it was processed.
   - After the transaction was completed, the contract was successfully deployed on the Sepolia Testnet. This confirmation was visible in the Remix terminal, and the transaction could also be verified on **Etherscan** using the “View on Etherscan” option.
4. The deployed **contract address** and **ABI** were then copied for frontend integration.

The smart contract handles:

- Ticket purchases
- Player storage
- Owner validation
- Winner selection
- ETH transfer to the winner

---

## Additional featres

1. Solidity features:
   - owner fee percent
   - minimum players required for owner to pick winner
   - maximum number of players who can join the game
2. JavaScript/UX features:
   - display of ticket price(from the smart contract)
   - display of minimum and maximum number of players
   - display of players count and number of slots left in the game
   - display of owner fee
3. UI Enhancement

---

## Frontend Setup & Deployment

A react application was created using **Vite** and the neccessary dependencies were installed including `ethers.js`.After this the contract address and ABI were integrated with the frontend and the wallet connection and contract intercation logic was implemented.To start the application we used the **npm run dev** command in the terminal and the dapp could be viewed through local development server.

---

## How the Application Works

1. Users connect their **MetaMask wallet** to the application.
2. Users purchase lottery tickets using **ETH**.
   - players can purchase tickets only if the current player count is less than the maximum number of players allowed to join the game(5).
3. The ETH is **securely stored in the smart contract** on the blockchain.
4. Once the required conditions are met, the **contract owner selects a winner**.
   - the contract owner can select a winner only the player count is greater than the minimum players required(3).
5. The smart contract **automatically transfers the contract balance-(contract balance\*owner fee percent)** to the selected winner.
   and the owner recieves **contract balance\*owner fee percent** automatically.

---

## Outcome & Impact

This project demonstrates the effectiveness of **blockchain technology** in building **fair, transparent, and trustless decentralized applications**.  
By eliminating intermediaries and enforcing rules through immutable smart contracts, the lottery system ensures **integrity, immutability, and user trust**, making the process secure and verifiable for all participants.

---

## Team

    -Kushwanth
    -Santosh
    -Medhavi
    -Lalitha

---
