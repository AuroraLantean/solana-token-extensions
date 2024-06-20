# solana-token-extensions

#### Make Token via CLI
<TokenMint>.json is the TokenMint keypair
key*.json is the TokenOwner keypair
*.png is the Token Image
metadata-dragon.json is the Token Metadata, uploaded to IFPS

```
solana config set --keypair key*.json
solana config get

solana balance && solana airdrop 2
solana balance

spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata <TokenMint>.json

spl-token initialize-metadata <TokenMint> 'Dragon Coin' 'Dragon' <Image_Storage_Link>

spl-token create-account <TokenMint>

spl-token mint <TokenMint> 100
Minting 100 tokens

spl-token transfer <TokenMint> 10 <Destination_Address> --fund-recipient

```


#### Make Token via JavaScript Web3.js
Update token name, symbol, uri, and additionalMetadata values inside mintToken.ts file. Then run it:
```
bun mintToken.ts
```