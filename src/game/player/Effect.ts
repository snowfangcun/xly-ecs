/**
 * 基础效果类
 */
export abstract class Effect {}

/**
 * 经验增加效果
 */
export class EffectAddExp extends Effect {
  constructor(public exp: number) {
    super()
  }
}
