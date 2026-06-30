import { Loader, Spinner } from './styles'

export const LoadingComponent = () => {
  return (
    <Loader role="status" aria-live="polite" aria-label="Loading, please wait">
      <Spinner />
    </Loader>
  )
}
