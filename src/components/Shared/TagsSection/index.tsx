import { TagContainer, TagMark, TagName, TagsContainer } from './styles'
import { TagsTitle } from '@/components/Modals/TagsModal/styles'
import { TagProps } from '@/@types/tag'
import { TaskTagProps } from '@/@types/task-tag'
import { CheckInput } from '../../Core/CheckInput'
import { tagColors } from '@/utils/constants'
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

  const getTagColor = (colorName: string) =>
    tagColors.find((tag) => tag.name === colorName)?.color || ''

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
      <TagsTitle>Tags</TagsTitle>
      {tags?.map((item) => {
        const isChecked = isTagChecked(item.id as string) || false
        const tagColor = getTagColor(item.color)

        return (
          <TagContainer key={item.id}>
            <CheckInput
              isChecked={isChecked}
              onClick={() => handleClick(item, isChecked)}
            />
            <TagName>
              <p>{item.name}</p>
              <TagMark color={tagColor} />
            </TagName>
          </TagContainer>
        )
      })}
    </TagsContainer>
  )
}
