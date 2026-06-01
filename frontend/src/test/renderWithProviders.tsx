import { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';

interface RenderOptions {
  initialEntries?: string[];
}

export function renderWithProviders(ui: ReactNode, { initialEntries = ['/'] }: RenderOptions = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}
