import { useState } from 'react'

import { TagProps } from '@/@types/tag'
import useRequest from '@/utils/useRequest'
import { BaseModal } from '../BaseModal'
import { TagForm } from './Partials/TagForm'

interface Props {
  onClose: () => void
  selectedTag: TagProps | null
}

export function EditTagModal({ onClose, selectedTag }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const { data, mutate: tagsMutate } = useRequest<{
    tags: TagProps[]
  }>({
    url: '/tags',
    method: 'GET',
  })

  return (
    <BaseModal
      isLoading={isLoading}
      title="Edit Tags"
      height="auto"
      onClose={onClose}
    >
      <TagForm
        currentTags={data?.tags}
        tagsMutate={tagsMutate}
        isSubmitting={isLoading}
        handleIsSubmitting={(value: boolean) => setIsLoading(value)}
        onClose={onClose}
        isEdit={!!selectedTag}
        tag={selectedTag || undefined}
      />
    </BaseModal>
  )
}
