import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ActionBtn,
  Actions,
  BoardName,
  BoardNameContainer,
  Container,
  Dropdown,
  DropdownItem,
  EditDeleteBtn,
  Eyebrow,
  MetricStrip,
  SearchBox,
  StatChip,
  TitleBlock,
  Toolbar,
  ToolButton,
  ToolButtonWrapper,
  TopRow,
} from './styles'
import {
  faAngleDown,
  faArrowUpWideShort,
  faCheck,
  faEllipsisVertical,
  faFilter,
  faMagnifyingGlass,
  faPlus,
  faTag,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { BoardsDetailsModal } from '@/components/Modals/BoardsDetailsModal'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TaskFormModal } from '@/components/Modals/TaskFormModal'
import { ActionsModal } from '@/components/Modals/ActionsModal'
import { BREAKPOINT_SM } from '@/utils/constants'
import { useWindowResize } from '@/utils/useWindowResize'
import { useBoardsContext } from '@/contexts/BoardsContext'
import { TagsModal } from '@/components/Modals/TagsModal'
import { TagProps } from '@/@types/tag'
import useRequest from '@/utils/useRequest'
import { DeleteTagModal } from '@/components/Modals/DeleteTagModal'
import { useClickOutside } from '@/utils/useClickOutside'
import { useEscapeKey } from '@/utils/useEscapeKey'
import { getTagHex } from '@/utils/getTagHex'
import { SortKey } from '@/utils/filterBoardColumns'

type Props = {
  hideSidebar: boolean
  enableDarkMode: boolean
  search: string
  onSearchChange: (value: string) => void
  filterTags: string[]
  onToggleFilterTag: (name: string) => void
  onClearFilters: () => void
  sortBy: SortKey
  onSortChange: (value: SortKey) => void
}

