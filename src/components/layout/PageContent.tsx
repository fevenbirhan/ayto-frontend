import { ReactNode } from 'react';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export const PageContent = ({ children }) => (
  <div className="w-full">{children}</div>
);
