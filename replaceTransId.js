const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, './')
const transIdRegex = /<Trans id="([^"]+)"><\/Trans>/g

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const newContent = content.replace(
    transIdRegex,
    (match, p1) => `<Trans>${p1}</Trans>`,
  )
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`Updated: ${filePath}`)
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules') {
      // 跳过 node_modules 目录
      continue
    }
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      processFile(fullPath)
    }
  }
}

walkDir(rootDir)
