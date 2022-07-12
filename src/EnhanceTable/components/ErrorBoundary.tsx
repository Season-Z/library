/* eslint-disable @typescript-eslint/member-ordering */
import React, { ErrorInfo } from 'react';
import { Result } from 'antd';

class ErrorBoundary extends React.Component<
  {},
  { hasError: boolean; errorInfo: string }
> {
  state = { hasError: false, errorInfo: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="出现了错误"
          extra={this.state.errorInfo}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
