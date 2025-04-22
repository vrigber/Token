# Environment Setup & Deployment Guide

This guide walks you through initializing your project, deploying the ERC‑20 contract, and running the server.

---

## 1. Prepare the Environment

1. **Install dependencies**  
   In your project root, run:  
   ```bash
   npm install
   ```

2. **Configure environment variables**  
   Create a `.env` file (or set variables in your system) with:
   ```bash
   PRIVATE_KEY=<YOUR_TEST_WALLET_PRIVATE_KEY>
   RPC_URL=https://your-rpc-endpoint.example
   CHAIN_NAME=sepolia
   ```
   > **Warning**: Do _not_ use a private key holding real funds. This setup is for demonstration only. Use secure vaults or CI/CD secrets for real deployments.

3. **Adjust Hardhat config (optional)**
   In `hardhat.config.ts`, ensure your networks block matches your environment:
   ```ts
   import { HardhatUserConfig } from 'hardhat/config';
   import './tasks';

   const config: HardhatUserConfig = {
     networks: {
       hardhat: {
         accounts: [...customAccounts, ...defaultAccounts],
       },
       sepolia: {
         url: process.env.RPC_URL || '',
         accounts: [process.env.PRIVATE_KEY as string],
       },
     },
     solidity: '0.8.18',
   };

   export default config;
   ```
   For full options, see the [Hardhat configuration docs](https://hardhat.org/hardhat-runner/docs/config).

---

## 2. Deploy the Smart Contract

Execute in project root:
```bash
npx hardhat run scripts/deploy.ts
```
Follow interactive console prompts. You can override gas fees if desired. For up‑to‑date gas price data, visit [Etherscan Gas Tracker](https://etherscan.io/gastracker).

---

## 3. Start the Server

Run your Express API:
```bash
npx ts-node src/startup.ts
```
Alternatively, compile and start with Node:
```bash
npm run build
node dist/startup.js
```

Once started, the API will listen on `http://localhost:3000`.

---

# API Documentation

**Base URL:** `http://localhost:3000`

**Authentication:** None

---

## Error Handling

All error responses return HTTP status 500 with JSON body:

```json
{
  "error": "Description of what went wrong"
}
```

---

## Endpoints

### Tokens

#### 1. Get Token Information

```
GET /tokens/{token}
```

- **Path Parameters**

  - `token` (string) – ERC‑20 contract address

- **Response 200**

```json
{
  "name": "MyToken",
  "symbol": "MTK",
  "decimals": 18,
  "totalSupply": "1000000000000000000000000"
}
```

---

#### 2. Get User Balance

```
GET /tokens/{token}/balance/{owner}
```

- **Path Parameters**

  - `token` (string) – ERC‑20 contract address
  - `owner` (string) – user address

- **Response 200**

```json
{
  "balance": "500000000000000000"
}
```

---

#### 3. Get Allowance

```
GET /tokens/{token}/allowance/{owner}/{spender}
```

- **Path Parameters**

  - `token` (string) – ERC‑20 contract address
  - `owner` (string) – token owner address
  - `spender` (string) – spender address

- **Response 200**

```json
{
  "allowance": "1000000000000000000"
}
```

---

#### 4. Transfer Tokens

```
POST /tokens/{token}/transfer
Content-Type: application/json

{
  "sender": "0xHolder",
  "recipient": "0xRecipient",
  "tokenValue": "1000000000000000000"
}
```

- **Response 200**

```json
{
  "rawTx": "0xf86c808504a817c80082520894..."
}
```

---

#### 5. Approve Allowance

```
POST /tokens/{token}/approve
Content-Type: application/json

{
  "sender": "0xHolder",
  "spender": "0xSpender",
  "tokenValue": "500000000000000000"
}
```

- **Response 200**

```json
{
  "rawTx": "0xf8...approveTxRawData"
}
```

---

#### 6. Transfer From (using allowance)

```
POST /tokens/{token}/transferFrom
Content-Type: application/json

{
  "sender": "0xOwner",
  "payer": "0xPayer",
  "recipient": "0xRecipient",
  "tokenValue": "250000000000000000"
}
```

- **Response 200**

```json
{
  "rawTx": "0xf8...transferFromRaw"
}
```

---

### Transactions

#### 1. Send Signed Transaction

```
POST /transactions/send
Content-Type: application/json

{
  "signedTx": "0xf86c808504a817c80082520894..."
}
```

- **Response 200**

```json
{
  "txHash": "0x5e1d3..."
}
```

---

#### 2. Get Transaction Status

```
GET /transactions/{txHash}/status
```

- **Path Parameters**

  - `txHash` (string) – transaction hash

- **Response 200**

```json
{
  "txHash": "0x5e1d3...",
  "status": "confirmed"
}
```

---

#### 3. **DEBUG: Sign Raw Transaction**

> ⚠️ **Demo only.** This endpoint exists for quick testing. **Do not** use in production—sign your transactions locally with your own private key.

```
POST /transactions/debug/sign
Content-Type: application/json

{ /* see TxDto schema below */ }
```

- **Response 200**

```json
{
  "signedTx": "0xf86c80850..."
}
```

---

## Schemas

### TokenInfoDto

```yaml
"type": "object"
"description": "Basic information about an ERC‑20 token contract."
"properties":
  "name":
    "type": "string"
    "description": "Full name of the token (e.g., “MyToken”)."
  "symbol":
    "type": "string"
    "description": "Ticker symbol of the token (e.g., “MTK”)."
  "decimals":
    "type": "integer"
    "description": "Number of decimal places the token uses."
  "totalSupply":
    "type": "string"
    "description": "Total supply of tokens, in the smallest unit (wei)."
"required":
  - name
  - symbol
  - decimals
  - totalSupply
```

### UserBalanceDto

```yaml
"type": "object"
"description": "Holds the balance of a user for a specific ERC‑20 token."
"properties":
  "balance":
    "type": "string"
    "description": "Balance of the user in the smallest unit (wei)."
"required":
  - balance
```

### ApproveRequestDto

```yaml
"type": "object"
"description": "Request payload to grant allowance of ERC‑20 tokens."
"properties":
  "sender":
    "type": "string"
    "description": "Address of the token holder who is approving."
  "spender":
    "type": "string"
    "description": "Address of the account being approved to spend tokens."
  "tokenValue":
    "type": "string"
    "description": "Amount of tokens to approve, in smallest unit (wei)."
"required":
  - sender
  - spender
  - tokenValue
```

### TokenInfoResponseDto

```yaml
"type": "object"
"description": "Detailed information about an ERC‑20 token contract."
"properties":
  "name":
    "type": "string"
    "description": "Full name of the token."
  "symbol":
    "type": "string"
    "description": "Ticker symbol of the token."
  "decimals":
    "type": "integer"
    "description": "Number of decimal places."
  "totalSupply":
    "type": "string"
    "description": "Total supply, in smallest unit."
"required":
  - name
  - symbol
  - decimals
  - totalSupply
```

### TransferFromRequestDto

```yaml
"type": "object"
"description": "Request payload to transfer tokens using an existing allowance."
"properties":
  "sender":
    "type": "string"
    "description": "Address of the token owner who granted allowance."
  "payer":
    "type": "string"
    "description": "Address of the account paying gas fees."
  "recipient":
    "type": "string"
    "description": "Address of the account receiving tokens."
  "tokenValue":
    "type": "string"
    "description": "Amount of tokens to transfer, in smallest unit."
"required":
  - sender
  - payer
  - recipient
  - tokenValue
```

### TransferRequestDto

```yaml
"type": "object"
"description": "Request payload to transfer ERC‑20 tokens directly."
"properties":
  "sender":
    "type": "string"
    "description": "Address of the token sender."
  "recipient":
    "type": "string"
    "description": "Address of the token recipient."
  "tokenValue":
    "type": "string"
    "description": "Amount of tokens to transfer, in smallest unit."
"required":
  - sender
  - recipient
  - tokenValue
```

### TxDto

```yaml
"type": "object"
"description": "Representation of a raw Ethereum transaction."
"properties":
  "to":
    "type": "string"
    "description": "Contract or account address to send the transaction to."
  "data":
    "type": "string"
    "description": "Encoded function call data payload."
  "value":
    "type": "string"
    "description": "ETH value to send with the transaction, in wei."
  "nonce":
    "type": "integer"
    "nullable": true
    "description": "Transaction count of sender; null to auto-determine."
  "gas":
    "type": "string"
    "description": "Gas limit for the transaction, in units of gas."
  "maxFeePerGas":
    "type": "string"
    "description": "Maximum fee per gas unit willing to pay (EIP‑1559), in wei."
  "maxPriorityFeePerGas":
    "type": "string"
    "description": "Maximum priority fee per gas unit (miner tip), in wei."
"required":
  - to
  - data
  - value
  - gas
  - maxFeePerGas
  - maxPriorityFeePerGas
```
