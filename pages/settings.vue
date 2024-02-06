<template>
  <context-holder />
  <div class="m-auto mt-[50px] w-[500px]">
    <a-descriptions title="配置" :label-style="{ alignItems: 'center' }">
      <a-descriptions-item label="开机自启动">
        <a-checkbox v-model:checked="settings.openAtLogin" />
      </a-descriptions-item>
      <a-descriptions-item label="打开应用快捷键">
        <a-input
          :value="
            settings.openShortcutKey?.replace('CommandOrControl', 'Control')
          "
          @keydown="handleShortcutKeyDown"
          @keyup="handleShortcutKeyUp"
        />
      </a-descriptions-item>
      <a-descriptions-item label="每个标签最大存储记录数">
        <a-input-number
          :min="1"
          v-model:value="settings.PerTagMaximumStorage"
        />
      </a-descriptions-item>
    </a-descriptions>

    <a-button @click="handleSubmit">保存</a-button>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { Settings } from 'electron/utils'

const [messageApi, contextHolder] = message.useMessage()

const settings = ref<Partial<Settings>>({})

window.electron.getSettings().then(res => {
  settings.value = res
})

const key: string[] = []
const handleShortcutKeyDown = (e: any) => {
  e.preventDefault()
  const code = e.code as string
  if (code.includes('Control')) {
    key[0] = 'CommandOrControl'
  } else if (code.includes('Alt')) {
    key[1] = 'Alt'
  } else if (code.includes('Shift')) {
    key[2] = 'Shift'
  } else if (code.includes('Key')) {
    key[3] = code.slice(3)
  }
  settings.value.openShortcutKey = key.filter(Boolean).join('+')
}

const handleShortcutKeyUp = (e: any) => {
  e.preventDefault()
  const code = e.code as string
  if (code.includes('Control')) {
    key[0] = ''
  } else if (code.includes('Alt')) {
    key[1] = ''
  } else if (code.includes('Shift')) {
    key[2] = ''
  } else if (code.includes('Key')) {
    key[3] = ''
  }
}

const handleSubmit = async () => {
  await window.electron.updateSettings(JSON.stringify(settings.value))
  messageApi.success('保存成功，重启后方可生效')
}
</script>

<style scoped>
:deep(.ant-descriptions-row) {
  display: flex;
  flex-direction: column;
}
</style>
