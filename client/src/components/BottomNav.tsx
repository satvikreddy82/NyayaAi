import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', label: t('navHome', 'Home'), icon: 'home' },
    { to: '/cases', label: t('navCases', 'Cases'), icon: 'folder_open' },
    { to: '/documents', label: t('navDocuments', 'Documents'), icon: 'description' },
    { to: '/help', label: t('navHelp', 'Help'), icon: 'support_agent' },
    { to: '/privacy', label: t('navProfile', 'Privacy'), icon: 'shield' }
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 safe-bottom bg-surface-container-lowest border-t border-outline-variant shadow-sm md:hidden"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-3 py-1.5 transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-primary-container text-on-primary rounded-xl shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
              >
                {item.icon}
              </span>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'font-bold text-on-primary' : 'font-medium'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
