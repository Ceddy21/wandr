import React from 'react';

export const MemberAvatar = ({ member, size = 'w-8 h-8' }) => {
  if (!member) return null;
  const initials = member.name?.charAt(0) || '?';

  return (
    <div
      className={`${size} rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center border-2 border-white dark:border-dark-card`}
      title={member.name}
    >
      <span className="text-xs font-medium text-deep-charcoal dark:text-dark-text">
        {initials}
      </span>
    </div>
  );
};