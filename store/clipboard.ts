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
    const id = ref<number>(1)
    const list = ref<ClipItem[]>([])
    const tagId = ref<number>(1)
    const tags = ref<Tag[]>([{ id: 0, title: '常规', color: 'green-inverse' }])
    const currTag = reactive<Tag>({
      id: 0,
      title: '',
      color: 'green-inverse'
    })

    const clipList = computed(() =>
      list.value.filter(item => item.tagId === currTag.id)
    )

    const add = (item: Pick<ClipItem, 'content'>) => {
      list.value.unshift({
        id: id.value,
        tagId: currTag.id,
        title: 'No title',
        date: new Date(),
        ...item
      })
      id.value++
    }

    const select = (item: ClipItem) => {
      remove(item.id)
    }

    const remove = (id: number) => {
      list.value = list.value.filter(item => item.id !== id)
    }

    const addTag = (tag: Pick<Tag, 'title'>) => {
      const color = getRandomColor() as Tag['color']
      tags.value.push({
        id: tagId.value,
        color,
        ...tag
      })
      tagId.value++
    }

    const selectTag = (tag: Tag) => {
      currTag.id = tag.id
      currTag.color = tag.color
    }

    return {
      list,
      clipList,
      add,
      select,
      remove,
      tags,
      currTag,
      addTag,
      selectTag
    }
  },
  {
    persist: true
  }
)
