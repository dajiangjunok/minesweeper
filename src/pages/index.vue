<script setup lang="ts">
import MineBlock from '../components/MineBlock.vue'
import type { BlockState } from '~/types'
import { GamePaly, isDev, toggleDev } from '~/composables'

const play = new GamePaly(10, 10)
const state = play.state
</script>

<template>
  <div>
    Minesweeper

    <div p-5>
      <div v-for="(row, index) in state" :key="index" flex="~" justify-center>
        <MineBlock
          v-for="(block, indey) in row"
          :key="indey"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>

    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev">
        {{ isDev ? 'DEV' : 'NORMAL' }}
      </button>
      <button btn @click="play.reset()">
        RESET
      </button>
    </div>
  </div>
</template>
