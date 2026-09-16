import React from 'react';

export const MemberAvatar = ({ member, size = 'w-8 h-8' }) => {
  if (!member) return null;

  if (typeof member === 'string') {
    return (
      <div
        className={`${size} rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center border-2 border-white dark:border-dark-card`}
      >
        <span className="text-xs font-medium text-deep-charcoal dark:text-dark-text">?</span>
      </div>
    );
  }

  const initials = member.name?.charAt(0)?.toUpperCase() || '?';
  const hasAvatar = member.avatar && typeof member.avatar === 'string';

  return (
    <div
      className={`${size} rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center border-2 border-white dark:border-dark-card overflow-hidden`}
      title={member.name || ''}
    >
      {hasAvatar ? (
        <img
          src={member.avatar}
          alt={member.name || 'Member'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.style?.setProperty('display', 'flex');
          }}
        />
      ) : null}

      <span
        className="text-xs font-medium text-deep-charcoal dark:text-dark-text"
        style={{ display: hasAvatar ? 'none' : 'flex' }}
      >
        {initials}
      </span>
    </div>
  );
};