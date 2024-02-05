<template>
  <div class="relative h-[100vh] w-[100vw]">
    <div class="absolute left-0 top-0 h-full w-full p-[10px]">
      <span
        class="block h-[30px] border-b-2 border-dotted border-primary-500"
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
      {{ clipboard.currentItemMenu?.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '~/store'

const rowNum = ref(13)
const contentRef = ref<HTMLDivElement>()
const clipboard = useClipboard()

const handleInput = (e: any) => {
  const content = e.target.innerText
  clipboard.currentItemMenu!.content = content
  console.log('clipboard.currentItemMenu ==> ', clipboard.currentItemMenu)
  for (const item of clipboard.list) {
    if (item.id === clipboard.currentItemMenu?.id) {
      item.content = content
      break
    }
  }
  const num = (contentRef.value!.offsetHeight - 20) / 30
  rowNum.value = num <= 13 ? 13 : num
}
</script>

<style scoped></style>
