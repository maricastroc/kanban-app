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
    // "% done" reflects completed tasks (the is_completed marker), matching how
    // completion works on the cards — not subtask progress.
    const completedTasks = tasks.filter((t) => t.is_completed).length
    const progress = tasks.length
      ? Math.round((completedTasks / tasks.length) * 100)
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
        disabled={!activeBoard}
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
