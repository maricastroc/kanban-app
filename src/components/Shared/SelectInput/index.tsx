/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import {
  Trigger,
  Viewport,
  Icon,
  Content,
  ScrollDownButton,
  ScrollUpButton,
  Group,
  SelectItemStyled,
  ItemText,
  Circle,
  Value,
} from './styles'
import { TagProps } from '@/@types/tag'

export const tagColors = [
  { color: '#49C4E5', name: 'Aqua Blue' },
  { color: '#8471F2', name: 'Lavender' },
  { color: '#67E2AE', name: 'Mint Green' },
  { color: '#e5a449', name: 'Golden Yellow' },
  { color: '#4875b7', name: 'Blue' },
  { color: '#b57474', name: 'Rose Red' },
  { color: '#f8a5d7', name: 'Soft Pink' },
  { color: '#ce524e', name: 'Vivid Red' },
]

interface SelectInputProps {
  placeholder: string
  onSelect: (value: string) => void
  defaultValue?: string | null
  currentTags: TagProps[] | undefined
}

export const SelectInput = ({
  placeholder,
  defaultValue = null,
  currentTags,
  onSelect,
}: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || '')

  const [availableColors, setAvailableColors] = useState<
    { color: string; name: string }[]
  >([])

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    onSelect(value)
  }

  useEffect(() => {
    if (currentTags) {
      const availableColors = tagColors.filter(
        (color) =>
          !currentTags?.some((t) => t.color === color.name) ||
          (defaultValue && defaultValue === color.name),
      )

      setAvailableColors(availableColors)
    }
  }, [currentTags, defaultValue])

  return (
    <Select.Root
      required
      defaultValue={defaultValue || undefined}
      value={selectedValue}
      onValueChange={handleValueChange}
    >
      <Trigger aria-label="Category">
        <Value placeholder={placeholder}>
          {selectedValue && (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Circle
                className="title"
                color={
                  tagColors.find((tag) => tag.name === selectedValue)?.color ||
                  '#000'
                }
              />
              {selectedValue}
            </div>
          )}
        </Value>
        <Icon>
          <ChevronDownIcon />
        </Icon>
      </Trigger>

      <Select.Portal>
        <Content position="popper" style={{ zIndex: 10000 }}>
          <ScrollUpButton>
            <ChevronUpIcon />
          </ScrollUpButton>

          <Viewport>
            <Group>
              {availableColors && availableColors?.length > 0 ? (
                availableColors?.map((item, index) => (
                  <SelectItem key={index} value={item.name} color={item.color}>
                    {item.name}
                  </SelectItem>
                ))
              ) : (
                <div
                  style={{
                    padding: '0.5rem',
                    textAlign: 'center',
                    color: '#888',
                  }}
                >
                  No colors available
                </div>
              )}
            </Group>
          </Viewport>

          <ScrollDownButton>
            <ChevronDownIcon />
          </ScrollDownButton>
        </Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef(
  (
    {
      children,
      value,
      color,
      disabled,
      ...props
    }: {
      children: React.ReactNode
      value: string
      color: string
      disabled?: boolean
    },
    ref: React.Ref<HTMLDivElement>,
  ) => (
    <SelectItemStyled ref={ref} value={value} disabled={disabled} {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
        <Circle color={color} />
        <ItemText>{value}</ItemText>
      </div>
      {disabled && <span>Already used</span>}
    </SelectItemStyled>
  ),
)

SelectItem.displayName = 'SelectItem'
