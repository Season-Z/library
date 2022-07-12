import React from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

export default (props: {
  width: number;
  onResize: (
    arg0: React.SyntheticEvent<Element, Event>,
    arg1: ResizeCallbackData,
  ) => any;
  [x: string]: any;
}) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
