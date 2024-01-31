<template>
  <div class="flex justify-center pt-[10px] text-[12px]">
    <a-tag
      class="cursor-pointer rounded-full"
      v-for="tag in clipboard.tags"
      :color="tag.color"
      :key="tag.id"
      @dragenter="handleDragEnter(tag)"
      @dragleave="handleDragLeave"
      @dragover="$event.preventDefault()"
      @click="selectTag(tag)"
    >
      {{ tag.title }}
    </a-tag>

    <a-tag
      v-if="!isShowAddTagInput"
      class="w-[60px] cursor-pointer border-dashed bg-white"
      @click="handleShowAddTagInput"
    >
      New Tag
    </a-tag>
    <a-input
      v-else
      ref="addTagInputRef"
      v-model:value="clipboard.currTag.title"
      type="text"
      size="small"
      class="h-full w-[60px]"
      @blur="handleAddTagInputBlur"
      @keyup.enter="handleAddTagInputBlur"
    />
  </div>

  <div
    ref="pasteListRef"
    class="flex overflow-y-hidden overflow-x-scroll p-[10px]"
  >
    <a-tooltip
      class="clip-item ml-[20px] h-[200px] min-w-[200px] max-w-[200px] select-none overflow-hidden rounded-md border border-primary-500 p-[5px] transition-shadow first:ml-0 hover:shadow-md hover:shadow-primary-500"
      v-if="clipboard.clipList.length"
      v-for="item in clipboard.clipList"
      :key="item.id"
      placement="leftTop"
      title="双击复制"
    >
      <div
        draggable="true"
        @dragstart="handleDragStart(item)"
        @dragend="handleDragEnd(item)"
        @dblclick="handleSelect(item)"
      >
        <a-tag
          class="h-[50px] w-full py-[5px]"
          :color="clipboard.currTag.color"
        >
          <input
            class="border-none bg-transparent outline-none"
            v-model.lazy="item.title"
          />
          <div>
            {{ moment(item.date).format('YYYY/MM/DD hh:mm:ss') }}
          </div>
        </a-tag>
        {{ item.content }}
      </div>
    </a-tooltip>

    <div
      v-else
      class="flex h-[200px] w-full items-center justify-center text-[12px] text-slate-400"
    >
      暂无内容
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'

import { useClipboard, type ClipItem, type Tag } from '~/store'

const interval = 500
const clipboard = useClipboard()
const pasteListRef = ref<HTMLDivElement>()
const addTagInputRef = ref<HTMLInputElement>()
const isShowAddTagInput = ref(false)
const currentDrag = ref<{ tag?: Tag; item?: ClipItem }>({})

const timer = setInterval(async () => {
  const text = await window.electron.getClipText()
  if (!text) return
  clipboard.add({
    content: text
  })
}, interval)

const handleSelect = async (item: ClipItem) => {
  await window.electron.paste(item.content)
  pasteListRef.value?.scrollTo({
    left: 0
  })
}

const handleShowAddTagInput = async () => {
  isShowAddTagInput.value = true
  await nextTick()
  addTagInputRef.value?.focus()
}

const handleAddTagInputBlur = () => {
  isShowAddTagInput.value = false
  if (!clipboard.currTag.title) return
  clipboard.addTag({ title: clipboard.currTag.title })
  clipboard.currTag.title = ''
}

const selectTag = (tag: Tag) => {
  clipboard.selectTag(tag)
}

const handleDragStart = (item: ClipItem) => {
  currentDrag.value.item = item
}

const handleDragEnter = (tag: Tag) => {
  currentDrag.value.tag = tag
}

const handleDragLeave = () => {
  currentDrag.value.tag = undefined
}

const handleDragEnd = (item: ClipItem) => {
  if (!currentDrag.value?.tag) return
  const tag = currentDrag.value.tag
  item.tagId = tag.id
  clipboard.selectTag(tag)
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.clip-item {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
}
</style>
