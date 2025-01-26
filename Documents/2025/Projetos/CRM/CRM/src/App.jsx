import React, { useState } from 'react';
import { Header } from './components/ui/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { CustomersPage } from './components/customers/CustomersPage';
import { ConversationsPage } from './components/conversations/ConversationsPage';
import { CampaignsPage } from './components/campaigns/CampaignsPage';
import { OffersPage } from './components/offers/OffersPage';
import { NewProductsPage } from './components/products/NewProductsPage';
import { ReportingPage } from './components/reporting/ReportingPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { MobileMenu } from './components/ui/MobileMenu';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('products'); 

  const handleMenuItemClick = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomersPage />;
      case 'conversations':
        return <ConversationsPage />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'offers':
        return <OffersPage />;
      case 'products':
        return <NewProductsPage />;
      case 'reporting':
        return <ReportingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg dark:text-gray-100 transition-colors duration-200">
      <Toaster position="top-right" />
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onNavigate={setCurrentPage}
      />
      <div className="flex-1 pt-16"> 
        <div className="max-w-[1440px] mx-auto h-full">
          <div className="flex h-full relative"> 
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)}
              currentPage={currentPage}
              onMenuItemClick={handleMenuItemClick}
            />
            <main className="flex-1 overflow-auto p-6 lg:pl-[320px]"> 
              {renderPage()}
            </main>
          </div>
        </div>
      </div>
      <MobileMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleMenuItemClick}
      />
    </div>
  );
}