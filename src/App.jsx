import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contractConfig";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [ticketPrice, setTicketPrice] = useState("");
  const [status, setStatus] = useState("");

  const [balance, setBalance] = useState("0");
  const [players, setPlayers] = useState([]);
  const [lastWinner, setLastWinner] = useState("None");

  const [ownerFeePercent, setOwnerFeePercent] = useState("0");
  const [minPlayers, setMinPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [contractTicketPrice, setContractTicketPrice] = useState("0");

  // ---------------- CONNECT WALLET ----------------
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not installed!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);

      const lotteryContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      setContract(lotteryContract);
      setStatus("Wallet connected.");
    } catch (error) {
      console.error(error);
      setStatus("Error connecting wallet.");
    }
  };

  // ---------------- BUY TICKET ----------------
  const buyTicket = async () => {
    if (!contract) return alert("Connect wallet first!");

    try {
      const tx = await contract.buyTicket({
        value: ethers.parseEther(ticketPrice),
      });

      await tx.wait();
      setStatus("Ticket purchased successfully!");
      loadInfo();
    } catch (error) {
      console.error(error);

      if (error.info?.error?.message?.includes("Lottery is full")) {
        setStatus("Lottery is full! Maximum players reached.");
      } else {
        setStatus("Error buying ticket.");
      }
    }
  };

  // ---------------- PICK WINNER ----------------
  const pickWinner = async () => {
    if (!contract) return alert("Connect wallet first!");

    try {
      const tx = await contract.pickWinner();
      await tx.wait();
      setStatus("Winner selected!");
      loadInfo();
    } catch (error) {
      console.error(error);

      if (error.info?.error?.message?.includes("Not enough players")) {
        setStatus(`Need at least ${minPlayers} players to pick winner.`);
      } else {
        setStatus("Error picking winner.");
      }
    }
  };

  // ---------------- LOAD INFO FROM CONTRACT ----------------
  const loadInfo = async () => {
    if (!contract) return;

    try {
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));

      const p = await contract.getPlayers();
      setPlayers(p);

      const w = await contract.lastWinner();
      setLastWinner(
        w === "0x0000000000000000000000000000000000000000"
          ? "None"
          : w
      );

      const minP = await contract.min_players();
      setMinPlayers(Number(minP));

      const maxP = await contract.max_players();
      setMaxPlayers(Number(maxP));

      const price = await contract.ticketPrice();
      setContractTicketPrice(ethers.formatEther(price));

      if (contract.ownerFeePercent) {
        const fee = await contract.ownerFeePercent();
        setOwnerFeePercent(fee.toString());
      }
    } catch (error) {
      console.error(error);
      setStatus("Error loading contract info.");
    }
  };

  useEffect(() => {
    if (contract) loadInfo();
  }, [contract]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", fontFamily: "Arial" }}>
      <h1>🎉 Lottery DApp</h1>
      <p>Buy a ticket → Admin picks winner → Winner gets entire pool</p>

      <button onClick={connectWallet}>Connect Wallet</button>
      <p><strong>Connected:</strong> {account || "Not connected"}</p>

      <hr />

      <h2>Buy Ticket</h2>
      <p><strong>Contract Ticket Price:</strong> {contractTicketPrice} ETH</p>

      <input
        type="text"
        placeholder="Ticket price in ETH"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(e.target.value)}
      />
      <button onClick={buyTicket} className="buy-ticket-btn">
        Buy Ticket
      </button>

      <hr />

      <h2>Pick Winner (Owner Only)</h2>
      <button onClick={pickWinner}>Pick Winner</button>

      <hr />

      <h2>Lottery Info</h2>
      <button onClick={loadInfo}>Refresh Info</button>

      <p><strong>Contract Balance:</strong> {balance} ETH</p>
      <p><strong>Minimum Players:</strong> {minPlayers}</p>
      <p><strong>Maximum Players:</strong> {maxPlayers}</p>
      <p><strong>Current Players:</strong> {players.length}</p>
      <p><strong>Slots Left:</strong> {maxPlayers - players.length}</p>
      <p><strong>Owner Fee:</strong> {ownerFeePercent}%</p>

      <p><strong>Players:</strong></p>
      <ul>
        {players.length === 0
          ? <li>No players yet.</li>
          : players.map((p, i) => <li key={i}>{p}</li>)
        }
      </ul>

      <p><strong>Last Winner:</strong> {lastWinner}</p>

      <hr />
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}

export default App;