// stable reference — prevents useRequest from creating a new SWR key on every render
const TAGS_REQUEST = { url: '/tags', method: 'GET' }

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'manual', label: 'Manual order' },
  { key: 'due', label: 'Due date' },
  { key: 'name', label: 'Name (A–Z)' },
]

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
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isViewTagsModalOpen, setIsViewTagsModalOpen] = useState(false)
  const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagProps | null>(null)
  const [isBoardsDetailsModalOpen, setIsBoardsDetailsModalOpen] =
    useState(false)
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const filterRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useClickOutside(filterRef, () => setIsFilterOpen(false), isFilterOpen)
  useClickOutside(sortRef, () => setIsSortOpen(false), isSortOpen)
  useEscapeKey(() => setIsFilterOpen(false), isFilterOpen)
  useEscapeKey(() => setIsSortOpen(false), isSortOpen)

  // "/" focuses the search field (skips when already typing somewhere)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/') return
      const el = document.activeElement as HTMLElement | null
      const typing =
        el?.tagName === 'INPUT' ||
        el?.tagName === 'TEXTAREA' ||
        el?.isContentEditable
      if (typing) return
      event.preventDefault()
      searchInputRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const { activeBoard } = useBoardsContext()

  const isSmallerThanSm = useWindowResize(BREAKPOINT_SM)

  const { data, mutate: tagsMutate } = useRequest<{ tags: TagProps[] }>(
    TAGS_REQUEST,
  )

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

  const onCloseTagModal = () => {
    setIsViewTagsModalOpen(false)
    setIsDeleteTagModalOpen(false)
    setSelectedTag(null)
  }

  useEffect(() => {
    if (!isSmallerThanSm) {
      setIsBoardsDetailsModalOpen(false)
    }
  }, [isSmallerThanSm])

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortBy)?.label || 'Sort'

  return (
    <Container className={`${hideSidebar ? 'hide-sidebar-mode' : ''}`}>
      <TopRow>
        <Dialog.Root open={isBoardsDetailsModalOpen}>
          <Dialog.Trigger asChild>
            <BoardNameContainer
              onClick={() =>
                isSmallerThanSm && setIsBoardsDetailsModalOpen(true)
              }
            >
              <TitleBlock>
                <Eyebrow>Boards</Eyebrow>
                <BoardName>
                  {activeBoard?.name || 'No board selected'}
                </BoardName>
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
          <BoardsDetailsModal
            onClose={() => setIsBoardsDetailsModalOpen(false)}
          />
        </Dialog.Root>

        <Actions>
          <Dialog.Root
            open={isViewTagsModalOpen}
            onOpenChange={setIsViewTagsModalOpen}
          >
            <Dialog.Trigger asChild>
              <ActionBtn className="secondary">
                <FontAwesomeIcon icon={faTag} />
                <p>Tags</p>
              </ActionBtn>
            </Dialog.Trigger>
            <TagsModal
              tags={data?.tags || null}
              tagsMutate={tagsMutate}
              onDeleteTag={(tag) => {
                setSelectedTag(tag)
                setIsDeleteTagModalOpen(true)
                setIsViewTagsModalOpen(false)
              }}
              onClose={onCloseTagModal}
            />
          </Dialog.Root>

          <Dialog.Root
            open={isDeleteTagModalOpen}
            onOpenChange={setIsDeleteTagModalOpen}
          >
            <DeleteTagModal
              tagsMutate={tagsMutate}
              selectedTag={selectedTag}
              onClose={onCloseTagModal}
            />
          </Dialog.Root>

          {activeBoard && (
            <Dialog.Root
              open={isAddTaskModalOpen}
              onOpenChange={setIsAddTaskModalOpen}
            >
              <Dialog.Trigger asChild>
                <ActionBtn>
                  <FontAwesomeIcon icon={faPlus} />
                  <p>New task</p>
                </ActionBtn>
              </Dialog.Trigger>
              <TaskFormModal
                isEditing={false}
                column={activeBoard?.columns?.[0]}
                onClose={() => setIsAddTaskModalOpen(false)}
              />
            </Dialog.Root>
          )}

          <Dialog.Root
            open={isActionsModalOpen}
            onOpenChange={setIsActionsModalOpen}
          >
            <Dialog.Trigger asChild>
              <EditDeleteBtn>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </EditDeleteBtn>
            </Dialog.Trigger>
            <ActionsModal onClose={() => setIsActionsModalOpen(false)} />
          </Dialog.Root>
        </Actions>
      </TopRow>

      <Toolbar>
        <SearchBox>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            ref={searchInputRef}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks…"
            aria-label="Search tasks"
          />
          {search ? (
            <FontAwesomeIcon
              className="clear"
              icon={faXmark}
              onClick={() => onSearchChange('')}
            />
          ) : (
            <span className="kbd" aria-hidden="true">
              /
            </span>
          )}
        </SearchBox>

        <ToolButtonWrapper ref={filterRef}>
          <ToolButton
            className={`${isFilterOpen ? 'open' : ''} ${
              filterTags.length ? 'active' : ''
            }`}
            onClick={() => {
              setIsFilterOpen((v) => !v)
              setIsSortOpen(false)
            }}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filter
            {filterTags.length > 0 && (
              <span className="badge">{filterTags.length}</span>
            )}
          </ToolButton>

          {isFilterOpen && (
            <Dropdown>
              <div className="dropdown-header">
                <span>Filter by tag</span>
                {filterTags.length > 0 && (
                  <button onClick={onClearFilters}>Clear</button>
                )}
              </div>
              {data?.tags && data.tags.length > 0 ? (
                data.tags.map((tag) => {
                  const selected = filterTags.includes(tag.name)
                  return (
                    <DropdownItem
                      key={String(tag.id)}
                      className={selected ? 'selected' : ''}
                      onClick={() => onToggleFilterTag(tag.name)}
                    >
                      <span
                        className="swatch"
                        style={{ backgroundColor: getTagHex(tag.color) }}
                      />
                      <span className="label">{tag.name}</span>
                      {selected && (
                        <FontAwesomeIcon className="check" icon={faCheck} />
                      )}
                    </DropdownItem>
                  )
                })
              ) : (
                <div className="empty">No tags yet</div>
              )}
            </Dropdown>
          )}
        </ToolButtonWrapper>

        <ToolButtonWrapper ref={sortRef}>
          <ToolButton
            className={`${isSortOpen ? 'open' : ''} ${
              sortBy !== 'manual' ? 'active' : ''
            }`}
            onClick={() => {
              setIsSortOpen((v) => !v)
              setIsFilterOpen(false)
            }}
          >
            <FontAwesomeIcon icon={faArrowUpWideShort} />
            {sortBy === 'manual' ? 'Sort' : activeSortLabel}
          </ToolButton>

          {isSortOpen && (
            <Dropdown>
              <div className="dropdown-header">
                <span>Sort tasks</span>
              </div>
              {SORT_OPTIONS.map((option) => {
                const selected = option.key === sortBy
                return (
                  <DropdownItem
                    key={option.key}
                    className={selected ? 'selected' : ''}
                    onClick={() => {
                      onSortChange(option.key)
                      setIsSortOpen(false)
                    }}
                  >
                    <span className="label">{option.label}</span>
                    {selected && (
                      <FontAwesomeIcon className="check" icon={faCheck} />
                    )}
                  </DropdownItem>
                )
              })}
            </Dropdown>
          )}
        </ToolButtonWrapper>
      </Toolbar>
    </Container>
  )
}
