export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL

  const config = {
    accountAssociation: {
      header: process.env.NEXT_PUBLIC_DOMAIN_HEADER,
      payload: process.env.NEXT_PUBLIC_DOMAIN_PAYLOAD,
      signature: process.env.NEXT_PUBLIC_DOMAIN_SIGNATURE,
    },
    frame: {
      version: '0.0.0',
      name: 'PenX',
      iconUrl: `${appUrl}/images/logo-192.png`,
      splashImageUrl: `${appUrl}/images/logo-192.png`,
      splashBackgroundColor: '#f7f7f7',
      homeUrl: appUrl,
    },
  }

  return Response.json(config)
}
