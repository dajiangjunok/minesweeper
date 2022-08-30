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
  adjacentMines?: boolean
}

const WIDTH = 10
const HEIGHT = 10
const state = reactive(
  Array.from({ length: WIDTH },
    (_, y) => Array.from({ length: HEIGHT },
      (_, x): BlockState => ({
        x, y,
      })),
  ),
)

function onClick(x: number, y: number) {
  console.log(x, y)
}
</script>

<template>
  <div>
    Minesweeper
    <div v-for="(row, index) in state" :key="index">
      <button v-for="(item, indey) in row" :key="indey" w-10 h-10 border hover:bg-gray @click=" onClick(item.x, item.y)">
        {{ item.y * 10 + (item.x + 1) }}
      </button>
    </div>
  </div>
</template>
