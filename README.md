# Automating my work life

This repo is a collection of lengthy, repetitive, mind-numbing, and ultimately unsatisfying tasks from work I have automated out of my life forever! I enjoy learning about technology that can make my life easier, and sharing it with others to make their lives easier.

> I chose a lazy person to do a hard job. Because a lazy person will find an easy way to do it.

— Bill Gates

## Requirements

1. [.env file](https://www.npmjs.com/package/dotenv) - I am using a local .env file to access sensitive info like API urls

2. [Vault](https://developer.hashicorp.com/vault/downloads) - I am using the Vault CLI to access secrets for API calls ([example](./functions/Auth.js))

3. [Google Cloud](https://cloud.google.com/sdk/docs/install#mac) - I am using the gcloud CLI to authenticate and access bigQuery

   [gcloud CLI - Authorize with a user account](https://cloud.google.com/sdk/docs/authorizing#authorize_with_a_user_account)

   ```bash
   gcloud auth application-default login
   ```
