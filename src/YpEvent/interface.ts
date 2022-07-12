export type YpEventCb = (data: any) => void;
export interface YpEventStore {
  [key: string]: YpEventCb[];
}
export interface YpEvent {
  on: (eventName: string, callback: YpEventCb) => void;
  emit: (eventName: string, data?: any) => void;
  off: (eventName: string, callback: YpEventCb) => void;
  once: (evtName: string, callback: YpEventCb) => void;
  clear: () => void;
}
