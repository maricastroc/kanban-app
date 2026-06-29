import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpWideShort,
  faFilter,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { SearchBox, Toolbar, ToolButton, ToolButtonWrapper } from '../../styles'
import { DropdownMenu } from '../DropdownMenu'
import { useClickOutside } from '@/utils/useClickOutside'
import { useEscapeKey } from '@/utils/useEscapeKey'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useTags } from '@/hooks/useTags'
import { getTagHex } from '@/utils/getTagHex'
import { SortKey } from '@/utils/filterBoardColumns'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'manual', label: 'Manual order' },
  { key: 'due', label: 'Due date' },
  { key: 'name', label: 'Name (A–Z)' },
]

interface Props {
  search: string
  onSearchChange: (value: string) => void
  filterTags: string[]
  onToggleFilterTag: (name: string) => void
  onClearFilters: () => void
  sortBy: SortKey
  onSortChange: (value: SortKey) => void
}

export function BoardToolbar({
  search,
  onSearchChange,
  filterTags,
  onToggleFilterTag,
  onClearFilters,
  sortBy,
  onSortChange,
}: Props) {
  const { tags } = useTags()

  const filter = useDisclosure()
  const sort = useDisclosure()

  const filterRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useClickOutside(filterRef, filter.close, filter.isOpen)
  useClickOutside(sortRef, sort.close, sort.isOpen)
  useEscapeKey(filter.close, filter.isOpen)
  useEscapeKey(sort.close, sort.isOpen)

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

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortBy)?.label || 'Sort'

  return (
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
          className={`${filter.isOpen ? 'open' : ''} ${
            filterTags.length ? 'active' : ''
          }`}
          onClick={() => {
            filter.toggle()
            sort.close()
          }}
        >
          <FontAwesomeIcon icon={faFilter} />
          Filter
          {filterTags.length > 0 && (
            <span className="badge">{filterTags.length}</span>
          )}
        </ToolButton>

        {filter.isOpen && (
          <DropdownMenu
            title="Filter by tag"
            emptyLabel="No tags yet"
            action={
              filterTags.length > 0 ? (
                <button onClick={onClearFilters}>Clear</button>
              ) : undefined
            }
            items={(tags ?? []).map((tag) => ({
              key: String(tag.id),
              label: tag.name,
              selected: filterTags.includes(tag.name),
              swatchColor: getTagHex(tag.color),
              onClick: () => onToggleFilterTag(tag.name),
            }))}
          />
        )}
      </ToolButtonWrapper>

      <ToolButtonWrapper ref={sortRef}>
        <ToolButton
          className={`${sort.isOpen ? 'open' : ''} ${
            sortBy !== 'manual' ? 'active' : ''
          }`}
          onClick={() => {
            sort.toggle()
            filter.close()
          }}
        >
          <FontAwesomeIcon icon={faArrowUpWideShort} />
          {sortBy === 'manual' ? 'Sort' : activeSortLabel}
        </ToolButton>

        {sort.isOpen && (
          <DropdownMenu
            title="Sort tasks"
            items={SORT_OPTIONS.map((option) => ({
              key: option.key,
              label: option.label,
              selected: option.key === sortBy,
              onClick: () => {
                onSortChange(option.key)
                sort.close()
              },
            }))}
          />
        )}
      </ToolButtonWrapper>
    </Toolbar>
  )
}
