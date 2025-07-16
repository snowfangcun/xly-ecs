import { useCounterStore } from '@/stores/counter'
import { Entity, EntitySystem, Time } from '@esengine/ecs-framework'

export class PlayerXiulianSys extends EntitySystem {
  public process(entities: Entity[]): void {
    console.log('process', entities.length)
    entities.forEach((e) => {
      if (e.name !== 'player') return
      const store = useCounterStore()
      store.increment()
      console.log('xiulian', Time.deltaTime)
    })
  }
}
