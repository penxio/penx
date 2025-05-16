import { ReactNode } from 'react'
import { HTMLMotionProps, motion } from 'motion/react'
import { Button, ButtonProps } from '@penx/uikit/button'

export const MotionButton: (
  props: HTMLMotionProps<'button'> & ButtonProps,
) => ReactNode = motion(Button) as any

export const MotionBox: (
  props: HTMLMotionProps<'div'> & ButtonProps,
) => ReactNode = motion.div as any
