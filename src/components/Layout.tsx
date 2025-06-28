import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, Warehouse, Truck, User, ShoppingCart, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'customer' | 'manager';
}

export function Layout({ children, userRole }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = userRole === 'manager' 
    ? [
        { path: '/manager', label: 'Dashboard', icon: Settings },
        { path: '/manager/warehouses', label: 'Warehouses', icon: Warehouse },
        { path: '/manager/suppliers', label: 'Suppliers', icon: Truck },
        { path: '/manager/orders', label: 'Orders', icon: ShoppingCart },
      ]
    : [
        { path: '/', label: 'Shop', icon: Store },
        { path: '/cart', label: 'Cart', icon: ShoppingCart },
        { path: '/profile', label: 'Profile', icon: User },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                EcoSupply
              </Link>
              
              <div className="hidden md:flex space-x-6">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {userRole === 'manager' ? 'Store Manager' : 'Customer'}
                </span>
              </div>
              
              <Link
                to={userRole === 'manager' ? '/' : '/manager'}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Switch to {userRole === 'manager' ? 'Customer' : 'Manager'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}