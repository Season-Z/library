export type Type = 'web' | 'electron' | 'react-native' | 'miniapp'; // type 决定 数据的储存方式
export interface iParams {
  apiUrl: string;
  version?: string;
  data?: object;
  restData?: object;
}

export interface ResultStatus {
  success: boolean;
  code: number;
  message: string;
}
export interface Result extends ResultStatus {
  data?: any;
  list?: any;
  page?: number;
  size?: number;
  total?: number;
  isEnd?: boolean;
  pages?: number;
  [other: string]: any;
}
export interface ResponstResult<T = Result> {
  success: boolean;
  result: T;
  code: number;
  message: string;
}
