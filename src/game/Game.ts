import { Component, Entity, System, World } from '@/framework'

class PlayerComp extends Component {
  constructor(public name: string) {
    super()
  }

  onAdded(): void {
    console.log(`Player ${this.name} added`)
  }

  onRemoved(): void {
    console.log(`Player ${this.name} removed`)
  }
}

class EnemyComp extends Component {
  constructor(public name: string) {
    super()
  }
}

class TestSys extends System {
  constructor() {
    super({
      any: [PlayerComp, EnemyComp],
    })
  }

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const player = entity.getComponent(PlayerComp)
      console.log(`Player ${player?.name} update ${deltaTime}`)
    }
  }
}

export function startGame() {
  const world = new World()

  const playerEntity = world.createEntity()
  playerEntity.addComponent(PlayerComp, '韩立')

  const enemyEntity = world.createEntity()
  enemyEntity.addComponent(EnemyComp, '小怪兽')

  world.addSystem(TestSys)

  setInterval(() => {
    world.update(1)
  }, 1000)
}
