<template>
  <div class="h-[15px] bg-primary-500 pl-[8px] text-[10px] text-white">
    Clip Magic
  </div>

  <div class="tags">
    <div class="tag" v-for="tag in clipboard.tags" :key="tag.id"></div>
  </div>

  <div
    ref="pasteListRef"
    class="flex overflow-y-hidden overflow-x-scroll p-[10px]"
  >
    <div
      class="item ml-[20px] h-[200px] min-w-[200px] max-w-[200px] select-none overflow-hidden rounded-md border border-primary-500 p-[5px] transition-shadow first:ml-0 hover:shadow-md hover:shadow-primary-500"
      v-for="item in clipboard.list"
      :key="item.id"
      :title="item.content"
      @dblclick="handleSelect(item.content)"
    >
      {{ item.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '~/store'

const pasteListRef = ref<HTMLDivElement>()
const interval = 500
const clipboard = useClipboard()

const timer = setInterval(async () => {
  const text = await window.electron.getClipText()
  if (!text) return
  clipboard.handleCopy({
    content: text,
    date: new Date()
  })
}, interval)

const handleSelect = async (content: string) => {
  await window.electron.paste(content)
  pasteListRef.value?.scrollTo({
    left: 0
  })
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.item {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
}
</style>
