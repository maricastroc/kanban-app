/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import { TagProps } from '@/@types/tag'
import { SubtaskProps } from '@/@types/subtask'

interface TaskUpdateData {
  title?: string
  description?: string | null
  order?: number
  columnId?: string
  subtasks?: SubtaskProps[]
  dueDate?: string | null
  tags?: TagProps[] // Adicionando tags ao corpo da requisição
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

  if (req.method === 'PUT') {
    const {
      taskId,
      title,
      description,
      order,
      columnId,
      subtasks,
      dueDate,
      tags,
    }: TaskUpdateData & { taskId: string } = req.body

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' })
    }

    try {
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { subtasks: true, tags: true },
      })

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' })
      }

      let updatedOrder = order

      if (columnId && columnId !== existingTask.columnId) {
        const newColumnTaskCount = await prisma.task.count({
          where: { columnId },
        })
        updatedOrder = newColumnTaskCount + 1
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          title,
          description,
          order: updatedOrder,
          columnId,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      })

      if (subtasks) {
        await prisma.subtask.deleteMany({
          where: { taskId },
        })

        const newSubtasks = subtasks.map((subtask, index) => ({
          name: subtask.name,
          order: index + 1,
          is_completed: subtask.is_completed,
          taskId,
        }))

        if (newSubtasks.length > 0) {
          await prisma.subtask.createMany({ data: newSubtasks })
        }
      }

      if (tags) {
        const tagNames = tags.map((tag) => tag.name)

        const existingTags = await prisma.tag.findMany({
          where: {
            userId,
            name: {
              in: tagNames,
            },
          },
        })

        const taskTagsData = existingTags.map((tag) => ({
          taskId,
          tagId: tag.id,
        }))

        await prisma.taskTag.deleteMany({
          where: { taskId },
        })

        if (taskTagsData.length > 0) {
          await prisma.taskTag.createMany({
            data: taskTagsData,
          })
        }
      }

      return res.status(200).json({
        message: 'Task and tags updated successfully',
        task: updatedTask,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
