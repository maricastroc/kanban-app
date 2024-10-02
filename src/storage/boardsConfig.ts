import { BOARDS_STORAGE, BOARD_ACTIVE_STORAGE } from './storageConfig'
import { boards } from '@/data/data'
import { BoardProps } from '@/@types/board'

function getParsedBoards(
  storageKey: string,
  defaultValue: BoardProps[] | BoardProps,
) {
  const savedData = localStorage.getItem(storageKey)
  try {
    return savedData ? JSON.parse(savedData) : defaultValue
  } catch (e) {
    console.error('Error parsing storage data.', e)
    return defaultValue
  }
}

export function saveStorageBoards(boards: BoardProps[]) {
  localStorage.setItem(BOARDS_STORAGE, JSON.stringify(boards))
}

export function saveStorageActiveBoard(board: BoardProps) {
  localStorage.setItem(BOARD_ACTIVE_STORAGE, JSON.stringify(board))
}

export function getStorageBoards() {
  return getParsedBoards(BOARDS_STORAGE, boards)
}

export function getActiveStorageBoard() {
  return getParsedBoards(BOARD_ACTIVE_STORAGE, boards[0])
}

export function getFirstStorageBoard() {
  const savedBoards = getParsedBoards(BOARDS_STORAGE, boards)
  return savedBoards[0]
}
