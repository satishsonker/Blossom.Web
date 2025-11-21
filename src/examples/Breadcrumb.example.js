/**
 * Breadcrumb Usage Examples
 */

import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import { Link } from 'react-router-dom';

// Example 1: Simple Breadcrumb
export const SimpleBreadcrumb = () => {
  const items = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Electronics', to: '/products/electronics' },
    { label: 'Current Page' }, // Last item (no link)
  ];

  return <Breadcrumb items={items} />;
};

// Example 2: Breadcrumb with Icons
export const BreadcrumbWithIcons = () => {
  const items = [
    { label: 'Home', to: '/', icon: '🏠' },
    { label: 'Dashboard', to: '/dashboard', icon: '📊' },
    { label: 'Settings', icon: '⚙️' },
  ];

  return <Breadcrumb items={items} />;
};

// Example 3: Breadcrumb with Custom Separator
export const BreadcrumbCustomSeparator = () => {
  const items = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact' },
  ];

  return <Breadcrumb items={items} separator=" > " />;
};

// Example 4: Breadcrumb with onClick
export const BreadcrumbWithOnClick = () => {
  const items = [
    { 
      label: 'Home', 
      to: '/',
      icon: '🏠'
    },
    { 
      label: 'Back', 
      onClick: () => window.history.back(),
      icon: '←'
    },
    { 
      label: 'Current Page',
      icon: '📍'
    },
  ];

  return <Breadcrumb items={items} />;
};

// Example 5: Dynamic Breadcrumb
export const DynamicBreadcrumb = ({ pathname }) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const items = [
    { label: 'Home', to: '/', icon: '🏠' },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        to: isLast ? null : path,
        icon: isLast ? '📍' : null,
      };
    }),
  ];

  return <Breadcrumb items={items} />;
};

