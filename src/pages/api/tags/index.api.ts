import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

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

  const userId = session.user.id

  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'POST') {
    const { id, name, color }: { id?: string; name: string; color: string } =
      req.body

    if (!name || !color) {
      return res.status(400).json({ message: 'Name and color are required' })
    }

    try {
      if (id) {
        // Edição de tag
        const existingTag = await prisma.tag.findUnique({
          where: { id },
        })

        if (!existingTag) {
          return res.status(404).json({ message: 'Tag not found' })
        }

        const duplicateTag = await prisma.tag.findFirst({
          where: {
            name,
            userId: existingTag.userId,
            NOT: {
              id,
            },
          },
        })

        if (duplicateTag) {
          return res
            .status(400)
            .json({ message: 'A tag with this name already exists' })
        }

        const updatedTag = await prisma.tag.update({
          where: { id },
          data: {
            name,
            color,
          },
        })

        return res
          .status(200)
          .json({ message: 'Tag updated successfully', tag: updatedTag })
      } else {
        const existingTag = await prisma.tag.findFirst({
          where: {
            name,
            userId: String(userId),
          },
        })

        if (existingTag) {
          return res
            .status(400)
            .json({ message: 'A tag with this name already exists' })
        }

        const newTag = await prisma.tag.create({
          data: {
            name,
            color,
            userId: String(userId),
          },
        })

        return res
          .status(201)
          .json({ message: 'Tag created successfully', tag: newTag })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      const tags = await prisma.tag.findMany({
        where: { userId: String(userId) },
      })

      return res.status(200).json([tags])
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Tag ID is required' })
    }

    try {
      const existingTag = await prisma.tag.findUnique({
        where: { id },
      })

      if (!existingTag) {
        return res.status(404).json({ message: 'Tag not found' })
      }

      // Deleta a tag
      await prisma.tag.delete({
        where: { id },
      })

      return res.status(200).json({ message: 'Tag deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).end()
  }
}
