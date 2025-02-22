/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

const updateColumnsSchema = z.object({
  boardId: z.string(),
  boardName: z.string().optional(),
  columns: z
    .array(
      z.object({
        id: z.string().optional(),
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
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const userId = session.user?.id?.toString()

  if (!userId) {
    return res.status(401).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'PUT') {
    try {
      const { boardId, boardName, columns } =
        await updateColumnsSchema.parseAsync(req.body)

      const existingBoard = await prisma.board.findUnique({
        where: { id: boardId, userId },
        include: { columns: true },
      })

      if (!existingBoard) {
        return res.status(404).json({ message: 'Board not found' })
      }

      if (boardName) {
        await prisma.board.update({
          where: { id: boardId },
          data: { name: boardName },
        })
      }

      const existingColumnIds = existingBoard.columns.map((col) => col.id)

      await prisma.$transaction(async (prisma) => {
        for (const column of columns) {
          if (column.id) {
            const existingColumn = await prisma.column.findUnique({
              where: { id: column.id },
            })

            if (!existingColumn || existingColumn.boardId !== boardId) {
              await prisma.column.create({
                data: { name: column.name, boardId },
              })
            } else {
              await prisma.column.update({
                where: { id: column.id },
                data: { name: column.name },
              })
            }
          } else {
            await prisma.column.create({
              data: { name: column.name, boardId },
            })
          }
        }

        const receivedColumnIds = columns
          .map((col) => col.id)
          .filter(Boolean) as string[]
        const columnsToDelete = existingColumnIds.filter(
          (id) => !receivedColumnIds.includes(id),
        )

        if (columnsToDelete.length > 0) {
          await prisma.column.deleteMany({
            where: { id: { in: columnsToDelete } },
          })
        }
      })

      const updatedBoard = await prisma.board.findUnique({
        where: { id: boardId },
        include: { columns: true },
      })

      return res.status(200).json({
        board: updatedBoard,
        message: 'Board columns updated successfully!',
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
