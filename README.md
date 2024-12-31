# Automating my work life

> I chose a lazy person to do a hard job. Because a lazy person will find an easy way to do it.

— Bill Gates

## The Usual

If my work life was a story, every chapter would start off something like this...

> I did not realize these things had these properties! I wonder how many of these things exist with this, that, or the other thing? If I give you a list of the things I care about, can you do a "search" and give me a list of things that have the properties I am looking for?

— Ends (aka End Users)

![The Usual Diagram](./docs/media/the_usual.png)

## Requirements

1. [Vault](https://developer.hashicorp.com/vault/downloads) - I am using the Vault CLI to access secrets for API calls ([vaultOAuthToken.mjs line 15](https://github.com/mshuber1981/work-life/blob/main/utils/vaultOAuthToken.mjs#L15))

2. [Google Cloud](https://cloud.google.com/sdk/docs/install#deb) - I am using the gcloud CLI to authenticate and access BigQuery

   [gcloud CLI - Authorize with a user account](https://cloud.google.com/sdk/docs/authorizing#authorize_with_a_user_account)

   ```bash
   gcloud auth application-default login
   ```

### Requirements testing

```bash
npm run test
```

```bash
PASS  ./requirements.test.js
   ✓ Checking for Vault CLI... (13 ms)
   ✓ Checking for Google Cloud CLI... (901 ms)

   Test Suites: 1 passed, 1 total
   Tests:       2 passed, 2 total
   Snapshots:   0 total
   Time:        1.161 s
   Ran all test suites.
```
