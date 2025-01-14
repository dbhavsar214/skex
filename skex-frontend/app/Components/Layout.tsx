import React from 'react';
interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow">{children}</main>

    </div>
  );
};

export default Layout;
