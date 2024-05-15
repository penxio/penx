<div align="center">

<a href="https://www.penx.io" alt="PenX Logo">
    <img src="https://www.penx.io/images/logo-512.png" height="120"/></a>

<h1 style="border-bottom: none">
    <b>PenX</b><br />
    Your personal database
    <br>
</h1>

[Discord](https://discord.gg/nyVpH9njDu) | [Website](https://www.penx.io/) | [Issues](https://github.com/penxio/penx/issues)

</div>

## Introduction

An elegant App designed to help you capture, organize, and store your thoughts, tasks, ideas, and information.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpenxio%2Fpenx&env=DATABASE_URL&project-name=penx&repository-name=penx&root-directory=apps%2Fweb&install-command=pnpm%20install&build-command=npx%20turbo%20run%20build%20--filter=web...&ignore-command=npx%20turbo-ignore)

## Features

- **Local-First** - You own your data, in spite of the cloud
- **Privacy-First** - Use End-To-End Encryption to sync data
- **Open Source** - Trust our code, not our words

## Primary tech stack

- Next.js
- TypeScript
- tRPC
- Prisma
- NextAuth.js
- Slate.js
- IndexedDB

## Development

After clone the repo, in the root dir:

```bash
# Install the dependencies
pnpm install

pnpm run build:packages

# copy .env.local.example to .env.local copy
copy apps/web/.env.local.example apps/web/.env.local

# start web service
pnpm dev
```

Go to: http://localhost:3000

## Mac OS installation issue

> “banban” is damaged and can’t be opened. You should move it to the Trash.

To fix it:

```bash
sudo spctl --master-disable
xattr -cr /Applications/PenX.app
```

## ⚖️ License

AGPL 3.0
