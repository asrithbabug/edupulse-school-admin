'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getUser, clearAuth } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        {(user?.role === 'enterprise' || user?.role === 'enterprise_admin') && (
          <h1 className="text-lg font-semibold text-text-primary">Enterprise Admin</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircleIcon className="w-8 h-8 text-text-muted" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{user?.name || 'Admin'}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-secondary"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
