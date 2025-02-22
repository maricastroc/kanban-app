/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

const createBoardSchema = z.object({
  name: z.string().min(3, 'Board name is required'),
  columns: z
    .array(
      z.object({
        name: z.string().min(3, 'Column name is required'),
      }),
    )
    .min(1, 'At least one column is required'),
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

  if (req.method === 'POST') {
    try {
      const parsedBody = await createBoardSchema.parseAsync(req.body)
      const { name, columns } = parsedBody

      if (!columns || columns.length === 0) {
        return res
          .status(400)
          .json({ message: 'Columns data is invalid or missing' })
      }

      const result = await prisma.$transaction(async (prisma) => {
        await prisma.board.updateMany({
          where: { userId, isActive: true },
          data: { isActive: false },
        })

        const newBoard = await prisma.board.create({
          data: {
            name,
            userId,
            isActive: true,
            columns: {
              create: columns.map((column) => ({
                name: column.name,
              })),
            },
          },
          include: {
            columns: true,
          },
        })

        return newBoard
      })

      return res.status(200).json({
        board: result,
        message: 'Board successfully created!',
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
