import { Component } from "react";

// El "Sandwich" de Protección
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 p-4 border border-red-200 rounded text-red-600 text-center">
          <p className="font-bold">Algo falló 😓</p>
          <p className="mb-2 text-sm">{this.state.error.message}</p>
          <button onClick={() => { this.setState({ hasError: false }); this.props.onReset(); }} className="underline">Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}