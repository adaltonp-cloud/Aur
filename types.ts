
// Adding React import to resolve the React namespace for ReactNode types
import React from 'react';

export interface KeyConfig {
  label: string;
  value: string;
  type: 'letter' | 'arrow' | 'action' | 'special';
  icon?: React.ReactNode;
}

export interface HistoryItem {
  timestamp: number;
  text: string;
}