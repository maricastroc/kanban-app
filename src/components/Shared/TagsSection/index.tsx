import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTags } from '@fortawesome/free-solid-svg-icons'
import {
  Chip,
  ChipCheck,
  ChipDot,
  ChipsWrap,
  Empty,
  TagsContainer,
  TagsHeader,
  TagsHint,
  TagsLabel,
} from './styles'
import { TagProps } from '@/@types/tag'
import { TaskTagProps } from '@/@types/task-tag'
import { getTagHex } from '@/utils/getTagHex'
import useRequest from '@/utils/useRequest'

interface Props {
  taskTags?: TaskTagProps[]
  onCheckedClick: (tag: TagProps) => void
  onUncheckedClick: (tag: TagProps) => void
}

export const TagsSection = ({
  taskTags,
  onCheckedClick,
  onUncheckedClick,
}: Props) => {
  const { data } = useRequest<{
    tags: TagProps[]
  }>({
    url: '/tags',
    method: 'GET',
  })

  const tags = data?.tags

  const isTagChecked = (id: string) =>
    taskTags?.some((tag) => String(tag.id) === String(id))

  const handleClick = (tag: TagProps, isChecked: boolean) => {
    if (isChecked) {
      onCheckedClick(tag)
    } else {
      onUncheckedClick(tag)
    }
  }

  return (
    <TagsContainer>
      <TagsHeader>
        <TagsLabel>
          <FontAwesomeIcon icon={faTags} />
          Tags
        </TagsLabel>
        <TagsHint>Choose one or more labels for this task.</TagsHint>
      </TagsHeader>

      {tags && tags.length > 0 ? (
        <ChipsWrap>
          {tags.map((item) => {
            const isChecked = isTagChecked(item.id as string) || false
            const tagColor = getTagHex(item.color)

            return (
              <Chip
                key={item.id}
                type="button"
                $color={tagColor}
                $checked={isChecked}
                aria-pressed={isChecked}
                onClick={() => handleClick(item, isChecked)}
              >
                {isChecked ? (
                  <ChipCheck>
                    <FontAwesomeIcon icon={faCheck} />
                  </ChipCheck>
                ) : (
                  <ChipDot $color={tagColor} />
                )}
                {item.name}
              </Chip>
            )
          })}
        </ChipsWrap>
      ) : (
        <Empty>No tags available.</Empty>
      )}
    </TagsContainer>
  )
}
