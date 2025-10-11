import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Aquatiko Gestion</h1>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <a href="/" className="block py-2 px-4 rounded hover:bg-gray-100">Dashboard</a>
            <a href="/comptabilite" className="block py-2 px-4 rounded hover:bg-gray-100">Comptabilité</a>
            <a href="/import-export" className="block py-2 px-4 rounded hover:bg-gray-100">Import/Export</a>
            <a href="/crm" className="block py-2 px-4 rounded hover:bg-gray-100">CRM</a>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
