import React from 'react';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';

export const WelcomeBanner = ({ userName, total, upcoming }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  return (
    <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-terracotta/10 via-terracotta-soft/20 to-[#2D6A4F]/10 dark:from-dark-terracotta/10 dark:via-dark-terracotta-soft/20 dark:to-[#E76F51]/10 rounded-2xl border border-terracotta/20 dark:border-dark-terracotta/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="p-2.5 rounded-full bg-terracotta/20 dark:bg-dark-terracotta/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-terracotta dark:text-dark-terracotta" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-deep-charcoal dark:text-dark-text">
              Good {greeting}, {userName}!
            </h2>
            <p className="text-sm text-warm-grey dark:text-dark-text-secondary mt-0.5">
              {total > 0
                ? `You have ${total} trip${total > 1 ? 's' : ''} planned. ${
                    upcoming > 0
                      ? `${upcoming} upcoming adventure${upcoming > 1 ? 's' : ''} await${upcoming > 1 ? '' : 's'} you!`
                      : 'Time to plan your next adventure!'
                  }`
                : 'Ready to plan your next adventure with friends?'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-sm text-warm-grey dark:text-dark-text-secondary flex-shrink-0 pt-1">
          <CalendarIcon className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Date sa ibaba — mobile only */}
      <div className="sm:hidden flex items-center gap-2 text-xs text-warm-grey dark:text-dark-text-secondary mt-3 pt-3 border-t border-terracotta/10 dark:border-dark-terracotta/10">
        <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};