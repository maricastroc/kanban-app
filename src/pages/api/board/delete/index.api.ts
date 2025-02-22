import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

const deleteBoardSchema = z.object({
  boardId: z.string().min(1, 'Board ID is required'),
})

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
    try {
      const parsedBody = await deleteBoardSchema.parseAsync(req.body)
      const { boardId } = parsedBody

      const board = await prisma.board.findUnique({
        where: { id: boardId, userId },
      })

      if (!board) {
        return res.status(404).json({ message: 'Board not found' })
      }

      await prisma.board.delete({
        where: { id: boardId },
      })

      return res.status(200).json({
        message: 'Board successfully deleted!',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message })
      }

      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).end()
  }
}
