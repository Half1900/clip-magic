<template>
  <div class="relative h-[100vh] w-[100vw]">
    <div class="absolute left-0 top-0 h-full w-full p-[10px]">
      <span
        class="block h-[30px] border-b-2 border-dotted border-x-primary-100"
        v-for="i in rowNum"
        :key="i"
      />
    </div>
    <div
      ref="contentRef"
      class="absolute left-0 top-0 w-full p-[10px] leading-[30px] outline-none"
      contenteditable
      spellcheck="false"
      @input="handleInput"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { OptionType, useClipboard } from '~/store'

const clipboard = useClipboard()

const isEdit = clipboard.optionType === OptionType.Edit

const rowNum = ref(13)
const content = ref(clipboard.currentItemMenu?.content ?? '')
const contentRef = ref<HTMLDivElement>()

const handleInput = (e: any) => {
  content.value = e.target.innerText

  if (isEdit) {
    clipboard.currentItemMenu!.content = content.value
    for (const item of clipboard.list) {
      if (item.id === clipboard.currentItemMenu?.id) {
        item.content = content.value
        break
      }
    }
  }

  const num = (contentRef.value!.offsetHeight - 20) / 30
  rowNum.value = num <= 13 ? 13 : num
}

onMounted(() => {
  if (isEdit) return
  window.addEventListener('beforeunload', () => {
    if (!content.value) return
    clipboard.add({
      content: content.value,
      tagId: clipboard.currentTagMenu!.id
    })
  })
})
</script>

<style scoped></style>
