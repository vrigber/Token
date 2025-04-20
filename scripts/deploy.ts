import { ethers } from "hardhat";
import { stdin, stdout } from "process";
import readline from "readline/promises";

const _100_ING: bigint = 100n * 10n ** 10n;

async function main() {
  const tokenFactory = await ethers.getContractFactory("Token");
  const tx = await tokenFactory.getDeployTransaction(_100_ING);
  const [signer] = await ethers.getSigners();

  const nonce = await ethers.provider.getTransactionCount(signer.address);
  const contractAddress = ethers.getCreateAddress({from: signer.address, nonce: nonce}) 
  console.log("Contract address will be:", contractAddress, "\n");

  const estimatedGas = await signer.estimateGas(tx);
  console.log("Estimated gas for Token deployment:", estimatedGas.toString());


  const feeData = await ethers.provider.getFeeData();
  if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
    throw new Error("maxFeePerGas or maxPriorityFeePerGas is not available in the fee data.");
  }

  var feePeerGas: bigint = feeData.maxFeePerGas;
  var priorityFeePerGas: bigint = feeData.maxPriorityFeePerGas;

  console.log("Recommended tip per gas:", ethers.formatUnits(priorityFeePerGas, "gwei"), "gwei");
  console.log("Total gas price:", ethers.formatUnits(feePeerGas, "gwei"), "gwei");

  var cost = ethers.formatEther(feePeerGas * estimatedGas);
  console.log("Estimated total cost:", cost, "ETH\n");

  const rl = readline.createInterface({ input: stdin, output: stdout });
  var answer = await rl.question("Please enter your desired tip, or press Enter to use the recommended amount: ");

  console.log();

  if (answer !== "") {
    let newPriorityFeePerGas = ethers.parseUnits(answer, "gwei");
    feePeerGas = feePeerGas + newPriorityFeePerGas - priorityFeePerGas;
    priorityFeePerGas = newPriorityFeePerGas;
    console.log("New tip per gas:", ethers.formatUnits(priorityFeePerGas, "gwei"), "gwei");
    console.log("Total gas price:", ethers.formatUnits(feePeerGas, "gwei"), "gwei");
    cost = ethers.formatEther(feePeerGas * estimatedGas);
    console.log("Estimated total cost:", cost, "ETH\n");
  }
  answer = await rl.question("Do you want to deploy the contract? (Y/n): ");
  if (answer.toLowerCase() === "n") {
    console.log("Deployment cancelled.");
    return;
  }
  console.log("Deploying contract...\n");
  const txResponse = await signer.sendTransaction({
    ...tx,
    gasLimit: estimatedGas,
    maxFeePerGas: feePeerGas,
    maxPriorityFeePerGas: priorityFeePerGas,
  });
  console.log("Transaction hash:", txResponse.hash);
  console.log("Waiting for transaction confirmation...\n");
  const receipt = await txResponse.wait();
  if (!receipt || receipt.status !== 1) {
    console.error("Transaction failed:", receipt);
    return;
  }
  console.log("Contract deployed at address:", receipt.contractAddress, "\n");

  if (!receipt.gasUsed || !receipt.gasPrice) {
    console.error("Gas used or gas used is not available in the receipt.");
  }
  else {
    cost = ethers.formatEther(receipt.gasUsed * receipt.gasPrice);
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("GasPrice:", ethers.formatUnits(receipt.gasPrice, "gwei"), "gwei");
    console.log("Total cost:", cost, "ETH\n");
  }

  console.log("Deployment successful!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});