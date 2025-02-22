/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

interface TaskUpdateData {
  taskId: string
  subtaskId: string
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
    const { taskId, subtaskId }: TaskUpdateData = req.body

    if (!taskId || !subtaskId) {
      return res.status(400).json({ message: 'Task ID and Subtask ID are required' })
    }

    try {
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { subtasks: true },
      })

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' })
      }

      // Encontra a subtask com o ID especificado
      const existingSubtask = existingTask.subtasks.find(
        (sub) => sub.id === subtaskId
      )

      if (!existingSubtask) {
        return res.status(404).json({ message: 'Subtask not found' })
      }

      // Inverte o valor de isCompleted
      const updatedIsCompleted = !existingSubtask.isCompleted

      // Atualiza o campo isCompleted da subtask
      await prisma.subtask.update({
        where: { id: subtaskId },
        data: {
          isCompleted: updatedIsCompleted,
        },
      })

      return res
        .status(200)
        .json({ message: 'Subtask isCompleted updated successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
