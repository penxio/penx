import { forwardRef, ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

export interface FormFieldProps extends FowerHTMLProps<'div'> {
  showLabel?: boolean
  layout?: 'horizontal' | 'vertical' | 'inline'
  error?: ReactNode
  label?: ReactNode
  help?: ReactNode
  description?: ReactNode
  touched?: boolean
  wrapper?: ReactNode
  renderLabel?: () => ReactNode
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(props, ref) {
  const {
    children,
    showLabel = true,
    renderLabel,
    layout = 'vertical',
    error,
    label,
    help,
    description,
    touched,
    wrapper,
    ...rest
  } = props

  return (
    <Box ref={ref} relative flex mb5 column={layout === 'vertical'} {...rest}>
      {renderLabel?.()}
      {showLabel && label && (
        <Box
          toCenterY
          gap1
          mb2={layout === 'vertical'}
          toRight={layout === 'horizontal'}
          pr2={layout !== 'vertical'}
          w-100p={layout === 'horizontal'}
        >
          {label && (
            <Box as="label" leading-1em toCenterY textLG black>
              {label}
            </Box>
          )}
        </Box>
      )}

      {!!description && (
        <Box textBase mb4 gray500>
          {description}
        </Box>
      )}
      <Box className="uikit-form-field-control" column flex-1 relative>
        <Box toCenterY toLeft>
          {children}
        </Box>
        {error && touched && (
          <Box h-1em red400 bottom="-1.1em" left0 text="0.9em" absolute>
            {error}
          </Box>
        )}
      </Box>
    </Box>
  )
})
