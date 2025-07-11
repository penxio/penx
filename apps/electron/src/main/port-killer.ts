import { exec } from 'child_process'
import * as os from 'os'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function killPort(port: number): Promise<boolean> {
  const platform = os.platform()

  try {
    if (platform === 'win32') {
      await killPortWindows(port)
    } else {
      await killPortUnix(port)
    }

    console.log(`Successfully killed processes on port ${port}`)
    return true
  } catch (error) {
    console.error(`Failed to kill port ${port}:`, error)
    return false
  }
}

async function killPortWindows(port: number): Promise<void> {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)

    if (!stdout.trim()) {
      console.log(`No process found on port ${port}`)
      return
    }

    const lines = stdout.trim().split('\n')
    const pids = new Set<string>()

    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 5 && parts[1].includes(`:${port}`)) {
        const pid = parts[parts.length - 1]
        if (pid && pid !== '0') {
          pids.add(pid)
        }
      }
    }

    for (const pid of pids) {
      try {
        await execAsync(`taskkill /PID ${pid} /F`)
        console.log(`Killed process ${pid} on port ${port}`)
      } catch (error) {
        console.warn(`Failed to kill process ${pid}:`, error)
      }
    }
  } catch (error) {
    throw new Error(`Windows port kill failed: ${error}`)
  }
}

async function killPortUnix(port: number): Promise<void> {
  try {
    // 使用 lsof 查找进程
    const { stdout } = await execAsync(`lsof -ti:${port}`)

    if (!stdout.trim()) {
      console.log(`No process found on port ${port}`)
      return
    }

    const pids = stdout
      .trim()
      .split('\n')
      .filter((pid) => pid.trim())

    for (const pid of pids) {
      try {
        await execAsync(`kill -9 ${pid}`)
        console.log(`Killed process ${pid} on port ${port}`)
      } catch (error) {
        console.warn(`Failed to kill process ${pid}:`, error)
      }
    }
  } catch (error) {
    try {
      const { stdout } = await execAsync(`netstat -tulnp | grep :${port}`)
      if (stdout.trim()) {
        const lines = stdout.trim().split('\n')
        for (const line of lines) {
          const match = line.match(/(\d+)\//)
          if (match) {
            const pid = match[1]
            await execAsync(`kill -9 ${pid}`)
            console.log(`Killed process ${pid} on port ${port}`)
          }
        }
      }
    } catch (netstatError) {
      throw new Error(`Unix port kill failed: ${error}`)
    }
  }
}

export async function killPorts(
  ports: number[],
): Promise<{ success: number[]; failed: number[] }> {
  const success: number[] = []
  const failed: number[] = []

  for (const port of ports) {
    const result = await killPort(port)
    if (result) {
      success.push(port)
    } else {
      failed.push(port)
    }
  }

  return { success, failed }
}

export async function isPortInUse(port: number): Promise<boolean> {
  const platform = os.platform()

  try {
    if (platform === 'win32') {
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)
      return stdout.trim().length > 0
    } else {
      const { stdout } = await execAsync(`lsof -ti:${port}`)
      return stdout.trim().length > 0
    }
  } catch {
    return false
  }
}
