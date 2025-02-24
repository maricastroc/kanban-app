import { Loader, ModalLoading } from '@/styles/shared'
import { ThreeDots } from 'react-loading-icons'

export const LoadingComponent = () => {
  return (
    <ModalLoading>
      <Loader>
        <ThreeDots height={'12px'} className="animate-spin" />
      </Loader>
    </ModalLoading>
  )
}
