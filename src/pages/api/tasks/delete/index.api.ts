import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

interface TaskDeleteData {
  id: string
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

  if (req.method === 'DELETE') {
    const { id }: TaskDeleteData = req.body

    if (!id) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    try {
      const existingTask = await prisma.task.findUnique({
        where: { id },
      })

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' })
      }

      await prisma.subtask.deleteMany({
        where: { id },
      })

      await prisma.task.delete({
        where: { id },
      })

      return res.status(200).json({ message: 'Task successfully deleted!' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
