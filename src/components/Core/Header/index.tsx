import { useMemo } from 'react'
import { Container, TopRow } from './styles'
import { BREAKPOINT_SM } from '@/utils/constants'
import { useWindowResize } from '@/utils/useWindowResize'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { SortKey } from '@/utils/filterBoardColumns'
import { BoardHeading } from './partials/BoardHeading'
import { HeaderActions } from './partials/HeaderActions'
import { BoardToolbar } from './partials/BoardToolbar'

type Props = {
  hideSidebar: boolean
  search: string
  onSearchChange: (value: string) => void
  filterTags: string[]
  onToggleFilterTag: (name: string) => void
  onClearFilters: () => void
  sortBy: SortKey
  onSortChange: (value: SortKey) => void
}

export function Header({
  hideSidebar,
  search,
  onSearchChange,
  filterTags,
  onToggleFilterTag,
  onClearFilters,
  sortBy,
  onSortChange,
}: Props) {
  const { activeBoard } = useBoardsContext()

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const metrics = useMemo(() => {
    const columns = activeBoard?.columns || []
    const tasks = columns.flatMap((c) => c.tasks || [])
    const allSubtasks = tasks.flatMap((t) => t.subtasks || [])
    const completed = allSubtasks.filter((s) => s.is_completed).length
    const progress = allSubtasks.length
      ? Math.round((completed / allSubtasks.length) * 100)
      : 0
    return { tasks: tasks.length, columns: columns.length, progress }
  }, [activeBoard])

  return (
    <Container className={`${hideSidebar ? 'hide-sidebar-mode' : ''}`}>
      <TopRow>
        <BoardHeading
          activeBoard={activeBoard}
          metrics={metrics}
          isSmallerThanSm={isSmallerThanSm}
        />
        <HeaderActions activeBoard={activeBoard} />
      </TopRow>

      <BoardToolbar
        search={search}
        onSearchChange={onSearchChange}
        filterTags={filterTags}
        onToggleFilterTag={onToggleFilterTag}
        onClearFilters={onClearFilters}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
    </Container>
  )
}
