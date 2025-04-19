import { ReactNode } from 'react'
import { Button, ButtonProps } from '@penx/ui/components/button'
import { HTMLMotionProps, motion } from 'motion/react'

export const MotionButton: (
  props: HTMLMotionProps<'button'> & ButtonProps,
) => ReactNode = motion(Button) as any

export const MotionBox: (
  props: HTMLMotionProps<'div'> & ButtonProps,
) => ReactNode = motion.div as any
