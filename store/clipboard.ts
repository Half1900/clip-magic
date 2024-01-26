interface Item {
  id: number
  date: Date
  content: string
}

interface Tag {
  id: number
  title: string
  color: string
}

export const useClipboard = defineStore(
  'clipboard',
  () => {
    const id = ref(1)
    const list = ref<Item[]>([])
    const tagId = ref(1)
    const tags = ref<Tag[]>([])

    const handleCopy = (item: Pick<Item, 'content' | 'date'>) => {
      list.value.unshift({
        ...item,
        id: id.value
      })
      id.value++
    }

    const addTag = (tag: Pick<Tag, 'title' | 'color'>) => {
      tags.value.push({ id: tagId.value, ...tag })
      tagId.value++
    }

    return { list, handleCopy, tags, addTag }
  },
  {
    persist: true
  }
)
