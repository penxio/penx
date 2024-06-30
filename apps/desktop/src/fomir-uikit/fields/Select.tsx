import { FC } from 'react'
import { Box } from '@fower/react'
import { NodeProps } from 'fomir'
import { SelectNode } from '../fomir-uikit-node'
import {
  Select as BoneSelect,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'uikit'
import { FormField } from '../FormField'

export const Select: FC<NodeProps<SelectNode>> = (props) => {
  const { value, componentProps, options = [], display, wrapper } = props.node

  return (
    <FormField node={props.node} hidden={!display}>
      <BoneSelect {...componentProps} value={value} onChange={props.handler.handleChange}>
        <SelectTrigger
          flex-1
          textSM
          w-100p
          h-40
          border
          borderNeutral200--T30
          borderNeutral700--dark
        >
          <SelectValue flexShrink-0 placeholder=""></SelectValue>
          <SelectIcon></SelectIcon>
        </SelectTrigger>
        <SelectContent w-200 maxH-240 useTriggerWidth={true} overflowAuto>
          {options.map((item) => (
            <SelectItem key={item.value + item.value.toString()} value={item.value} toBetween>
              <Box flex-1>{item.label}</Box>
            </SelectItem>
          ))}
        </SelectContent>
      </BoneSelect>
    </FormField>
  )
}
