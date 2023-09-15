import { BoardDTO } from '../dtos/boardDTO'
import { BOARDS_STORAGE } from './storageConfig'
import { boards } from '../data/data'

export function saveStorageBoards(boards: BoardDTO[]) {
  localStorage.setItem(BOARDS_STORAGE, JSON.stringify(boards))
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

export function getFirstStorageBoard() {
  if (typeof localStorage !== 'undefined') {
    const savedData = localStorage.getItem(BOARDS_STORAGE)
    const savedBoards = savedData ? JSON.parse(savedData) : boards

    return savedBoards[0]
  } else {
    return boards[0]
  }
}
