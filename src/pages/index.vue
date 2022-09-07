<script setup lang="ts">
import MineBlock from '../components/MineBlock.vue'
import type { BlockState } from '~/types'
import { GamePaly, isDev, toggleDev } from '~/composables'

const play = new GamePaly(10, 10)
const state = play.state

function getFace() {
  // console.log(play.gameState.value)

  switch (play.gameState.value) {
    case 'play':
      return 'i-mdi:emoticon-happy-outline'
    case 'won':
      return 'i-mdi:emoticon-cool-outline'
    case 'lost':
      return 'i-mdi:emoticon-sad-outline'
    default:
      break
  }
}
</script>

<template>
  <div>
    <div flex="~" justify-center>
      Minesweeper
      <i m-l-5 :class="getFace()" />
    </div>
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
