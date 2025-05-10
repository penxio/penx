'use client'

import React, { useState } from 'react'
import { motion, useAnimation } from 'motion/react'

const SWIPE_THRESHOLD = 100 // 滑动触发阈值

export default function SwipeActions() {
  const controls = useAnimation()
  const [isOpen, setIsOpen] = useState(false)

  // 拖拽结束时触发
  const handleDragEnd = (event, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      // 向左滑动超过阈值，显示左侧操作
      controls.start({ x: -150 })
      setIsOpen(true)
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      // 向右滑动超过阈值，显示右侧操作
      controls.start({ x: 150 })
      setIsOpen(true)
    } else {
      // 滑动不足，回到初始位置
      controls.start({ x: 0 })
      setIsOpen(false)
    }
  }

  // 点击操作按钮时关闭滑动菜单
  const closeActions = () => {
    controls.start({ x: 0 })
    setIsOpen(false)
  }

  return (
    <div style={{ position: 'relative', width: 300, margin: '40px auto' }}>
      {/* 操作按钮 - 右侧 */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 150,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#ff4d4f',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: 8,
          userSelect: 'none',
        }}
      >
        <button
          onClick={closeActions}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          删除
        </button>
        <button
          onClick={closeActions}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          标记
        </button>
      </div>

      {/* 操作按钮 - 左侧 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 150,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#52c41a',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: 8,
          userSelect: 'none',
        }}
      >
        <button
          onClick={closeActions}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          完成
        </button>
        <button
          onClick={closeActions}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          归档
        </button>
      </div>

      {/* 可拖拽内容 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: 20,
          cursor: 'grab',
          userSelect: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h4>滑动我试试</h4>
        <p>向左或向右滑动，显示操作按钮</p>
      </motion.div>
    </div>
  )
}
