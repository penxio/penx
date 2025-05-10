'use client';

import React, { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'motion/react'


const SwipeActions = () => {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isInputActive, setIsInputActive] = useState(false)

  // 用于跟踪拖拽位置的MotionValue
  const y = useMotionValue(0)

  // 根据Y轴位置计算输入区域的高度和不透明度
  const height = useTransform(y, [0, 100], [0, 100])
  const opacity = useTransform(y, [0, 60, 100], [0, 0.8, 1])
  const scale = useTransform(y, [0, 100], [0.9, 1])
  // 处理拖拽结束
  const handleDragEnd = (event, info) => {
    // 如果拖拽距离足够，激活输入框
    if (info.offset.y > 60) {
      setIsInputActive(true)
      y.set(100) // 将输入区域设置为完全展开
    } else {
      y.set(0) // 回弹到关闭状态
      if (!isInputActive) {
        setInputValue('') // 如果未激活，清空输入
      }
    }
  }

  // 处理添加新任务
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newTodo = { id: Date.now(), text: inputValue, completed: false }
      setTodos([newTodo, ...todos]) // 在顶部添加新任务
      setInputValue('')
      setIsInputActive(false) // 关闭输入区域
      y.set(0) // 回弹到关闭状态
    }
  }

  // 关闭输入区域
  const handleCloseInput = () => {
    setIsInputActive(false)
    setInputValue('')
    y.set(0) // 回弹到关闭状态
  }

  return (
    <div className="clear-app">
      {/* 下拉区域 */}
      <motion.div
        className="pull-down-area"
        drag="y"
        dragConstraints={{ top: 0, bottom: 100 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        {/* 下拉指示器 */}
        <motion.div
          className="pull-indicator"
          style={{
            opacity: useTransform(y, [0, 50], [1, 0]),
            rotateX: useTransform(y, [0, 100], [0, 180]),
          }}
        >
          <span>⌄</span>
        </motion.div>

        {/* 输入区域 */}
        <motion.div
          className="input-container"
          style={{
            height,
            opacity,
            scale,
          }}
        >
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="添加新任务..."
              autoFocus={isInputActive}
            />
            {isInputActive && (
              <div className="input-actions">
                <motion.button
                  type="button"
                  onClick={handleCloseInput}
                  className="cancel-btn"
                  whileTap={{ scale: 0.95 }}
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  className="add-btn"
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim()}
                >
                  添加
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>

      {/* Todo列表 */}
      <div className="todos-container">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="todo-content"
                onClick={() =>
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t,
                    ),
                  )
                }
              >
                {todo.text}
              </div>
              <motion.button
                className="delete-btn"
                onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className="empty-state">
            <p>下拉添加您的第一个任务</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SwipeActions