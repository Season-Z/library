export type Kind = 'info' | 'positive' | 'negative' | 'warning';
export type KindMap = Record<Kind, string>;

export interface PortalProps {
  /**
   * Set this to change alert kind
   * @default info
   */
  // portalId?: 'info' | 'positive' | 'negative' | 'warning';
  topMenuCode: string;
  menuCode: any; //'string'; //获取哪个菜单
  children: any;
  portalId?: 'string';
  portalLayoutId?: 'string';
  showCityCode?: boolean; // 显示城市
  showOperationGroup?: boolean; // 显示运营组
  includeQuanguo?: boolean; // 全国包邮运营组 999999999
  menuItemClick?: Function;
  localMenu?: Array<any>;
}
