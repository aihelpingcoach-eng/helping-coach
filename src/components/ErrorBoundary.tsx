import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center z-[9999]">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-3">Algo salió mal</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xs leading-relaxed">
            La aplicación encontró un error inesperado. Recarga para continuar.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95"
          >
            Recargar app
          </button>
          {this.state.error && (
            <p className="mt-6 text-xs text-slate-600 font-mono max-w-xs break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
