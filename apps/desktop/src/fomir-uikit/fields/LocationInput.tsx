import { FC, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { homeDir, resolve } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import { exists, mkdir } from '@tauri-apps/plugin-fs'
import { NodeProps, useFormContext } from 'fomir'
import { FolderClosed } from 'lucide-react'
import { InputNode } from '../fomir-uikit-node'
import { Input as BoneInput, InputElement, InputGroup } from 'uikit'
import { FormField } from '../FormField'

export const LocationInput: FC<NodeProps<InputNode>> = (props) => {
  const form = useFormContext()
  const { value = '', focused, error, disabled, name, componentProps } = props.node
  const ref = useRef<HTMLInputElement>(null)
  const { w = '100p' } = componentProps || {}

  useEffect(() => {
    async function init() {
      if (value) return
      const home = await homeDir()
      const dir = await resolve(home, 'penx-extensions')

      if (!(await exists(dir))) {
        await mkdir(dir, { recursive: true })
      }

      props.handler.handleChange(dir)
    }
    init()
  }, [props.handler, value])

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
        <InputElement
          cursorPointer
          onClick={async () => {
            const home = await homeDir()
            const defaultPath = value
              ? await resolve(value)
              : await resolve(home, 'penx-extensions')
            const selected = await open({
              multiple: false,
              directory: true,
              defaultPath,
              filters: [],
            })
            props.handler.handleChange(selected!)
          }}
        >
          <Box
            inlineFlex
            gray800
            gray500--hover
            onClick={() => {
              props.handler.handleChange('')
              ref.current?.focus()
            }}
          >
            <FolderClosed size={20} />
          </Box>
        </InputElement>
      </InputGroup>
    </FormField>
  )
}
