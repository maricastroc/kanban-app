/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

interface Subtask {
  title: string
  order: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
    const {
      boardId,
      columnId,
      title,
      status,
      description,
      subtasks,
      dueDate, // Adicionado o campo opcional
    }: {
      boardId: string
      columnId: string
      title: string
      status: string
      description: string | null
      subtasks: Subtask[]
      dueDate?: string // Definido como opcional
    } = req.body

    if (!boardId || !columnId || !title || !subtasks || !status) {
      return res.status(400).json({
        message: 'BoardId, columnId, title, status and subtasks are required',
      })
    }

    // Validação opcional da data (se fornecida)
    let formattedDueDate: Date | null = null
    if (dueDate) {
      const parsedDate = new Date(dueDate)
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid dueDate format' })
      }
      formattedDueDate = parsedDate
    }

    try {
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { columns: true },
      })

      if (!board) {
        return res.status(404).json({ message: 'Board not found' })
      }

      const column = board.columns.find((col) => col.id === columnId)
      if (!column) {
        return res.status(404).json({ message: 'Column not found' })
      }

      const taskCount = await prisma.task.count({
        where: { columnId },
      })

      const createdTask = await prisma.task.create({
        data: {
          title,
          description,
          status,
          order: taskCount + 1,
          columnId,
          dueDate: formattedDueDate, // Salva a data, se fornecida
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

      return res
        .status(200)
        .json({ message: 'Task and subtasks created successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).end()
  }
}
