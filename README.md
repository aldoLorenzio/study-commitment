# 📚 StudyCommitment

> No doom scrolling. No procrastinating. Except if you want your money gone. 😄

A blockchain-based study accountability app where you stake real ETH before a study session for commitment. Finish on time and get it back or give up and it goes to charity

---

## 🧠 The Problem

I built this because I kept doom scrolling and gaming in the middle of study sessions. I wanted something that would actually force me to commit — not just a timer app I could close, but real financial consequences I couldn't escape.

The original idea was a study competition where multiple students stake ETH on the same subject and the fastest finisher wins everyone's stake. That was too complex for the time I had and my currently skill, so I built the simpler but still very real version: just you vs your own laziness.

---

## ⛓️ Why Blockchain?

A Web2 app could do something similar, but you'd have to trust the platform with your money. The platform could shut down, get hacked and many else web 2 cons that is really hassle.

With a smart contract:
- No company holds your money — the **code does**
- No one can change the rules mid-game
- ETH is locked and released automatically based on conditions
- Anyone can verify the logic by reading the contract

Security and trustless. That's the point

---

## 🔄 How It Works

```
1. Student calls createSession(duration) + stakes ETH
   → ETH is locked in the contract
   → Session timer starts

2a. Student completes session before deadline
    → calls completeSession()
    → ETH is returned to student ✅

2b. Student fails (deadline passes)
    → anyone can call failSession()
    → ETH is sent to charity ❌
```

---

## 📋 Contract Details

| | |
|---|---|
| **Network** | Ethereum Sepolia Testnet |
| **Contract Address** | `0xc8F65750F0Ef229c4b069361E3d8726963436Fd0` |
| **Blockscout Explorer** | [View Contract](https://eth-sepolia.blockscout.com/address/0xc8F65750F0Ef229c4b069361E3d8726963436Fd0) |
| **Write/Read Functions** | [Interact Here](https://eth-sepolia.blockscout.com/address/0xc8F65750F0Ef229c4b069361E3d8726963436Fd0#writeContract) |

---

## 🛠️ Tech Stack

- **Solidity** `^0.8.30` — smart contract
- **Hardhat 3** — development environment
- **Viem** — blockchain interaction in tests
- **TypeScript** — test files
- **Sepolia Testnet** — deployment network

---

## 🚀 Run Locally

**Install dependencies:**
```bash
npm install
```
**Set .env**
```
PRIVATE_KEY=Your_Own_WalletPrivateKey
ETHERSCAN_API_KEY=Your_etherscan_apikey
```

**Compile contract:**
```bash
npx hardhat compile
```

**Run tests:**
```bash
npx hardhat test
```

**Set modules for setting charityWallets**
Make file StudyCommitment.ts in ignition/modules
```ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StudyCommitmentModule = buildModule("StudyCommitmentModule", (m) =>{
    const charityAddress = m.getParameter(
        "charityAddress",
        "CharitWallet here" //wallet metamask untuk charity
    );

    const studyCommitment = m.contract("StudyCommitment", [charityAddress]);
    return { studyCommitment };
})

export default StudyCommitmentModule;
```

**Deploy to Sepolia:**
```bash
npx hardhat ignition deploy ./ignition/modules/StudyCommitment.ts --network sepolia
```

---

## ✅ Tests

8 tests covering both happy and sad paths:

| Test | Type |
|---|---|
| Create session with ETH | ✅ Happy path |
| Reject session with 0 ETH | ❌ Sad path |
| Reject non-creator completing session | ❌ Sad path |
| Return ETH to student on completion | ✅ Happy path |
| Send ETH to charity when random person triggers fail | ✅ Happy path |
| Send ETH to charity when deployer triggers fail | ✅ Happy path |
| Reject completeSession after deadline | ❌ Sad path |
| Reject failSession before deadline | ❌ Sad path |

---

## 🔮 Future Improvements

- **Chainlink Automation** — automatically trigger `failSession()` when deadline passes, no manual call needed
- **Frontend** — simple UI to create sessions, track countdowns, and show session history
- **Study Competition Mode** — multiple students stake on the same subject, fastest finisher wins the pool (the original idea!)
- **Real session validation** - currently students self-report completion by calling `completeSession()` themselves, which relies on honestly. Future version could integrate:
    - A verifier who must confirm the session
    - Proof of activity or app usage data
- **Leaderboard** — on-chain record of completed sessions as proof of consistency

---