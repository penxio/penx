// app/page.tsx 或其他组件
'use client'

import { useState } from 'react'

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!file) return alert('请先选择音频文件')

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setTranscript(data.text)
      } else {
        alert(data.error || '转录失败')
      }
    } catch (err) {
      alert('请求出错')
    }
    setLoading(false)
  }

  return (
    <div>
      <h1>GPT-4o-mini-transcribe 语音转文字示例</h1>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '转录中...' : '开始转录'}
      </button>
      <pre>{transcript}</pre>
    </div>
  )
}
