import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Breadcrumb.css';

const Breadcrumb = ({ items = [], separator = '/', className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="breadcrumb-item">
              {!isLast ? (
                <>
                  {item.to ? (
                    <Link to={item.to} className="breadcrumb-link">
                      {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                      <span className="breadcrumb-text">{item.label}</span>
                    </Link>
                  ) : item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="breadcrumb-link breadcrumb-button"
                    >
                      {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                      <span className="breadcrumb-text">{item.label}</span>
                    </button>
                  ) : (
                    <span className="breadcrumb-link">
                      {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                      <span className="breadcrumb-text">{item.label}</span>
                    </span>
                  )}
                  {!isLast && (
                    <span className="breadcrumb-separator" aria-hidden="true">
                      {separator}
                    </span>
                  )}
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  <span className="breadcrumb-text">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

