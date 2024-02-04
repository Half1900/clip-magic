import { PresetColorKey } from 'ant-design-vue/es/theme/interface'

import { getRandomColor } from '~/utils'

export interface ClipItem {
  id: number
  tagId: number
  date: Date
  title?: string
  content: string
}

export interface Tag {
  id: number
  title: string
  color: `${PresetColorKey}-inverse`
}

export const useClipboard = defineStore(
  'clipboard',
  () => {
    const list = ref<ClipItem[]>([])
    const tags = ref<Tag[]>([{ id: 0, title: '默认', color: 'green-inverse' }])
    const key = reactive({
      itemId: 1,
      tagId: 1
    })
    const firstTag = computed(() => tags.value[0])
    const currTag = reactive<Tag>({
      id: 0,
      title: '',
      color: 'green-inverse'
    })

    const clipList = computed(() =>
      list.value.filter(item => item.tagId === currTag.id)
    )

    const add = (
      item: Pick<ClipItem, 'content'> & Partial<Omit<ClipItem, 'content'>>
    ) => {
      list.value.unshift({
        id: key.itemId,
        tagId: 0,
        title: 'No title',
        date: new Date(),
        ...item
      })
      key.itemId++
    }

    const remove = (id: number) => {
      list.value = list.value.filter(item => item.id !== id)
    }

    const removeByTagId = (tagId: number) => {
      list.value = list.value.filter(item => item.tagId !== tagId)
    }

    const addTag = (tag: Pick<Tag, 'title'>) => {
      const color = getRandomColor() as Tag['color']
      tags.value.push({
        id: key.tagId,
        color,
        ...tag
      })
      key.tagId++
    }

    const selectTag = (tag: Tag) => {
      currTag.id = tag.id
      currTag.color = tag.color
    }

    const removeTag = (id: number) => {
      tags.value = tags.value.filter(item => item.id !== id)
    }

    return {
      key,
      list,
      clipList,
      add,
      remove,
      removeByTagId,
      tags,
      firstTag,
      currTag,
      addTag,
      selectTag,
      removeTag
    }
  },
  {
    persist: true
  }
)
