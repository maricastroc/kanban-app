/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

interface SubtaskUpdateData {
  id: string
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
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id.toString()
  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'PUT') {
    const {
      taskId,
      subtasks,
    }: { taskId: string; subtasks: SubtaskUpdateData[] } = req.body

    if (!taskId || !subtasks || subtasks.length === 0) {
      return res.status(400).json({
        message: 'Task ID and subtasks with updated order are required',
      })
    }

    try {
      // Verificar se a task existe
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      // Atualiza a ordem das subtasks
      for (const subtask of subtasks) {
        const { id, order } = subtask

        await prisma.subtask.update({
          where: { id },
          data: { order },
        })
      }

      return res
        .status(200)
        .json({ message: 'Subtasks reordered successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
