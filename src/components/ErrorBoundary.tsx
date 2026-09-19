import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Buton } from './ds';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-damga-yumusak text-damga">
          <AlertTriangle size={26} aria-hidden="true" />
        </span>
        <h2 className="baslik-lg text-metin">
          {this.props.fallbackTitle || 'Ekran yüklenemedi'}
        </h2>
        <p className="govde-sm mt-1 text-metin-yumusak">
          Geçici bir sorun oluştu. Yeniden dene; sorun sürerse ana sayfaya dön.
        </p>

        <div className="mt-6 flex w-full flex-col gap-2">
          <Buton
            cesit="birincil"
            boyut="lg"
            tamGenislik
            ikon={<RotateCcw size={18} />}
            onClick={this.handleReset}
          >
            Yeniden dene
          </Buton>
          <Buton cesit="hayalet" boyut="md" tamGenislik onClick={() => { window.location.href = '/'; }}>
            Ana sayfa
          </Buton>
        </div>
      </div>
    );
  }
}
