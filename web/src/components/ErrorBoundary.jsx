import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-50 px-4 text-center">
          <div>
            <p className="text-lg font-semibold text-surface-800">Something went wrong.</p>
            <p className="mt-1 text-[13px] text-surface-500">The page ran into a problem. Your data is safe.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/dashboard";
            }}
            className="cursor-pointer rounded-xl bg-accent-500 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm shadow-accent-200 transition-colors hover:bg-accent-600"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
