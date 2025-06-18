import { ThreeDots } from 'react-loading-icons'
import { Loader, ModalLoading } from './styles'

export const LoadingComponent = () => {
  return (
    <ModalLoading>
      <Loader>
        <ThreeDots height={'12px'} className="animate-spin" />
      </Loader>
    </ModalLoading>
  )
}
