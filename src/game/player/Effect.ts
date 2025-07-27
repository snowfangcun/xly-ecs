import { Event } from '@/framework'

/**
 * 基础效果类
 */
export abstract class Effect extends Event {
  constructor(public readonly uid: string) {
    super()
  }
}

/**
 * 经验增加效果
 */
export class EffectAddExp extends Effect {
  constructor(
    uid: string,
    public exp: number,
  ) {
    super(uid)
  }
}
