/* eslint-disable @typescript-eslint/no-explicit-any */

import { Event } from "@/framework";

export class PlayerBagAddItemEvent extends Event {
  constructor(
    public readonly key: string,
    public readonly count: number,
    public readonly data: any = undefined,
  ) {
    super()
  }
}
