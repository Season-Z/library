export type Kind = 'info' | 'positive' | 'negative' | 'warning';
export type KindMap = Record<Kind, string>;

export interface IProps {
  children: any;
  isEn?: boolean;
}
