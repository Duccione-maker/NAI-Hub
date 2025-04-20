import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato così il prossimo render mostrerà l'UI di fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puoi anche logare l'errore in un servizio di reporting
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Puoi renderizzare qualsiasi UI di fallback
      return (
        <div className="error-boundary">
          <h2>Qualcosa è andato storto.</h2>
          <p>Ricarica la pagina o torna alla dashboard.</p>
          <button onClick={() => window.location.href = '/dashboard'}>
            Torna alla Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;