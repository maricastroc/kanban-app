import { BoardDTO } from '../dtos/boardDTO'
import { BOARDS_STORAGE, BOARD_ACTIVE_STORAGE } from './storageConfig'
import { boards } from '../data/data'

export function saveStorageBoards(boards: BoardDTO[]) {
  localStorage.setItem(BOARDS_STORAGE, JSON.stringify(boards))
}

export function saveStorageActiveBoard(board: BoardDTO) {
  localStorage.setItem(BOARD_ACTIVE_STORAGE, JSON.stringify(board))
}

export function getStorageBoards() {
  if (typeof localStorage !== 'undefined') {
    const savedData = localStorage.getItem(BOARDS_STORAGE)
    const savedBoards = savedData ? JSON.parse(savedData) : boards
    return savedBoards
  } else {
    return boards
  }
}

export function getActiveStorageBoard() {
  const savedData = localStorage.getItem(BOARD_ACTIVE_STORAGE)
  const savedBoard = savedData ? JSON.parse(savedData) : boards[0]
  return savedBoard
}

export function getFirstStorageBoard() {
  if (typeof localStorage !== 'undefined') {
    const savedData = localStorage.getItem(BOARDS_STORAGE)
    const savedBoards = savedData ? JSON.parse(savedData) : boards

    return savedBoards[0]
  } else {
    return boards[0]
  }
}
