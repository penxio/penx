'use client'

import { useState } from 'react'
import { useInterval } from 'react-use'
import Image from 'next/image'

export function Screenshots() {
  const [fade, setFade] = useState(false)
  const [value, setValue] = useState(1)

  useInterval(() => {
    setFade(true)
    setTimeout(() => {
      setValue((count) => (count === 5 ? 1 : count + 1))
      setFade(false)
    }, 500)
  }, 5000)

  return (
    <div className={`image-screenshot ${fade ? 'fade-out' : 'fade-in'}`}>
      <Image
        src={`/images/screenshots/screenshot-${value}.png`}
        className="h-full w-full transition-all"
        width={1600}
        height={1000}
        alt=""
      />
    </div>
  )
}
