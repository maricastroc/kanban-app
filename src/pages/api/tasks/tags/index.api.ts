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
    return res.status(400).json({ message: 'Unauthorized' })
  }

  const userId = session?.user?.id?.toString()

  if (!userId) {
    return res.status(400).json({ message: 'User is not authenticated' })
  }

  if (req.method === 'GET') {
    const { taskId }: { taskId: string } = req.body

    if (!taskId || typeof taskId !== 'string') {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    try {
      const taskWithTags = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      if (!taskWithTags) {
        return res.status(404).json({ message: 'Task not found' })
      }

      const tags = taskWithTags.tags.map((taskTag) => taskTag.tag)

      return res.status(200).json({ tags })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    const { taskId, tagId }: { taskId: string; tagId: string } = req.body

    if (!taskId || !tagId) {
      return res
        .status(400)
        .json({ message: 'Task ID and Tag ID are required' })
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
      })

      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' })
      }

      const taskTag = await prisma.taskTag.create({
        data: {
          taskId,
          tagId,
        },
      })

      return res
        .status(201)
        .json({ message: 'Tag added to task successfully', taskTag })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    const { taskId, tagId }: { taskId: string; tagId: string } = req.body

    if (
      !taskId ||
      typeof taskId !== 'string' ||
      !tagId ||
      typeof tagId !== 'string'
    ) {
      return res
        .status(400)
        .json({ message: 'Task ID and Tag ID must be provided and be strings' })
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      const tag = await prisma.tag.findUnique({
        where: { id: tagId },
      })

      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' })
      }

      const deletedTaskTag = await prisma.taskTag.delete({
        where: {
          taskId_tagId: {
            taskId,
            tagId,
          },
        },
      })

      return res.status(200).json({
        message: 'Tag removed from task successfully',
        deletedTaskTag,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
