import { Splash } from '../splash';
import type { ReactNode } from 'react';

interface AsyncRendererProps<T> {
  loading: boolean;
  error: Error | undefined | null;
  data: T | undefined;
  children: (data: T) => ReactNode;
}

// eslint-disable-next-line
export function AsyncRenderer<T = any>({
  loading,
  error,
  data,
  children,
}: AsyncRendererProps<T>) {
  if (error) {
    return <Splash>Something went wrong: {error.message}</Splash>;
  }

  if (loading) {
    return <Splash>Loading...</Splash>;
  }

  if (!data) {
    return <Splash>No data</Splash>;
  }

  return <>{children(data)}</>;
}