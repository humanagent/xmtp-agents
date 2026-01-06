# Agent Registry

Open-source registry of XMTP agents. Add your agent to be discoverable in the app.

## Adding an Agent

1. Edit `agents.ts`
2. Add your agent entry to the `AI_AGENTS` array
3. Submit a PR

## Required Fields

- `name`: Agent identifier (lowercase, no spaces)
- `address`: Ethereum address (0x + 40 hex chars)
- `networks`: Array of networks (`["production"]` or `["dev"]` or both)
- `live`: Boolean indicating if agent is operational

## Optional Fields

- `suggestions`: Array of example prompts (3 recommended)
- `image`: URL to agent image (IPFS preferred)
- `domain`: ENS or other domain name

## Example

```typescript
{
  name: "myagent",
  address: "0x1234567890123456789012345678901234567890",
  networks: ["production"],
  live: true,
  suggestions: [
    "@myagent Help with X",
    "@myagent Do Y",
    "@myagent Explain Z",
  ],
  domain: "myagent.eth",
  image: "https://ipfs.io/ipfs/...",
}
```
