import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faPen,
  faPlus,
  faTag,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

import {
  Body,
  CloseBtn,
  Composer,
  ComposerActions,
  ComposerButtons,
  ComposerHint,
  ComposerInput,
  EmptyState,
  HeaderActions,
  HeaderIcon,
  HeaderTitles,
  IconBtn,
  RowActions,
  SearchBar,
  SheetHeader,
  SheetSubtitle,
  SheetTitle,
  Swatch,
  SwatchOption,
  SwatchPicker,
  TagInfo,
  TagList,
  TagMeta,
  TagName,
  TagRow,
} from './styles'
import { BaseModal } from '../BaseModal'
import { Button } from '@/components/Core/Button'
import { tagColors } from '@/utils/constants'
import { getTagHex } from '@/utils/getTagHex'
import { TagProps } from '@/@types/tag'
import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import { useBoardsContext } from '@/contexts/BoardsContext'

interface Props {
  onClose: () => void
  onDeleteTag: (tag: TagProps) => void
  tagsMutate: () => void
  tags: TagProps[] | null
}

const MIN_NAME_LENGTH = 3
const SEARCH_THRESHOLD = 8

export function TagsModal({ onClose, tags, onDeleteTag, tagsMutate }: Props) {
  const { activeBoard, activeBoardMutate } = useBoardsContext()

  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [editOriginalColor, setEditOriginalColor] = useState('')
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [query, setQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // per-tag usage across the active board (no API change needed)
  const usage = useMemo(() => {
    const map: Record<string, number> = {}
    activeBoard?.columns?.forEach((col) =>
      col.tasks?.forEach((task) =>
        task.tags?.forEach((t) => {
          const key = String(t.id)
          map[key] = (map[key] || 0) + 1
        }),
      ),
    )
    return map
  }, [activeBoard])

  const usedColors = useMemo(
    () => new Set((tags || []).map((t) => t.color)),
    [tags],
  )

  const resetComposer = () => {
    setCreating(false)
    setEditingId(null)
    setEditOriginalColor('')
    setName('')
    setColor('')
  }

  const startCreate = () => {
    const firstFree = tagColors.find((c) => !usedColors.has(c.name))
    setEditingId(null)
    setCreating(true)
    setName('')
    setColor(firstFree?.name || '')
  }

  const startEdit = (tag: TagProps) => {
    setCreating(false)
    setEditingId(tag.id)
    setEditOriginalColor(tag.color)
    setName(tag.name)
    setColor(tag.color)
  }

  const isColorAvailable = (colorName: string) =>
    !usedColors.has(colorName) || colorName === editOriginalColor

  const canSubmit = name.trim().length >= MIN_NAME_LENGTH && !!color

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return

    try {
      setSubmitting(true)

      if (editingId !== null) {
        await api.put(`/tags/${editingId}`, { name: name.trim(), color })
        toast.success('Tag updated.')
      } else {
        await api.post('/tags', { name: name.trim(), color })
        toast.success('Tag created.')
      }

      tagsMutate()
      activeBoardMutate()
      resetComposer()
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      resetComposer()
    }
  }

  const renderComposer = (submitLabel: string) => {
    const noColors = tagColors.every((c) => !isColorAvailable(c.name))

    return (
      <Composer onKeyDown={handleKeyDown}>
        <ComposerInput
          autoFocus
          value={name}
          placeholder="Label name"
          onChange={(e) => setName(e.target.value)}
        />
        <SwatchPicker>
          {tagColors.map((c) => (
            <SwatchOption
              key={c.name}
              type="button"
              title={isColorAvailable(c.name) ? c.name : `${c.name} · in use`}
              $color={c.color}
              $selected={color === c.name}
              disabled={!isColorAvailable(c.name)}
              onClick={() => setColor(c.name)}
            />
          ))}
        </SwatchPicker>
        <ComposerActions>
          {noColors ? (
            <ComposerHint>All colors are in use.</ComposerHint>
          ) : (
            <ComposerHint>
              {name.trim().length < MIN_NAME_LENGTH
                ? `At least ${MIN_NAME_LENGTH} characters`
                : 'Press Enter to save'}
            </ComposerHint>
          )}
          <ComposerButtons>
            <Button
              variant="secondary"
              size="sm"
              fullWidth={false}
              type="button"
              onClick={resetComposer}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              fullWidth={false}
              type="button"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </ComposerButtons>
        </ComposerActions>
      </Composer>
    )
  }

  const tagCount = tags?.length || 0
  const showSearch = tagCount > SEARCH_THRESHOLD

  const filteredTags =
    showSearch && query.trim()
      ? (tags || []).filter((t) =>
          t.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : tags || []

  return (
    <BaseModal
      isLoading={submitting}
      hasHeader={false}
      padding="0"
      maxHeight="85vh"
      onClose={onClose}
    >
      <SheetHeader>
        <HeaderIcon>
          <FontAwesomeIcon icon={faTag} />
        </HeaderIcon>
        <HeaderTitles>
          <SheetTitle>Labels</SheetTitle>
          <SheetSubtitle>
            {tagCount > 0
              ? `${tagCount} ${
                  tagCount === 1 ? 'label' : 'labels'
                } in this workspace`
              : 'Organize the labels used across this workspace'}
          </SheetSubtitle>
        </HeaderTitles>
        <HeaderActions>
          <Button
            variant="secondary"
            size="sm"
            fullWidth={false}
            type="button"
            onClick={startCreate}
          >
            <FontAwesomeIcon icon={faPlus} />
            New label
          </Button>
          <CloseBtn onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </CloseBtn>
        </HeaderActions>
      </SheetHeader>

      <Body>
        {showSearch && (
          <SearchBar>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              value={query}
              placeholder="Search labels…"
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchBar>
        )}

        {creating && renderComposer('Create label')}

        {tagCount > 0 ? (
          <TagList>
            {filteredTags.map((tag) => {
              if (tag.id === editingId) {
                return <div key={String(tag.id)}>{renderComposer('Save')}</div>
              }

              const count = usage[String(tag.id)] || 0

              return (
                <TagRow key={String(tag.id)} $color={getTagHex(tag.color)}>
                  <Swatch $color={getTagHex(tag.color)} />
                  <TagInfo>
                    <TagName>{tag.name}</TagName>
                    <TagMeta>
                      {count === 0
                        ? 'Unused'
                        : `${count} ${count === 1 ? 'task' : 'tasks'}`}
                    </TagMeta>
                  </TagInfo>
                  <RowActions className="row-actions">
                    <IconBtn
                      type="button"
                      aria-label={`Edit ${tag.name}`}
                      onClick={() => startEdit(tag)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </IconBtn>
                    <IconBtn
                      type="button"
                      className="danger"
                      aria-label={`Delete ${tag.name}`}
                      onClick={() => onDeleteTag(tag)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </IconBtn>
                  </RowActions>
                </TagRow>
              )
            })}
          </TagList>
        ) : (
          !creating && (
            <EmptyState>
              <p>No labels yet. Create your first one to get started.</p>
            </EmptyState>
          )
        )}

        {tagCount > 0 && filteredTags.length === 0 && (
          <EmptyState>
            <p>No labels match “{query}”.</p>
          </EmptyState>
        )}
      </Body>
    </BaseModal>
  )
}
