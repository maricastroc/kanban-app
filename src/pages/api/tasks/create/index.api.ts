import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

interface Subtask {
  title: string
  order: number
}

interface Task {
  title: string
  description: string | null
  subtasks: Subtask[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(400).json({ message: 'Unauthorized' })
  }

  const userId = session?.user?.id?.toString()

  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'POST') {
    const { boardId, columnId, title, description, subtasks }: { boardId: string, columnId: string, title: string, description: string | null, subtasks: Subtask[] } = req.body

    if (!boardId || !columnId || !title || !subtasks) {
      return res.status(400).json({ message: 'BoardId, columnId, title, and subtasks are required' })
    }

    try {
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { columns: true },
      })

      if (!board) {
        return res.status(404).json({ message: 'Board not found' })
      }

      const column = board.columns.find(col => col.id === columnId)
      if (!column) {
        return res.status(404).json({ message: 'Column not found' })
      }

      const taskCount = await prisma.task.count({
        where: { columnId: columnId },
      })

      const createdTask = await prisma.task.create({
        data: {
          title: title,
          description: description,
          order: taskCount + 1,
          columnId: columnId,
        },
      })

      const subtasksData = subtasks.map((subtask, index) => ({
        title: subtask.title,
        order: index + 1,
        taskId: createdTask.id,
      }))

      if (subtasksData.length > 0) {
        await prisma.subtask.createMany({
          data: subtasksData,
        })
      }

      return res.status(200).json({ message: 'Task and subtasks created successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).end()
  }
}
