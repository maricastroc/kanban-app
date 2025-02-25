/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import { SubtaskProps } from '@/@types/subtask'

interface TaskUpdateData {
  title?: string
  description?: string | null
  order?: number
  columnId?: string
  subtasks?: SubtaskProps[]
  dueDate?: string | null
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

  if (req.method === 'PUT') {
    const {
      taskId,
      title,
      description,
      order,
      columnId,
      subtasks,
      dueDate,
    }: TaskUpdateData & { taskId: string } = req.body

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    try {
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { subtasks: true },
      })

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' })
      }

      let updatedOrder = order

      if (columnId && columnId !== existingTask.columnId) {
        const newColumnTaskCount = await prisma.task.count({
          where: { columnId },
        })
        updatedOrder = newColumnTaskCount + 1
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          title,
          description,
          order: updatedOrder,
          columnId,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      })

      if (subtasks) {
        await prisma.subtask.deleteMany({
          where: { taskId },
        })

        const newSubtasks = subtasks.map((subtask, index) => ({
          title: subtask.title,
          order: index + 1,
          isCompleted: subtask.isCompleted,
          taskId,
        }))

        if (newSubtasks.length > 0) {
          await prisma.subtask.createMany({ data: newSubtasks })
        }
      }

      return res
        .status(200)
        .json({ message: 'Task updated successfully', task: updatedTask })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
