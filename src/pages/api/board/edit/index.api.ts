/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

const updateBoardSchema = z.object({
  name: z.string().min(3, 'Board name is required').optional(),
  columns: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(3, 'Column name is required'),
      }),
    )
    .optional(),
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
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user?.id?.toString()

  if (!userId) {
    return res.status(401).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'PUT') {
    try {
      const { boardId } = req.body

      if (!boardId || typeof boardId !== 'string') {
        return res.status(400).json({ message: 'Invalid board ID' })
      }

      const parsedBody = await updateBoardSchema.parseAsync(req.body)
      const { name, columns } = parsedBody

      const existingBoard = await prisma.board.findUnique({
        where: { id: boardId, userId },
        include: { columns: true },
      })

      if (!existingBoard) {
        return res.status(404).json({ message: 'Board not found' })
      }

      const existingColumnIds = existingBoard.columns.map((col) => col.id)
      const receivedColumnIds =
        columns?.map((col) => col.id).filter(Boolean) || []

      await prisma.$transaction(async (prisma) => {
        if (name) {
          await prisma.board.update({
            where: { id: boardId },
            data: { name },
          })
        }

        if (columns) {
          for (const column of columns) {
            await prisma.column.upsert({
              where: { id: column.id || '' },
              update: { name: column.name },
              create: { name: column.name, boardId },
            })
          }

          const columnsToDelete = existingColumnIds.filter(
            (id) => !receivedColumnIds.includes(id),
          )
          if (columnsToDelete.length > 0) {
            await prisma.column.deleteMany({
              where: { id: { in: columnsToDelete } },
            })
          }
        }
      })

      const updatedBoard = await prisma.board.findUnique({
        where: { id: boardId },
        include: { columns: true },
      })

      return res.status(200).json({
        board: updatedBoard,
        message: 'Board successfully updated!',
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
