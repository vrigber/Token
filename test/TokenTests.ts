import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseUnits } from "viem";

async function deployTokenFixture() {
  const [owner, other, spender, recipient, burner] = await hre.viem.getWalletClients();
  const initialSupply = parseUnits("1000", 18);
  const token = await hre.viem.deployContract("Token", [initialSupply]);
  const publicClient = await hre.viem.getPublicClient();
  return { token, owner, other, spender, recipient, burner, publicClient };
}

describe("Token (ERC20)", function () {
  describe("Deployment", function () {
    it("assigns initial supply to deployer", async () => {
      const { token, owner, publicClient } = await loadFixture(deployTokenFixture);
      const balance = await token.read.balanceOf([owner.account.address]);
      const total = await token.read.totalSupply();
      expect(balance).to.equal(total);
      expect(balance).to.equal(parseUnits("1000", 18));
    });
  });

  describe("Transfers", function () {
    it("emits Transfer and updates balances on success (viem)", async () => {
      const { token, owner, other, publicClient } = await loadFixture(deployTokenFixture);
      const amount = parseUnits("250", 18);
      const hash = await token.write.transfer([other.account.address, amount]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const events = await token.getEvents.Transfer({}, {
        fromBlock: receipt.blockNumber,
        toBlock:   receipt.blockNumber,
      });
      expect(events).to.have.length(1);
      const { from, to, value } = events[0].args;
      expect(from).to.equal(getAddress(owner.account.address));
      expect(to).to.equal(getAddress(other.account.address));
      expect(value).to.equal(amount);
      const balOwner = await token.read.balanceOf([owner.account.address]);
      const balOther = await token.read.balanceOf([other.account.address]);
      expect(balOwner).to.equal(parseUnits("750", 18));
      expect(balOther).to.equal(amount);
    });

    it("reverts when sender has insufficient balance", async () => {
      const { token, other } = await loadFixture(deployTokenFixture);
      const amount = parseUnits("1", 18);
      const tokenAsOther = await hre.viem.getContractAt(
        "Token",
        token.address,
        { client: { wallet: other } }
      );
      await expect(tokenAsOther.write.transfer([token.address, amount])).to.be.rejectedWith();
    });
  });

  describe("Allowance & Approval", function () {
    it("emits Approval and sets allowance", async () => {
      const { token, owner, spender, publicClient } = await loadFixture(deployTokenFixture);
      const amount = parseUnits("500", 18);
      const hash = await token.write.approve([spender.account.address, amount]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const events = await token.getEvents.Approval({}, {
        fromBlock: receipt.blockNumber,
        toBlock:   receipt.blockNumber,
      });
      expect(events).to.have.length(1);
      const { owner: evOwner, spender: evSpender, value } = events[0].args;
      expect(evOwner).to.equal(getAddress(owner.account.address));
      expect(evSpender).to.equal(getAddress(spender.account.address));
      expect(value).to.equal(amount);
      const allowance = await token.read.allowance([owner.account.address, spender.account.address]);
      expect(allowance).to.equal(amount);
    });

    it("increaseAllowance and decreaseAllowance work", async () => {
      const { token, owner, spender, publicClient } = await loadFixture(deployTokenFixture);
      const inc = parseUnits("100", 18);
      let hash = await token.write.increaseAllowance([spender.account.address, inc]);
      let receipt = await publicClient.waitForTransactionReceipt({ hash });
      let evs = await token.getEvents.Approval({}, { fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
      expect(evs[0].args.value).to.equal(inc);
      const dec = parseUnits("50", 18);
      hash = await token.write.decreaseAllowance([spender.account.address, dec]);
      receipt = await publicClient.waitForTransactionReceipt({ hash });
      evs = await token.getEvents.Approval({}, { fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
      expect(evs[0].args.value).to.equal(parseUnits("50", 18));
    });

    it("reverts decreaseAllowance below zero", async () => {
      const { token, owner, spender } = await loadFixture(deployTokenFixture);
      await expect(
        token.write.decreaseAllowance([spender.account.address, parseUnits("1", 18)])
      ).to.be.rejectedWith();
    });
  });

  describe("transferFrom", function () {
    it("allows spender to transfer up to allowance", async () => {
      const { token, owner, spender, other, publicClient } = await loadFixture(deployTokenFixture);
      const allowance = parseUnits("200", 18);
      let hash = await token.write.approve([spender.account.address, allowance]);
      await publicClient.waitForTransactionReceipt({ hash });
      const transferred = parseUnits("100", 18);
      const tokenAsSpender = await hre.viem.getContractAt(
        "Token",
        token.address,
        { client: { wallet: spender } }
      );
      hash = await tokenAsSpender.write.transferFrom([owner.account.address, other.account.address, transferred]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const evs = await token.getEvents.Transfer({}, { fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
      expect(evs[0].args.value).to.equal(transferred);
    });

    it("reverts when over allowance or balance", async () => {
      const { token, owner, spender, other } = await loadFixture(deployTokenFixture);
      const tokenAsSpender = await hre.viem.getContractAt(
        "Token",
        token.address,
        { client: { wallet: spender } }
      );
      await expect(
        tokenAsSpender.write.transferFrom([owner.account.address, other.account.address, parseUnits("1", 18)])
      ).to.be.rejectedWith();
    });
  });

  describe("Ownable", function () {
    it("sets deployer as owner", async () => {
      const { token, owner } = await loadFixture(deployTokenFixture);
      expect(await token.read.owner()).to.equal(getAddress(owner.account.address));
    });

    it("reverts when non-owner calls transferOwnership", async () => {
      const { token, other } = await loadFixture(deployTokenFixture);
      const tokenAsOther = await hre.viem.getContractAt(
        "Token",
        token.address,
        { client: { wallet: other } }
      );
      await expect(
        tokenAsOther.write.transferOwnership([other.account.address])
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });

    it("allows owner to transferOwnership and emits event", async () => {
      const { token, owner, other, publicClient } = await loadFixture(deployTokenFixture);
      const hash = await token.write.transferOwnership([other.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const evs = await token.getEvents.OwnershipTransferred({}, { fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
      expect(evs[0].args.previousOwner).to.equal(getAddress(owner.account.address));
      expect(evs[0].args.newOwner).to.equal(getAddress(other.account.address));
      expect(await token.read.owner()).to.equal(getAddress(other.account.address));
    });

    it("old owner no longer can transferOwnership", async () => {
      const { token, owner, other, publicClient } = await loadFixture(deployTokenFixture);
      const hash = await token.write.transferOwnership([other.account.address]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      await expect(
        token.write.transferOwnership([owner.account.address])
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });

  describe("Mintable", function () {
    it("mints tokens and emits Transfer(from=0)", async () => {
      const { token, owner, recipient, publicClient } = await loadFixture(deployTokenFixture);
      const amount = parseUnits("1000", 18);
      const hash = await token.write.mint([recipient.account.address, amount]);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const evs = await token.getEvents.Transfer({}, { fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
      expect(evs[0].args.from).to.equal("0x0000000000000000000000000000000000000000");
      expect(evs[0].args.to).to.equal(getAddress(recipient.account.address));
      expect(evs[0].args.value).to.equal(amount);
      expect(await token.read.balanceOf([recipient.account.address])).to.equal(amount);
    });

    it("reverts mint when called by non-owner", async () => {
      const { token, other, recipient } = await loadFixture(deployTokenFixture);
      const tokenAsOther = await hre.viem.getContractAt(
        "Token",
        token.address,
        { client: { wallet: other } }
      );
      await expect(
        tokenAsOther.write.mint([recipient.account.address, parseUnits("1", 18)])
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });
});
