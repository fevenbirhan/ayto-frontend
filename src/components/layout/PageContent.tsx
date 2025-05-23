import { ReactNode } from 'react';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export const PageContent = ({ children, className = '' }: PageContentProps) => {
  const headerHeight = useHeaderHeight();

  return (
    <main 
      className={`flex-1 bg-[#1A1A1A] py-8 px-4 md:px-6 ${className}`}
      style={{ 
        paddingTop: `calc(var(--header-height, ${headerHeight}px) + 2rem)`,
        minHeight: 'calc(100vh - var(--header-height, 0px))'
      }}
    >
      {children}
    </main>
  );
}; 