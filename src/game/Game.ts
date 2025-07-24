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

class TestSys extends System {
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

  world.addSystem(new TestSys())

  setInterval(() => {
    world.update(1)
  }, 1000)
}
