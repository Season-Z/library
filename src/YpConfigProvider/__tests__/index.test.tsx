import React from 'react';
import { render } from '@testing-library/react';
import YpUpload from '../../ypUpload';

describe('<Alert />', () => {
  test('should render default', () => {
    const { container } = render(<YpUpload>default</YpUpload>);
    expect(container).toMatchSnapshot();
  });

  test('should render alert with type', () => {
    const kinds: any[] = ['info', 'warning', 'positive', 'negative'];

    const { getByText } = render(
      <>
        {kinds.map(k => (
          <YpUpload kind={k} key={k}>
            {k}
          </YpUpload>
        ))}
      </>,
    );

    kinds.forEach(k => {
      expect(getByText(k)).toMatchSnapshot();
    });
  });
});
