/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

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
      newColumnId,
      newOrder,
    }: { taskId: string; newColumnId: string; newOrder: number } = req.body

    if (!taskId || !newColumnId || newOrder === undefined) {
      return res
        .status(400)
        .json({ message: 'Task ID, newColumnId, and newOrder are required' })
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      const oldColumnId = task.columnId

      if (oldColumnId === newColumnId) {
        return res
          .status(400)
          .json({ message: 'Task is already in this column' })
      }

      // 1️⃣ Ajusta os orders na coluna antiga
      await prisma.task.updateMany({
        where: {
          columnId: oldColumnId,
          order: { gt: task.order },
        },
        data: {
          order: { decrement: 1 },
        },
      })

      // 2️⃣ Ajusta os orders na nova coluna para abrir espaço para a nova task
      await prisma.task.updateMany({
        where: {
          columnId: newColumnId,
          order: { gte: newOrder },
        },
        data: {
          order: { increment: 1 },
        },
      })

      // 3️⃣ Move a task para a nova coluna com o novo order
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          columnId: newColumnId,
          order: newOrder,
        },
      })

      return res
        .status(200)
        .json({ message: 'Task moved successfully', task: updatedTask })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
