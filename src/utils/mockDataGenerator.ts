import { BoardProps } from '@/@types/board'
import { BoardColumnProps } from '@/@types/board-column'
import { TaskProps } from '@/@types/task'

const TASK_NAMES = [
  'Implement authentication flow',
  'Fix mobile layout bug',
  'Write unit tests',
  'Update API documentation',
  'Refactor state management',
  'Design new dashboard',
  'Add pagination support',
  'Optimize database queries',
  'Setup CI/CD pipeline',
  'Code review session',
  'Deploy to production',
  'Update dependencies',
  'Write integration tests',
  'Fix performance issue',
  'Add dark mode support',
  'Implement search feature',
  'Add export functionality',
  'Fix CORS issues',
  'Update user documentation',
  'Implement notifications',
]

function generateTask(index: number, columnId: string): TaskProps {
  return {
    id: `mock-${columnId}-${index}`,
    name: `${TASK_NAMES[index % TASK_NAMES.length]} #${index + 1}`,
    description: `Mock task ${index + 1} for performance testing.`,
    status: 'pending',
    subtasks:
      index % 3 === 0
        ? [
            { id: `sub-${index}-1`, name: 'Subtask A', is_completed: true },
            { id: `sub-${index}-2`, name: 'Subtask B', is_completed: false },
          ]
        : [],
    tags: [],
    order: index,
  }
}

function generateColumn(index: number, taskCount: number): BoardColumnProps {
  const names = ['Todo', 'In Progress', 'Done']
  const columnId = `mock-col-${index}`
  return {
    id: columnId,
    name: names[index] ?? `Column ${index + 1}`,
    tasks: Array.from({ length: taskCount }, (_, i) =>
      generateTask(i, columnId),
    ),
  }
}

export function generateMockBoard(totalTaskCount: number): BoardProps {
  const columnCount = 3
  const base = Math.floor(totalTaskCount / columnCount)
  const remainder = totalTaskCount % columnCount
  return {
    id: 'mock-board',
    name: `Scale Test — ${totalTaskCount} tasks`,
    columns: Array.from({ length: columnCount }, (_, i) =>
      generateColumn(i, i === 0 ? base + remainder : base),
    ),
  }
}
