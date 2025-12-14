// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleLottery {
    address public owner;
    address[] public players;
    uint256 public ticketPrice;
    address public lastWinner;

    uint256 public min_players = 3;      // added minimum players required
    uint256 public max_players = 5;      // added maximum players allowed
    
    uint256 public ownerFeePercent;      // added owner fee percentage

    event TicketBought(address indexed player);
    event WinnerPicked(address indexed winner, uint256 amountWon);

    //added owner fee parameter
    constructor(uint256 _ticketPrice, uint256 _ownerFeePercent) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        ownerFeePercent = _ownerFeePercent;
    }

    // ---------------- BUY TICKET ----------------
    function buyTicket() external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");

        //if the number of players becomes equal to the max_players then more players will not be able to join
        require(players.length < max_players, "Lottery is full!");

        players.push(msg.sender);
        emit TicketBought(msg.sender);
    }

    // ---------------- PICK WINNER ----------------
    function pickWinner() external {
        require(msg.sender == owner, "Only owner can pick winner");

        //owner will not be able to pick a winner if the number of players are less than min_players
        require(players.length >= min_players, "Not enough players");

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, players, block.prevrandao)
            )
        );

        uint256 winnerIndex = randomNumber % players.length;
        address payable winner = payable(players[winnerIndex]);

        uint256 totalBalance = address(this).balance;

        // calculate owner fee
        uint256 ownerFee = (totalBalance * ownerFeePercent) / 100;
        uint256 winnerAmount = totalBalance - ownerFee;

        // pay owner fee
        if (ownerFee > 0) {
            payable(owner).transfer(ownerFee);
        }

        // pay winner
        winner.transfer(winnerAmount);

        lastWinner = winner;
        emit WinnerPicked(winner, winnerAmount);

        // reset lottery
        delete players;
    }

    // ---------------- VIEW FUNCTIONS ----------------
    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}