import React, { useEffect, useRef } from 'react'
import { Keyboard } from '@capacitor/keyboard'
import { IonFooter, IonToolbar } from '@ionic/react'

export const CreationInputToolbar = () => {
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 键盘弹起
    const showHandler = Keyboard.addListener('keyboardWillShow', (info) => {
      if (footerRef.current) {
        footerRef.current.style.bottom = `${info.keyboardHeight}px`
      }
    })

    // 键盘收起
    const hideHandler = Keyboard.addListener('keyboardWillHide', () => {
      if (footerRef.current) {
        footerRef.current.style.bottom = '0px'
      }
    })

    // 清理事件
    return () => {
      showHandler.then((handle) => handle?.remove())
      hideHandler.then((handle) => handle?.remove())
    }
  }, [])

  return (
    <IonFooter ref={footerRef as any} style={{ transition: 'bottom 0.3s' }}>
      <IonToolbar>
        <div className="bg-amber-400">this toolbar</div>
      </IonToolbar>
    </IonFooter>
  )
}
