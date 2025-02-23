import { Loader, ModalLoading } from '@/styles/shared'
import { Oval } from 'react-loader-spinner'

export const LoadingComponent = () => {
  return (
    <ModalLoading>
      <Loader>
        <Oval secondaryColor="#7A7A7A" color="#7A7A7A" height={40} width={40} />
      </Loader>
    </ModalLoading>
  )
}
