
import React from 'react';

interface KeyboardProps {
  onKey: (val: string) => void;
  activeKeys: Set<string>;
  isCompact?: boolean;
}

const Key: React.FC<{ 
  val: string; 
  label?: string | React.ReactNode; 
  className?: string; 
  isActive: boolean;
  isCompact?: boolean;
  onClick: (v: string) => void 
}> = ({ val, label, className, isActive, isCompact, onClick }) => {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onClick(val);
      }}
      className={`
        flex items-center justify-center rounded-md font-bold select-none transition-all
        ${isActive ? 'scale-90 brightness-150' : ''}
        ${isCompact ? 'h-10 text-xs' : 'h-12 text-sm'}
        ${className || 'bg-slate-800/70 backdrop-blur-sm text-slate-100 border-b-2 border-slate-950/50 shadow-md'}
      `}
      style={{
          boxShadow: isActive ? '0 0 15px rgba(6,182,212,0.8)' : undefined
      }}
    >
      {label || val}
    </button>
  );
};

const Keyboard: React.FC<KeyboardProps> = ({ onKey, activeKeys, isCompact }) => {
  const gap = isCompact ? 'gap-1' : 'gap-2';
  
  return (
    <div className={`w-full max-w-lg mx-auto transition-all ${isCompact ? 'p-1' : 'p-3'}`}>
      {/* Top Row */}
      <div className={`grid grid-cols-7 ${gap} mb-2`}>
        {!isCompact && <Key val="1" isActive={activeKeys.has('1')} className="bg-slate-800/30 text-slate-600" onClick={onKey} />}
        {!isCompact && <Key val="2" isActive={activeKeys.has('2')} className="bg-slate-800/30 text-slate-600" onClick={onKey} />}
        
        <Key 
          val="W" 
          isActive={activeKeys.has('W')}
          isCompact={isCompact}
          className={`bg-cyan-900/40 text-cyan-400 border border-cyan-500/40 font-orbitron ${activeKeys.has('W') ? 'bg-cyan-500 text-white' : ''}`} 
          onClick={onKey} 
        />
        
        {!isCompact && <Key val="3" isActive={activeKeys.has('3')} className="bg-slate-800/30 text-slate-600" onClick={onKey} />}
        
        <Key 
          val="UP" 
          isActive={activeKeys.has('UP')}
          isCompact={isCompact}
          label={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>}
          className={`col-start-6 bg-pink-900/40 text-pink-400 border border-pink-500/40 font-orbitron ${activeKeys.has('UP') ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899]' : ''}`} 
          onClick={onKey} 
        />
        <div className="col-start-7"></div>
      </div>

      {/* Mid Row */}
      <div className={`grid grid-cols-7 ${gap} mb-2`}>
        {!isCompact && <Key val="Q" isActive={activeKeys.has('Q')} className="bg-slate-800/50" onClick={onKey} />}
        
        <Key 
          val="A" 
          isActive={activeKeys.has('A')}
          isCompact={isCompact}
          className={`bg-cyan-900/40 text-cyan-400 border border-cyan-500/40 font-orbitron ${activeKeys.has('A') ? 'bg-cyan-500 text-white' : ''}`} 
          onClick={onKey} 
        />
        <Key 
          val="S" 
          isActive={activeKeys.has('S')}
          isCompact={isCompact}
          className={`bg-cyan-900/40 text-cyan-400 border border-cyan-500/40 font-orbitron ${activeKeys.has('S') ? 'bg-cyan-500 text-white' : ''}`} 
          onClick={onKey} 
        />
        <Key 
          val="D" 
          isActive={activeKeys.has('D')}
          isCompact={isCompact}
          className={`bg-cyan-900/40 text-cyan-400 border border-cyan-500/40 font-orbitron ${activeKeys.has('D') ? 'bg-cyan-500 text-white' : ''}`} 
          onClick={onKey} 
        />
        
        {!isCompact && <Key val="E" isActive={activeKeys.has('E')} className="bg-slate-800/50" onClick={onKey} />}

        <Key 
          val="LEFT" 
          isActive={activeKeys.has('LEFT')}
          isCompact={isCompact}
          label={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>}
          className={`bg-pink-900/40 text-pink-400 border border-pink-500/40 ${activeKeys.has('LEFT') ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899]' : ''}`} 
          onClick={onKey} 
        />
        <Key 
          val="RIGHT" 
          isActive={activeKeys.has('RIGHT')}
          isCompact={isCompact}
          label={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>}
          className={`bg-pink-900/40 text-pink-400 border border-pink-500/40 ${activeKeys.has('RIGHT') ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899]' : ''}`} 
          onClick={onKey} 
        />
      </div>

      {/* Bottom Row */}
      <div className={`grid grid-cols-7 ${gap} ${isCompact ? 'mb-1' : 'mb-2'}`}>
        {!isCompact && <Key val="R" isActive={activeKeys.has('R')} className="bg-slate-800/50" onClick={onKey} />}
        {!isCompact && <Key val="F" isActive={activeKeys.has('F')} className="bg-slate-800/50" onClick={onKey} />}
        {!isCompact && <Key val="C" isActive={activeKeys.has('C')} className="bg-slate-800/50" onClick={onKey} />}
        {!isCompact && <div className="col-span-2"></div>}
        {isCompact && <div className="col-span-5"></div>}

        <div className="col-start-6"></div>
        <Key 
          val="DOWN" 
          isActive={activeKeys.has('DOWN')}
          isCompact={isCompact}
          label={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>}
          className={`bg-pink-900/40 text-pink-400 border border-pink-500/40 ${activeKeys.has('DOWN') ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899]' : ''}`} 
          onClick={onKey} 
        />
      </div>

      {/* Action Row */}
      <div className={`grid grid-cols-7 ${gap}`}>
        <Key 
          val="BACKSPACE" 
          isActive={activeKeys.has('BACKSPACE')}
          isCompact={isCompact}
          label="DEL"
          className={`col-span-1 border-b-2 ${activeKeys.has('BACKSPACE') ? 'bg-red-500 text-white' : 'bg-red-900/30 text-red-400 border-red-900/50'}`} 
          onClick={onKey} 
        />
        <Key 
          val="SPACE" 
          isActive={activeKeys.has('SPACE')}
          isCompact={isCompact}
          label="___"
          className={`col-span-4 border-b-2 ${activeKeys.has('SPACE') ? 'bg-slate-500 text-white' : 'bg-slate-700/60 text-slate-300 border-slate-900/50'}`} 
          onClick={onKey} 
        />
        <Key 
          val="ENTER" 
          isActive={activeKeys.has('ENTER')}
          isCompact={isCompact}
          label="OK"
          className={`col-span-2 border-b-2 font-orbitron ${activeKeys.has('ENTER') ? 'bg-emerald-400 text-white' : 'bg-emerald-600/80 text-white border-emerald-900/50'}`} 
          onClick={onKey} 
        />
      </div>
    </div>
  );
};

export default Keyboard;
