import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API',
        version: '1.0.0',
      },components: {
        schemas: {
          TokenInfoDto: {
            type: 'object',
            description: 'Basic information about an ERC‑20 token contract.',
            properties: {
              name: {
                type: 'string',
                description: 'Full name of the token (e.g., “MyToken”).',
              },
              symbol: {
                type: 'string',
                description: 'Ticker symbol of the token (e.g., “MTK”).',
              },
              decimals: {
                type: 'integer',
                description: 'Number of decimal places the token uses.',
              },
              totalSupply: {
                type: 'string',
                description: 'Total supply of tokens, in the smallest unit (wei).',
              },
            },
            required: ['name', 'symbol', 'decimals', 'totalSupply'],
          },
          
          UserBalanceDto: {
            type: 'object',
            description: 'Holds the balance of a user for a specific ERC‑20 token.',
            properties: {
              balance: {
                type: 'string',
                description: 'Balance of the user in the smallest unit (wei).',
              },
            },
            required: ['balance'],
          },
      
          ApproveRequestDto: {
            type: 'object',
            description: 'Request payload to grant allowance of ERC‑20 tokens.',
            properties: {
              sender: {
                type: 'string',
                description: 'Address of the token holder who is approving.',
              },
              spender: {
                type: 'string',
                description: 'Address of the account being approved to spend tokens.',
              },
              tokenValue: {
                type: 'string',
                description: 'Amount of tokens to approve, in smallest unit (wei).',
              },
            },
            required: ['sender', 'spender', 'tokenValue'],
          },
      
          TokenInfoResponseDto: {
            type: 'object',
            description: 'Detailed information about an ERC‑20 token contract.',
            properties: {
              name: {
                type: 'string',
                description: 'Full name of the token.',
              },
              symbol: {
                type: 'string',
                description: 'Ticker symbol of the token.',
              },
              decimals: {
                type: 'integer',
                description: 'Number of decimal places.',
              },
              totalSupply: {
                type: 'string',
                description: 'Total supply, in smallest unit.',
              },
            },
            required: ['name', 'symbol', 'decimals', 'totalSupply'],
          },
      
          TransferFromRequestDto: {
            type: 'object',
            description: 'Request payload to transfer tokens using an existing allowance.',
            properties: {
              sender: {
                type: 'string',
                description: 'Address of the token owner who granted allowance.',
              },
              payer: {
                type: 'string',
                description: 'Address of the account paying gas fees.',
              },
              recipient: {
                type: 'string',
                description: 'Address of the account receiving tokens.',
              },
              tokenValue: {
                type: 'string',
                description: 'Amount of tokens to transfer, in smallest unit.',
              },
            },
            required: ['sender', 'payer', 'recipient', 'tokenValue'],
          },
      
          TransferRequestDto: {
            type: 'object',
            description: 'Request payload to transfer ERC‑20 tokens directly.',
            properties: {
              sender: {
                type: 'string',
                description: 'Address of the token sender.',
              },
              recipient: {
                type: 'string',
                description: 'Address of the token recipient.',
              },
              tokenValue: {
                type: 'string',
                description: 'Amount of tokens to transfer, in smallest unit.',
              },
            },
            required: ['sender', 'recipient', 'tokenValue'],
          },
      
          TxDto: {
            type: 'object',
            description: 'Representation of a raw Ethereum transaction.',
            properties: {
              to: {
                type: 'string',
                description: 'Contract or account address to send the transaction to.',
              },
              data: {
                type: 'string',
                description: 'Encoded function call data payload.',
              },
              value: {
                type: 'string',
                description: 'ETH value to send with the transaction, in wei.',
              },
              nonce: {
                type: 'integer',
                nullable: true,
                description: 'Transaction count of sender; null to auto-determine.',
              },
              gas: {
                type: 'string',
                description: 'Gas limit for the transaction, in units of gas.',
              },
              maxFeePerGas: {
                type: 'string',
                description: 'Maximum fee per gas unit willing to pay (EIP‑1559), in wei.',
              },
              maxPriorityFeePerGas: {
                type: 'string',
                description: 'Maximum priority fee per gas unit (miner tip), in wei.',
              },
            },
            required: ['to', 'data', 'value', 'gas', 'maxFeePerGas', 'maxPriorityFeePerGas'],
          },
        }
      }
      
    },
    apis: ['./src/presentation/*.ts'],
  };
  
export const swaggerSpec = swaggerJSDoc(options);