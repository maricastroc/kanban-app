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
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user.id.toString()
  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'PUT') {
    const { taskId, newOrder }: { taskId: string; newOrder: number } = req.body

    if (!taskId || newOrder === undefined) {
      return res
        .status(400)
        .json({ message: 'Task ID and newOrder are required' })
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      const columnId = task.columnId
      const oldOrder = task.order

      if (oldOrder === newOrder) {
        return res.status(200).json({ message: 'No changes needed' })
      }

      if (oldOrder < newOrder) {
        await prisma.task.updateMany({
          where: {
            columnId,
            order: { gt: oldOrder, lte: newOrder },
          },
          data: {
            order: { decrement: 1 },
          },
        })
      } else {
        await prisma.task.updateMany({
          where: {
            columnId,
            order: { gte: newOrder, lt: oldOrder },
          },
          data: {
            order: { increment: 1 },
          },
        })
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          order: newOrder,
        },
      })

      return res
        .status(200)
        .json({ message: 'Tasks reordered successfully', task: updatedTask })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
