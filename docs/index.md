# Automating my work life

> I chose a lazy person to do a hard job. Because a lazy person will find an easy way to do it.

— Bill Gates

## The usual

If my work life was a story, every chapter would start something like this...

> I did not realize these things had these properties! I wonder how many of these things exist with this, that, or the other thing? If I give you a list of the things I care about, can you do a "search" and give me a list of things that have the properties I am looking for?

— Ends (aka End Users)

[![The Usual diagram](./media/the_usual.png)](https://github.com/mshuber1981/work-life/blob/main/docs/media/the_usual.png)

## Requirements

1. [Vault](https://developer.hashicorp.com/vault/downloads) - I am using the Vault CLI to access secrets for API calls ([vaultOAuthToken.mjs line 15](https://github.com/mshuber1981/work-life/blob/main/utils/vaultOAuthToken.mjs#L15))

2. [Google Cloud](https://cloud.google.com/sdk/docs/install#mac) - I am using the gcloud CLI to authenticate and access BigQuery

   [gcloud CLI - Authorize with a user account](https://cloud.google.com/sdk/docs/authorizing#authorize_with_a_user_account)

   ```bash
   gcloud auth application-default login
   ```
