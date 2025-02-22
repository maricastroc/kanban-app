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

  const userId = session.user?.id?.toString()

  if (!userId) {
    return res.status(401).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'PUT') {
    try {
      const { boardId } = req.body

      if (!boardId) {
        return res.status(400).json({ message: 'Board ID is required' })
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.board.updateMany({
          where: { userId },
          data: { isActive: false },
        })

        await prisma.board.update({
          where: { id: boardId, userId },
          data: { isActive: true },
        })
      })

      return res.status(200).json({ message: 'Board set as active' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).end()
  }
}
