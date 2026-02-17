
import React from 'react';

interface DisplayProps {
  text: string;
  onCopy: () => void;
  isCompact?: boolean;
}

const Display: React.FC<DisplayProps> = ({ text, onCopy, isCompact }) => {
  return (
    <div className="relative group w-full">
      <div className={`w-full bg-slate-900/80 border-2 border-slate-800 rounded-lg shadow-inner flex flex-col justify-between transition-all ${isCompact ? 'p-2 min-h-[50px]' : 'p-4 min-h-[80px]'}`}>
        <div className={`text-cyan-400 break-all font-orbitron leading-tight flex items-center ${isCompact ? 'text-sm' : 'text-lg'}`}>
          {text || <span className="text-slate-700">WAITING...</span>}
          <span className={`inline-block bg-cyan-500 ml-1 animate-pulse ${isCompact ? 'w-1 h-4' : 'w-2 h-5'}`}></span>
        </div>
        
        {!isCompact && (
          <div className="flex justify-end mt-2">
             <button 
               onClick={onCopy}
               className="px-3 py-1 bg-cyan-600/20 text-cyan-400 border border-cyan-600/50 rounded text-[10px] font-bold hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-2"
             >
               COPIAR COMANDO
             </button>
          </div>
        )}
      </div>
      
      {/* Decorative corners - Hidden in compact mode to save space */}
      {!isCompact && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-pink-500 -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-pink-500 -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-pink-500 -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-pink-500 -mb-1 -mr-1"></div>
        </>
      )}
    </div>
  );
};

export default Display;
