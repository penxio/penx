// import 'prismjs/components/prism-python'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { langs } from '@penx/code-block/src/langs'

const str = Object.keys(langs)
  .filter((key) => key !== 'html')
  .map((key) => `import 'prismjs/components/prism-${key}'`)
  .join('\n')

writeFileSync(
  join(__dirname, 'src/plugins/code/import-prism-components.ts'),
  str,
)
