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

          {/* Center - Navigation buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
              Dashboard
            </button>
            <button className="text-sm font-medium bg-cyan-primary text-primary-foreground hover:bg-cyan-600 transition-colors px-4 py-2 rounded-md">
              Upgrade
            </button>
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