# PenX

<div align="center">

<a href="https://www.penx.io" alt="PenX Logo">
    <img src="https://www.penx.io/images/logo-512.png" height="120"/></a>

<h1 style="border-bottom: none">
    <b>PenX</b><br />
    Next generation dynamic blogging tools
    <br>
</h1>

Deploy a dynamic blog using Cloudflare Pages, D1, R2, and AI. 100% run on Cloudflare.

[Discord](https://discord.gg/nyVpH9njDu) | [Website](https://www.penx.io) | [Issues](https://github.com/penx-lab/penx/issues)

</div>


## Deploy your own

There two way to deploy PenX:
- Deploy with PenX One-click tools (recommended). [Deploy now ](https://penx.io/self-hosted)
- Deploy with source code. [Deploy now ](https://penx.io/docs/deploy-penx-with-one-click-tools)

## Technology stack

- Framework: [Next.js](https://nextjs.org/)
- UI: [Tailwindcss](https://tailwindcss.com/) && [shadcn](https://ui.shadcn.com/)
- Database: [Cloudflare D1](https://developers.cloudflare.com/d1/)
- Object Storage: [Cloudflare R2](https://www.cloudflare.com/pt-br/developer-platform/products/r2/)
- Deployment: [Cloudflare Pages](https://pages.cloudflare.com/)

## Local development

To develop PenX locally, follow these steps:

1.Clone the repository:

```
git clone https://github.com/penx-labs/penx
```

2.Initial setup: run the following commands for the first time:

```bash
pnpm install
pnpm run db:generate
pnpm run db:migrate:prod
```

3.Start local server:

```bash
pnpm dev
```

Your local server will be available at `http://localhost:3000`

4.Preview local database:

```bash
pnpm run db:studio:local
```

## Examples blogs

Explore these example blogs created with PenX:

- https://www.0xz.io
- https://penx-blog.pages.dev

## ⚖️ License

This project is open-source and contributions are welcome. Join the community to help enhance PenX for writers everywhere.

For any issues or suggestions, please visit our [GitHub Issues page](https://github.com/penx-labs/penx/issues).