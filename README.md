# Automating my work life

> I chose a lazy person to do a hard job. Because a lazy person will find an easy way to do it.

— Bill Gates

I am not ~~too~~ lazy, but I do not enjoy performing a repetitive task for hours on end when I could write a script to do the same thing in a few seconds. I do enjoy learning about technology that can make my life easier and sharing it with other people to make their lives easier.

## The Usual

If my work life was a story, every chapter would start off something like this...

> I did not realize these things had these properties! I wonder how many of these things exist with this, that, or the other thing? If I give you a list of the things I care about, can you do a "search" and give me a list of things that have the properties I am looking for?

— Ends (aka End Users)

![The Usual Diagram](./docs/media/the_usual.png)

## Requirements

1. [.env file](https://github.com/motdotla/dotenv) - I am using a local .env file to access sensitive info like API urls and Vault paths

2. [Vault](https://developer.hashicorp.com/vault/downloads) - I am using the Vault CLI to access secrets for API calls ([example](https://github.com/mshuber1981/work-life/blob/main/utils/auth.js#L12))

3. [Google Cloud](https://cloud.google.com/sdk/docs/install#mac) - I am using the gcloud CLI to authenticate and access BigQuery

   [gcloud CLI - Authorize with a user account](https://cloud.google.com/sdk/docs/authorizing#authorize_with_a_user_account)

   ```bash
   gcloud auth application-default login
   ```

### Requirements testing

```bash
PASS  ./requirements.test.js
   ✓ Checking for .env API_URL variable... (2 ms)
   ✓ Checking for Vault CLI... (517 ms)
   ✓ Checking for .env OAuth related variables...
   ✓ Checking for Google Cloud CLI... (1337 ms)

   Test Suites: 1 passed, 1 total
   Tests:       4 passed, 4 total
   Snapshots:   0 total
   Time:        2.073 s
   Ran all test suites.
```

## Getting started with MkDocs

1. Requirements - [https://www.mkdocs.org/user-guide/installation/#requirements](https://www.mkdocs.org/user-guide/installation/#requirements)
2. Installing MkDocs - [https://www.mkdocs.org/user-guide/installation/#installing-mkdocs](https://www.mkdocs.org/user-guide/installation/#installing-mkdocs)
3. Themes (material) - [https://github.com/squidfunk/mkdocs-material#quick-start](https://github.com/squidfunk/mkdocs-material#quick-start)
4. Formatting options (markdown_extensions) - [https://www.mkdocs.org/user-guide/configuration/#formatting-options](https://www.mkdocs.org/user-guide/configuration/#formatting-options)
5. Run the builtin development server - [https://www.mkdocs.org/user-guide/cli/#mkdocs-serve](https://www.mkdocs.org/user-guide/cli/#mkdocs-serve)
6. Deployment options - [https://www.mkdocs.org/user-guide/deploying-your-docs/](https://www.mkdocs.org/user-guide/deploying-your-docs/)
