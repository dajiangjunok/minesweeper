export interface BlockState {
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
