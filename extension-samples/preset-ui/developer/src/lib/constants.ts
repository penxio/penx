export const GITIGNORE = `node_modules
.DS_Store
dist
*.log
.penx`

export const PRETTIER = `{
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80
}`

export const TSCONFIG = `{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "strict": true,
    "lib": ["ESNext", "DOM"],
    "esModuleInterop": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noImplicitAny": true,
    "jsx": "react-jsx",
    "allowJs": true,
    "noEmit": true,
    "outDir": "dist",
    "resolveJsonModule": true
  }
}`
