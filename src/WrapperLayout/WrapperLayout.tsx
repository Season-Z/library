/**
 * 整体布局
 */
import React, { ReactNode, useMemo } from 'react';
import './index.less';

interface WrapperLayoutProps {
  children: ReactNode | string | JSX.Element | null;
  className?: string;
  [x: string]: any;
}

function WrapperLayout(props: WrapperLayoutProps) {
  const { children, className, ...rest } = props;

  const newCls = useMemo(() => {
    if (className) {
      return `column-flex ${className}`;
    } else {
      return 'column-flex';
    }
  }, [className]);

  return (
    <div className={newCls} {...rest}>
      {children}
    </div>
  );
}

export default WrapperLayout;
