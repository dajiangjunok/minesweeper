import type { BlockState } from '~/types'
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

export class GamePaly {
  mineGenerated = false
  state = ref<BlockState[][]>([])
  gameState = ref<'play' | 'won' | 'lost'>('play')

  constructor(public width: number, public height: number) {
    // watch(this.state, this.checkGameState, {
    //   deep: true,
    // },
    // )
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.gameState.value = 'play'
    this.state.value = Array.from({ length: this.width },
      (_, y) => Array.from({ length: this.height },
        (_, x): BlockState => ({
          x, y, revealed: false, flagged: false, mine: false, adjacentMines: 0,
        })),
    )
  }

  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
      for (const block of row) {
      // 保证上下两格不存在炸弹
        if (Math.abs(initial.x - block.x) <= 1)
          continue
        if (Math.abs(initial.y - block.y) <= 1)
          continue

        block.mine = Math.random() < 0.1
      }
    }
    this.updateNumbers()
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return
    this.getSiblings(block).forEach((s) => {
      if (!s.revealed && !s.flagged) {
        s.revealed = true
        this.expendZero(s)
      }
    })
  }

  updateNumbers() {
    this.state.value.forEach((row, _y) => {
      row.forEach((block, _x) => {
        if (block.mine)
          return

        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.state.value[y2][x2]
    })
      .filter(Boolean) as BlockState[]
  }

  showAllMines() {
    this.state.value.flat().forEach((block) => {
      if (block.mine)
        block.revealed = true
    })
  }

  // 事件函数

  onClick(block: BlockState) {
    if (this.gameState.value !== 'play')
      return
    if (block.flagged)
      return

    if (!this.mineGenerated) {
      this.generateMines(this.state.value, block)
      this.mineGenerated = true
    }
    block.revealed = true

    if (block.mine) {
      this.gameState.value = 'lost'
      this.showAllMines()
      return
    }

    this.expendZero(block)
  }

  onRightClick(block: BlockState) {
    if (this.gameState.value !== 'play')
      return
    if (block.revealed)
      return
    block.flagged = !block.flagged
  }

  checkGameState() {
    const blocks = this.state.value.flat()

    // const isCheck = blocks.every(block =>
    //   (!block.mine && block.revealed) || block.flagged,
    // )

    // 只要有不是炸弹的没有翻开,那就不用进去判断
    const isPass = blocks.some(block => !block.revealed && !block.mine)

    if (!isPass)
      this.gameState.value = 'won'
  }
}
