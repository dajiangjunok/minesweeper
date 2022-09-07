<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { BlockState } from '~/types'
import { isDev } from '~/composables'

interface Props {
  block: BlockState
}
defineProps<Props>()

const numberColors = [
  'text-transparent',
  'text-bule-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-pink-500',
  'text-pink-500',
]

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10 '

  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/40'

  return block.mine ? 'text-red' : numberColors[block.adjacentMines]
}
</script>

  <!-- @click=" onClick(block)"
    @contextmenu.prevent="onRightClick(block)" -->
<template>
  <button
    flex="~"
    justify-center
    items-center
    w-10 h-10
    border="1 color-gray-500/50"
    :class="getBlockClass(block)"
  >
    <div v-if="block.flagged">
      <div text-red i-mdi:flag />
    </div>
    <div v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi:mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </div>
  </button>
</template>

