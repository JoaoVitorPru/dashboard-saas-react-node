import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { logout } = useAuth();
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{userEmail}</span>
            </div>
            <button
              onClick={logout}
              className="btn-secondary text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
