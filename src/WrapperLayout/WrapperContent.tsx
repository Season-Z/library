import React, { ReactNode, useMemo } from 'react';
import './index.less';

interface WrapperContentProps {
  children: ReactNode | string | JSX.Element | null;
  className?: string;
  [x: string]: any;
}

function WrapperContent(props: WrapperContentProps) {
  const { children, className, ...rest } = props;

  const newCls = useMemo(() => {
    if (className) {
      return `wrapStyle flex-fill ${className}`;
    } else {
      return 'wrapStyle flex-fill';
    }
  }, [className]);

  return (
    <div className={newCls} {...rest}>
      {children}
    </div>
  );
}

export default WrapperContent;
