export type BaseStuffResources = {
  name: string
  desc: string
  isStackable: boolean
}

export type GongfaResources = BaseStuffResources & {
  isStackable: false
}
