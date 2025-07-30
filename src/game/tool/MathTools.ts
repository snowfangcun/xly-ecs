/**
 * 基于权重的随机抽取工具函数
 * 稀有度越高，出现概率越低
 * @param items 带有权重(rarity)的项目数组
 * @param maxRarity 可选的最大稀有度值，用于更精确的权重计算
 * @returns 选中的项目索引
 */
export function weightedRandom(items: { rarity: number }[], maxRarity?: number): number {
  // 如果没有提供maxRarity，则使用数组中的最大稀有度
  const maxRarityValue = maxRarity || Math.max(...items.map((item) => item.rarity), 1)

  // 计算每个项目的权重：权重 = (maxRarity + 1 - rarity)
  // 这样稀有度越高的项目权重越低
  const weights = items.map((item) => maxRarityValue + 1 - item.rarity)

  // 计算总权重
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  // 生成一个0到总权重之间的随机数
  let random = Math.random() * totalWeight

  // 根据权重选择项目
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i
    }
    random -= weights[i]
  }

  // 默认返回最后一个项目（理论上不会执行到这里）
  return items.length - 1
}
