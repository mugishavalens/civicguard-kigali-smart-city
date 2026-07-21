import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-main-bg flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-bold text-text-main mb-2">Something went wrong</h1>
            <p className="text-sm text-text-light mb-6">
              {this.state.error.message || 'An unexpected error occurred while rendering this page.'}
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
