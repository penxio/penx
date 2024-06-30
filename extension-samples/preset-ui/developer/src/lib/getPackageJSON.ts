export function getPackageJSON(template: string) {
  return `{
  "name": "${template}",
  "private": true,
  "scripts": {
    "dev": "penx dev",
    "release": "penx release"
  },
  "devDependencies": {
    "@penxio/preset-ui": "latest",
    "@penxio/api": "latest",
    "penx-cli": "latest",
    "prettier": "^3.2.5",
    "typescript": "^5.3.2"
  }
}`
}
