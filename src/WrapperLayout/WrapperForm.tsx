import React, { ReactNode, useMemo } from 'react';
import './index.less';

interface WrapperFormProps {
  children: ReactNode | string | JSX.Element | null;
  className?: string;
  [x: string]: any;
}

function WrapperForm(props: WrapperFormProps) {
  const { children, className, ...rest } = props;

  const newCls = useMemo(() => {
    if (className) {
      return `wrapFormStyle ${className}`;
    } else {
      return 'wrapFormStyle';
    }
  }, [className]);

  return (
    <div className={newCls} {...rest}>
      {children}
    </div>
  );
}

export default WrapperForm;
