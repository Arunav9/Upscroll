@AGENTS.md

# This is a public repository

`github.com/Arunav9/Upscroll` is **public**. Anyone can read every file and every commit, past and present. Before committing or pushing anything, make sure it contains nothing that could leak something important or cause an unwanted situation:

- No API keys, tokens, passwords, or credentials of any kind
- No `.env` files or other secret config (`.gitignore` covers `.env` and `.env*.local` — keep it that way)
- No signing material: certificates, provisioning profiles, `.p12`/`.jks`/`.key`/`.pem` files
- No personal identifiers that don't need to be public: device UDIDs, Apple Team IDs, personal email addresses, phone numbers, physical addresses, etc. (a bundle identifier like `com.arunav9.upscroll` is fine — it's meant to be public)
- No internal-only URLs, IPs, or infrastructure details

Before adding a new dependency or feature that talks to a network service, remember this is also an offline-only app by design (see the privacy/security principle) — a network call is itself a decision to flag, and doubly so on a public repo where the request would be visible to anyone reading the source.

If a commit is about to include something risky, stop and flag it instead of pushing.
