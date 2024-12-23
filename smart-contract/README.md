# King Job Smart Contract

## Project Setup

1. Navigate to the smart contract directory:
```bash
cd smart-contract
```

2. Install dependencies:
```bash
yarn install
```

## Deployment

Deploy the smart contracts:
```bash
npx hardhat run scripts/deploy.ts --network testnet
```

## Testing

Run tests to ensure the contracts are functioning correctly:
```bash
npx hardhat test tests/FreelancePlatform.test.ts
```

## Running Worker

Start the blockchain worker for handling on-chain transactions:
```bash
npx hardhat run worker/main.ts --network testnet
```

## Notes

- **Permissions**: Ensure you have the necessary permissions to run shell scripts.
- **Dependencies**: Make sure Hardhat and all required dependencies are installed.
- **Network Configurations**: Verify the network settings in your Hardhat configuration file (`hardhat.config.ts`).
- **Environment Variables**: Set up required `.env` variables for private keys and API endpoints.

