import React, { TextareaHTMLAttributes } from 'react'
import { TextArea as StyledTextArea } from './styles'

interface CustomTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>(({ hasError = false, ...rest }, ref) => {
  return (
    <StyledTextArea
      spellCheck={false}
      ref={ref}
      className={hasError ? 'error' : ''}
      {...rest}
    />
  )
})

CustomTextarea.displayName = 'CustomTextarea'

export { CustomTextarea }
