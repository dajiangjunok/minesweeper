<script setup lang="ts">
import type { BlockState } from '~/types'

const WIDTH = 10
const HEIGHT = 10
const state = ref(
  Array.from({ length: WIDTH },
    (_, y) => Array.from({ length: HEIGHT },
      (_, x): BlockState => ({
        x, y, revealed: false, flagged: false, mine: false, adjacentMines: 0,
      })),
  ),
)

function generateMines(initial: BlockState) {
  for (const row of state.value) {
    for (const block of row) {
      // 保证上下两格不存在炸弹
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue

      block.mine = Math.random() < 0.1
    }
  }
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed && !s.flagged) {
      s.revealed = true
      expendZero(s)
    }
  })
}

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
]

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

function updateNumbers() {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return

      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined

    return state.value[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}

// 事件函数
let mineGenerated = false
let isLose = false
const dev = false
function onClick(block: BlockState) {
  if (block.flagged)
    return

  if (!mineGenerated) {
    generateMines(block)
    updateNumbers()
    mineGenerated = true
  }
  block.revealed = true

  if (block.mine) {
    isLose = true
    revealedAll()
    alert('Boooooom!!!')
  }

  expendZero(block)
}

function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
}

watch(state, checkGameState, {
  deep: true,
},
)

function checkGameState() {
  const blocks = state.value.flat()

  // const isCheck = blocks.every(block =>
  //   (!block.mine && block.revealed) || block.flagged,
  // )

  // 只要有不是炸弹的没有翻开,那就不用进去判断
  const isPass = blocks.some(block => !block.revealed && !block.mine)

  if (!isPass && !isLose)
    alert('You win!')
}

function revealedAll() {
  const blocks = state.value.flat()

  blocks.forEach((block) => {
    if (!block.revealed)
      block.revealed = true
  })
}

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10 '

  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/40'

  return block.mine ? 'text-red' : numberColors[block.adjacentMines]
}
</script>

<template>
  <div>
    Minesweeper
    <div p-5>
      <div v-for="(row, index) in state" :key="index" flex="~" justify-center>
        <button
          v-for="(block, indey) in row"
          :key="indey"
          flex="~"
          justify-center
          items-center
          w-10 h-10
          border="1 color-gray-500/50"
          :class="getBlockClass(block)"
          @click=" onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
        >
          <tempalte v-if="block.flagged">
            <div i-mdi:flag text-red />
          </tempalte>
          <tempalte v-else-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi:mine />
            <div v-else>
              {{ block.adjacentMines }}
            </div>
          </tempalte>
        </button>
      </div>
    </div>
  </div>
</template>
