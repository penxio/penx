import { FC, useRef } from 'react'
import { NodeProps, useFormContext } from 'fomir'
import { InputNode } from '../fomir-uikit-node'
import { Input as BoneInput, InputGroup } from 'uikit'
import { FormField } from '../FormField'

export const Input: FC<NodeProps<InputNode>> = (props) => {
  const form = useFormContext()
  const { value = '', focused, error, disabled, name, componentProps } = props.node
  const ref = useRef<HTMLInputElement>(null)
  const { w = '100p' } = componentProps || {}

  return (
    <FormField node={props.node}>
      <InputGroup w={w}>
        <BoneInput
          ref={ref}
          disabled={disabled}
          type={'text'}
          value={value || ''}
          borderRed500={!!error}
          borderRed500--focus={!!error}
          onFocus={() => {
            form.setFieldState(name, { focused: true })
          }}
          onBlur={() => {
            form.setFieldState(name, { focused: false })
          }}
          onChange={props.handler.handleChange}
          {...componentProps}
        />
        {/* TODO: fix */}
        {/* {!!value?.length && focused && (
          <InputElement>
            <Box
              inlineFlex
              cursorPointer
              gray400
              gray500--hover
              onClick={() => {
                props.handler.handleChange('')
                ref.current?.focus()
              }}
            >
              <IconCloseSolid neutral400 size={20} />
            </Box>
          </InputElement>
        )} */}
      </InputGroup>
    </FormField>
  )
}
