export enum PlayerEventType {
  Nothing = 0,
  Xiulian = 1,
}

export type PlayerEventData = {
  type: PlayerEventType
  startTime: number
}
