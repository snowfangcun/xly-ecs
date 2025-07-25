import { Observable, Subject } from 'rxjs'

/**
 * 事件基类
 */
export abstract class Event {}

/**
 * 事件处理模式
 */
export enum EventDispatchMode {
  /**
   * 即时处理模式 - 事件一旦派发立即处理
   */
  Immediate,
  /**
   * 帧结束处理模式 - 事件在每帧结束时统一处理
   */
  EndOfFrame,
}

/**
 * 事件调度器类
 * 负责管理事件的派发和处理，支持即时处理和帧结束处理两种模式
 */
export class EventDispatcher {
  private eventSubject = new Subject<Event>()
  private frameEndEvents: Event[] = []

  public readonly event$: Observable<Event> = this.eventSubject.asObservable()

  /**
   * 派发事件
   * @param event 要派发的事件
   * @param mode 事件处理模式，默认为即时处理
   */
  emitEvent(event: Event, mode: EventDispatchMode = EventDispatchMode.Immediate): void {
    switch (mode) {
      case EventDispatchMode.Immediate:
        this.eventSubject.next(event)
        break
      case EventDispatchMode.EndOfFrame:
        this.frameEndEvents.push(event)
        break
    }
  }

  /**
   * 在帧结束时处理所有累积的事件
   */
  processFrameEndEvents(): void {
    for (const event of this.frameEndEvents) {
      this.eventSubject.next(event)
    }
    this.frameEndEvents = []
  }

  /**
   * 清空待处理事件
   */
  clearPendingEvents(): void {
    this.frameEndEvents = []
  }
}
