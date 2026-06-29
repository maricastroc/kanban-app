import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import {
  BoardName,
  BoardNameContainer,
  Eyebrow,
  MetricStrip,
  StatChip,
  TitleBlock,
} from '../../styles'
import { BoardsDetailsModal } from '@/components/Modals/BoardsDetailsModal'
import { useDisclosure } from '@/hooks/useDisclosure'
import { BoardProps } from '@/@types/board'

interface Metrics {
  tasks: number
  columns: number
  progress: number
}

interface Props {
  activeBoard: BoardProps | undefined
  metrics: Metrics
  isSmallerThanSm: boolean
}

export function BoardHeading({ activeBoard, metrics, isSmallerThanSm }: Props) {
  const details = useDisclosure()

  // the boards sheet is a mobile-only affordance — close it when leaving mobile
  useEffect(() => {
    if (!isSmallerThanSm) details.close()
  }, [isSmallerThanSm, details.close])

  return (
    <Dialog.Root open={details.isOpen}>
      <Dialog.Trigger asChild>
        <BoardNameContainer onClick={() => isSmallerThanSm && details.open()}>
          <TitleBlock>
            <Eyebrow>Boards</Eyebrow>
            <BoardName>{activeBoard?.name || 'No board selected'}</BoardName>
            <MetricStrip>
              <StatChip>
                <strong>{metrics.tasks}</strong> tasks
              </StatChip>
              <StatChip>
                <strong>{metrics.columns}</strong> columns
              </StatChip>
              <StatChip>
                <span className="ring" />
                <strong>{metrics.progress}%</strong> done
              </StatChip>
              {isSmallerThanSm && (
                <FontAwesomeIcon className="chevron" icon={faAngleDown} />
              )}
            </MetricStrip>
          </TitleBlock>
        </BoardNameContainer>
      </Dialog.Trigger>
      <BoardsDetailsModal onClose={details.close} />
    </Dialog.Root>
  )
}
