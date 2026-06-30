import { ThreeDots } from 'react-loading-icons'
import { Loader } from './styles'

export const LoadingComponent = () => {
  return (
    <Loader role="status" aria-live="polite" aria-label="Loading, please wait">
      <ThreeDots height={'12px'} className="animate-spin" />
    </Loader>
  )
}
