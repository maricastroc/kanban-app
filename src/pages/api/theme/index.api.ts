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
    return res.status(400).json({ message: 'Unauthorized' })
  }

  const userId = session?.user?.id?.toString()

  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'GET') {
    try {
      const theme = await prisma.theme.findUnique({
        where: { userId },
      })

      if (!theme) {
        return res.status(404).json({ theme: undefined })
      }

      return res.status(200).json({ theme })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    const { isDarkMode = true }: { isDarkMode: boolean } = req.body

    try {
      const existingTheme = await prisma.theme.findUnique({
        where: { userId },
      })

      if (existingTheme) {
        const updatedTheme = await prisma.theme.update({
          where: { userId },
          data: { isDarkMode },
        })

        return res.status(200).json({
          message: 'Theme updated successfully',
          theme: updatedTheme,
        })
      } else {
        await prisma.theme.create({
          data: {
            userId,
            isDarkMode,
          },
        })
        return res.status(201).json({ message: 'Theme created successfully' })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).end()
  }
}
