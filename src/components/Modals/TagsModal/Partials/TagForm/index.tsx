/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { InputContainer } from '@/components/Shared/InputContainer'
import { Button } from '@/components/Shared/Button'
import { FormContainer, SelectWrapper } from './styles'
import { CustomInput } from '@/components/Shared/Input'
import { CustomLabel } from '@/components/Shared/Label'
import { ErrorMessage } from '@/components/Shared/ErrorMessage'
import { SelectInput } from '@/components/Shared/SelectInput'

import { api } from '@/lib/axios'
import { handleApiError } from '@/utils/handleApiError'
import toast from 'react-hot-toast'
import { TagProps } from '@/@types/tag'
import { KeyedMutator } from 'swr'
import { AxiosResponse } from 'axios'
import { useBoardsContext } from '@/contexts/BoardsContext'

const tagSchema = z.object({
  id: z.number().or(z.string()).nullable(),
  name: z.string().min(3, { message: 'Name is required' }),
  color: z.string().min(3, { message: 'Color is required' }),
})

type FormData = z.infer<typeof tagSchema>

interface Props {
  currentTags: TagProps[] | undefined
  isSubmitting: boolean
  isEdit?: boolean
  tag?: TagProps
  onClose: () => void
  handleIsSubmitting: (value: boolean) => void
  tagsMutate: KeyedMutator<AxiosResponse<{ tags: TagProps[] }, any>>
}

export function TagForm({
  tag,
  currentTags,
  isSubmitting,
  isEdit = false,
  tagsMutate,
  onClose,
  handleIsSubmitting,
}: Props) {
  const { activeBoardMutate } = useBoardsContext()

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || '',
      color: tag?.color || '',
      id: tag?.id || null,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      handleIsSubmitting(true)

      const response = isEdit
        ? await api.put(`/tags/${data.id}`, {
            name: data.name,
            color: data.color,
          })
        : await api.post('/tags', { name: data.name, color: data.color })

      toast.success(response.data.message)
      reset()
      tagsMutate()
      activeBoardMutate()

      setTimeout(onClose, 500)
    } catch (error) {
      handleApiError(error)
    } finally {
      handleIsSubmitting(false)
    }
  }

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <InputContainer>
        <CustomLabel htmlFor="name">Name</CustomLabel>
        <CustomInput
          isTransparent
          hasError={!!errors?.name}
          placeholder="e.g. Feature"
          {...register('name')}
        />
        <ErrorMessage message={errors?.name?.message} />
      </InputContainer>

      <SelectWrapper>
        <CustomLabel htmlFor="color">Color</CustomLabel>
        <SelectInput
          placeholder="Select a color"
          currentTags={currentTags}
          defaultValue={tag?.color}
          onSelect={(selectedColor: string) => setValue('color', selectedColor)}
        />
        <ErrorMessage message={errors?.color?.message} />
      </SelectWrapper>

      <Button
        title={isEdit ? 'Save Changes' : 'Add New Tag'}
        type="submit"
        disabled={isSubmitting}
      />

      <div style={{ marginTop: '0.5rem' }}>
        <Button
          title={'Cancel'}
          type="button"
          variant="secondary"
          onClick={() => onClose()}
          disabled={isSubmitting}
        />
      </div>
    </FormContainer>
  )
}
