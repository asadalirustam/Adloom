import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl glass-card border border-border my-6">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-coral/15 border border-coral/30 flex items-center justify-center text-coral mb-4">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-coral/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
