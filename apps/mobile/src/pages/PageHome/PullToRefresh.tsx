import React, { useState } from 'react'
import { motion, useAnimation } from 'motion/react'

export const PullToRefresh = ({ onRefresh, children }: any) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const controls = useAnimation()

  const handleDragEnd = (event, info) => {
    // if (info.point.y > 100 && !isRefreshing) { // 阈值100px
    //   setIsRefreshing(true);
    //   onRefresh().then(() => {
    //     setIsRefreshing(false);
    //     controls.start({ y: 0 }); // 回弹动画
    //   });
    // } else {
    // }

    controls.start({ y: 0 }) // 未达阈值回弹
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 150 }}
      dragElastic={0.2}
      animate={controls}
      onDragEnd={handleDragEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {isRefreshing && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {children}
    </motion.div>
  )
}
