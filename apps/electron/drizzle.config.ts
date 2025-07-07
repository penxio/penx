import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts', // 你的表定义文件
  out: './src/db/migrations', // 迁移文件输出目录
  driver: 'pglite',
  dbCredentials: {
    connectionString: 'file:./path/to/mydb', // 对应你的数据库文件路径
  },
})
