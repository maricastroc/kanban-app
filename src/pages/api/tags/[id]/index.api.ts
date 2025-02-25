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

  const userId = session.user.id

  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'DELETE') {
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
