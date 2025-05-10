'use client'

import * as React from 'react'
import { motion, useAnimation, useMotionValue } from 'motion/react'

const SwipeActions = () => {
  // 控制滑动偏移的动画控制器
  const controls = useAnimation()
  // 实时跟踪x轴偏移
  const x = useMotionValue(0)

  // 滑动结束时触发，决定滑动是否展开操作按钮
  const handleDragEnd = (_, info) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    // 如果滑动距离超过阈值，展开动作按钮，否则回弹
    if (offset < -100 || velocity < -500) {
      controls.start({ x: -150 }) // 向左滑动，显示右侧按钮
    } else if (offset > 100 || velocity > 500) {
      controls.start({ x: 150 }) // 向右滑动，显示左侧按钮
    } else {
      controls.start({ x: 0 }) // 回弹到原位
    }
  }

  return (
    <div
      style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}
    >
      <h3>Swipe left or right to reveal actions</h3>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* 操作按钮 - 左侧 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 150,
            backgroundColor: '#4caf50',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          <button
            style={{ background: 'none', border: 'none', color: 'white' }}
          >
            Action 2
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'white' }}
          >
            Action 1
          </button>
        </div>

        {/* 操作按钮 - 右侧 */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 150,
            backgroundColor: '#f44336',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          <button
            style={{ background: 'none', border: 'none', color: 'white' }}
          >
            Action 4
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'white' }}
          >
            Action 3
          </button>
        </div>

        {/* 可滑动的内容 */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -150, right: 150 }}
          style={{
            x,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            cursor: 'grab',
            userSelect: 'none',
            position: 'relative',
            zIndex: 1,
          }}
          onDragEnd={handleDragEnd}
          animate={controls}
          dragElastic={0.2}
        >
          <div>Swipe me</div>
        </motion.div>
      </div>
    </div>
  )
}

export default SwipeActions
