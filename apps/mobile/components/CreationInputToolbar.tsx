import React, { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonToolbar,
} from '@ionic/react'
import { send } from 'ionicons/icons'

export const CreationInputToolbar: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [footerStyle, setFooterStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        (info) => {
          setVisible(true)
          setFooterStyle({
            transform: `translateY(-${info.keyboardHeight}px)`,
            transition: 'transform 0.3s ease-out',
          })
        },
      )

      // 键盘即将隐藏时的事件
      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          setVisible(false)
          console.log('键盘即将隐藏')
          // 重置底部工具栏的样式
          setFooterStyle({
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-out',
          })
        },
      )

      // 组件卸载时清除事件监听器
      return () => {
        keyboardWillShowListener.then((handle) => handle?.remove())
        keyboardWillHideListener.then((handle) => handle?.remove())
      }
    }
  }, [])

  return (
    <>
      <IonFooter
        style={{
          visibility: visible ? 'visible' : 'hidden',
          ...footerStyle,
        }}
      >
        <IonToolbar>
          <div className="bg-amber-400">this toolbar</div>
        </IonToolbar>
      </IonFooter>
    </>
  )
}
