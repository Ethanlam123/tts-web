'use client';

import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">
              AudioConverter
            </h1>
          </div>

  
          {/* Right side - User avatar */}
          <div className="flex items-center">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}