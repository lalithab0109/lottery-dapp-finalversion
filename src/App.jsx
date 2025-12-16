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
  const getProgressColor = (current, max) => {
    if (!max || max === 0) return "#22c55e"; // green default

    const ratio = current / max;

    if (ratio < 0.5) return "#22c55e";   // green
    if (ratio < 0.8) return "#facc15";   // yellow
    return "#ef4444";                    // red
  };

  return (
    <div className="app-bg">
      <nav className="navbar">
        <div className="title-section">
          <h1>🎲 Lottery dApp</h1>
          <p className="subtitle">
            Buy a ticket → Admin picks winner → Winner gets entire pool
          </p>
        </div>

        <div className="wallet-section">
          <button className="wallet-btn" onClick={connectWallet}>
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </button>

          <p className={`wallet-status ${account ? "connected" : "disconnected"}`}>
            {account ? "🟢 Connected" : "🔴 Not Connected"}
          </p>
        </div>
      </nav>



      <main className="container">
        <div className="card">
          <h2>Buy Ticket</h2>
          <p className="muted">Ticket Price: {contractTicketPrice} ETH</p>

          <div className="row">
            <input
              type="text"
              placeholder="ETH amount"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
            />
            <button className="primary-btn" onClick={buyTicket}>
              Buy
            </button>
          </div>
        </div>

        <div className="card">
          <div className="lottery-header">
            <h2>Lottery Info</h2>
            <button className="secondary-btn" onClick={loadInfo}>
              Refresh Info
            </button>
          </div>


          <div className="info-grid">
            <div className="info-box">
              <span>Contract Balance</span>
              <b>{balance} ETH</b>
            </div>

            <div className="info-box">
              <span>Minimum Players</span>
              <b>{minPlayers}</b>
            </div>

            <div className="info-box">
              <span>Maximum Players</span>
              <b>{maxPlayers}</b>
            </div>

            <div className="info-box">
              <span>Current Players</span>
              <b>{players.length}</b>
            </div>

            <div className="info-box highlight">
              <span>Slots Left</span>
              <b>{maxPlayers - players.length}</b>
            </div>

            <div className="info-box">
              <span>Owner Fee</span>
              <b>{ownerFeePercent}%</b>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-text">
              Players Joined: {players.length} / {maxPlayers}
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: maxPlayers
                    ? `${(players.length / maxPlayers) * 100}%`
                    : "0%",
                  background: getProgressColor(players.length, maxPlayers),
                }}
              />

            </div>
          </div>

          <div className="players-box">
            <span className="section-title">Players</span>
            {players.length === 0 ? (
              <p className="muted">No players yet.</p>
            ) : (
              <ul>
                {players.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="winner-box">
            <span>Last Winner</span>
            <b>{lastWinner}</b>
          </div>
        </div>



        <div className="card">
          <h2>Admin</h2>
          <button className="danger-btn" onClick={pickWinner}>
            Pick Winner
          </button>
        </div>

        <p className="status">{status}</p>
      </main>
    </div>
  );

}

export default App;