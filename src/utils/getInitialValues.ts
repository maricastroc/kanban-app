import { v4 as uuidv4 } from 'uuid'

export const initialBoardColumns = [
  {
    id: uuidv4(),
    name: 'Todo',
    tasks: [],
  },
  {
    id: uuidv4(),
    name: 'Doing',
    tasks: [],
  },
]

export const initialSubtasks = [
  {
    id: uuidv4(),
    name: '',
    is_completed: false,
    order: 1,
  },
]
