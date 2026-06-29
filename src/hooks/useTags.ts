import useRequest from '@/utils/useRequest'
import { TagProps } from '@/@types/tag'

// stable reference — prevents useRequest from creating a new SWR key on every render
const TAGS_REQUEST = { url: '/tags', method: 'GET' }

/**
 * Single source for the workspace tags list. SWR dedupes by key, so multiple
 * consumers share one request and one cache entry.
 */
export function useTags() {
  const { data, mutate, isValidating } = useRequest<{ tags: TagProps[] }>(
    TAGS_REQUEST,
  )

  return { tags: data?.tags ?? null, mutate, isValidating }
}
