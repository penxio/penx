// PGlite 工具函数
// 这个文件展示了如何在扩展的其他部分使用 PGlite

import { PGlite } from '@electric-sql/pglite'

// 数据库操作工具类
export class PGliteUtils {
  constructor(private pglite: PGlite) {}

  // 用户相关操作
  async createUser(name: string, email: string) {
    const result = await this.pglite.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    )
    return result.rows[0]
  }

  async getUserById(id: number) {
    const result = await this.pglite.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }

  async getAllUsers() {
    const result = await this.pglite.query('SELECT * FROM users ORDER BY created_at DESC')
    return result.rows
  }

  // 笔记相关操作
  async createNote(title: string, content: string, userId: number) {
    const result = await this.pglite.query(
      'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, userId]
    )
    return result.rows[0]
  }

  async getNotesByUserId(userId: number) {
    const result = await this.pglite.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return result.rows
  }

  async updateNote(id: number, title: string, content: string) {
    const result = await this.pglite.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    )
    return result.rows[0]
  }

  async deleteNote(id: number) {
    await this.pglite.query('DELETE FROM notes WHERE id = $1', [id])
  }

  // 搜索功能
  async searchNotes(query: string, userId?: number) {
    let sql = 'SELECT * FROM notes WHERE (title ILIKE $1 OR content ILIKE $1)'
    const params: any[] = [`%${query}%`]
    
    if (userId) {
      sql += ' AND user_id = $2'
      params.push(userId)
    }
    
    sql += ' ORDER BY created_at DESC'
    
    const result = await this.pglite.query(sql, params)
    return result.rows
  }

  // 统计功能
  async getStats() {
    const userCount = await this.pglite.query('SELECT COUNT(*) FROM users')
    const noteCount = await this.pglite.query('SELECT COUNT(*) FROM notes')
    
    return {
      userCount: (userCount.rows[0] as any).count,
      noteCount: (noteCount.rows[0] as any).count,
    }
  }
}

// 导出类型定义
export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Note {
  id: number
  title: string
  content: string
  user_id: number
  created_at: string
  updated_at: string
}

export interface Stats {
  userCount: number
  noteCount: number
}
