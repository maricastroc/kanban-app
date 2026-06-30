import { Toast, toast } from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { Container, Message, UndoButton } from './styles'

interface UndoToastProps {
  toastInstance: Toast
  message: string
  onUndo: () => void
}

// A transient "X deleted — Undo" toast. The actual deletion is deferred (see
// useUndoableDelete); clicking Undo before it fires cancels the request.
export function UndoToast({ toastInstance, message, onUndo }: UndoToastProps) {
  return (
    <Container role="status" aria-live="polite">
      <FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />
      <Message>{message}</Message>
      <UndoButton
        type="button"
        onClick={() => {
          onUndo()
          toast.dismiss(toastInstance.id)
        }}
      >
        <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />
        Undo
      </UndoButton>
    </Container>
  )
}
