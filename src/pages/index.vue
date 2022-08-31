<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  // 是否被翻开
  revealed?: boolean
  // 是否是炸弹
  mine?: boolean
  // 是否被标记
  flagged?: boolean
  // 是否临近
  adjacentMines: number
}

const WIDTH = 10
const HEIGHT = 10
const state = reactive(
  Array.from({ length: WIDTH },
    (_, y) => Array.from({ length: HEIGHT },
      (_, x): BlockState => ({
        x, y, revealed: false, flagged: false, mine: false, adjacentMines: 0,
      })),
  ),
)

function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      // 保证上下两格不存在炸弹
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue

      block.mine = Math.random() < 0.2
    }
  }
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
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
  state.forEach((row, y) => {
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

    return state[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}

// 事件函数
let mineGenerated = false
const dev = false
function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    updateNumbers()
    mineGenerated = true
  }
  block.revealed = true

  if (block.mine)
    alert('Boooooom!!!')

  expendZero(block)
}

function getBlockClass(item: BlockState) {
  if (!item.revealed)
    return 'bg-gray-500/10'

  return item.mine ? 'text-red' : numberColors[item.adjacentMines]
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
          hover:bg-gray
          :class="getBlockClass(block)"
          @click=" onClick(block)"
        >
          <tempalte v-if="block.revealed || dev">
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
