import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.1.esm.min.js";

const connectButton = document.getElementById("connect");
const fundButton = document.getElementById("fund");
const withdrawButton = document.getElementById("withdraw");
const balanceButton = document.getElementById("balance");

connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
balanceButton.onclick = balance;

async function connect() {
  console.log("connect");
  await ethereum.request({ method: "eth_requestAccounts" });
  
  connectButton.innerHTML = "connected!";
}
async function fund() {
  let ethAmount = document.getElementById("ethAmount").value;
  console.log("ethAmount entered:", ethAmount);
  if (!ethAmount) {
    console.log("enter amount to continue");
    return;
  }
  const ethAmountToFund = ethers.parseEther(ethAmount);
  console.log("fund", ethAmountToFund);
  const provider = new ethers.BrowserProvider(window.ethereum);

  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    let transactionResponse = await contract.fund({ value: ethAmountToFund });
    await listenForTransactionMine(transactionResponse, provider);
    console.log("Funding Done");
  } catch (e) {
    console.log("🚀 ~ fund ~ e:", e);
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`minging ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (receipt) => {
      console.log("transaction receipt:", receipt);
      resolve(receipt);
    });
  });
}

async function balance() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(contractAddress);
  console.log("Balance:", ethers.formatEther(balance));
}
async function withdraw() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const transactionResponse = await contract.withdraw();
  await listenForTransactionMine(transactionResponse, provider);
  console.log("Withdrawal Done");
}
async function getAddressToAmountFunded() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const transactionResponse = await contract.getAddressToAmountFunded("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
//   await listenForTransactionMine(transactionResponse, provider);
  console.log("Withdrawal Done",ethers.formatEther(transactionResponse));
}
