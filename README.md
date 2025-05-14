# PenX

<div align="center">

<a href="https://www.penx.io" alt="PenX Logo">
    <img src="https://www.penx.io/images/logo-512.png" height="120"/></a>

<h1 style="border-bottom: none">
    <b>PenX</b><br />
    A structure note-taking App for creators.
    <br>
</h1>

[Discord](https://discord.gg/nyVpH9njDu) | [Website](https://www.penx.io/) | [Issues](https://github.com/penxio/penx/issues)

</div>

## Introduction

PenX is an elegant note-taking app designed for creators to effortlessly capture, organize, and manage their ideas, tasks, and inspiration all in one place.

## Features

- Local-first
- Privacy-first
- Open source
- Cross platform
- Realtime sync
- Creator friendly

## Primary tech stack

- Next.js
- TypeScript
- tRPC
- Prisma
- Slate.js
- IndexedDB

## Development

## web

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

## ⚖️ License


