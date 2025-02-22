import { Loader, ModalLoading } from '@/styles/shared'
import { Oval } from 'react-loader-spinner'

export const LoadingComponent = () => {
  return (
    <ModalLoading>
      <Loader>
        <Oval secondaryColor="#635FC7" color="#635FC7" height={40} width={40} />
      </Loader>
    </ModalLoading>
  )
}
