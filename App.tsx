
import React, { useState, useEffect, useCallback } from 'react';
import Keyboard from './components/Keyboard';
import Display from './components/Display';
import { getSmartSuggestions } from './services/geminiService';
import { HistoryItem } from './types';

// Fixed keyMap to remove duplicate object property names for 'r', 'f', 'x', 'c', and 'v'
const keyMap: Record<string, string> = {
  'w': 'W', 'W': 'W', 'a': 'A', 'A': 'A', 's': 'S', 'S': 'S', 'd': 'D', 'D': 'D',
  'q': 'Q', 'Q': 'Q', 'e': 'E', 'E': 'E', 'r': 'R', 'R': 'R', 'f': 'F', 'F': 'F',
  'x': 'X', 'X': 'X', 'c': 'C', 'C': 'C', 'v': 'V', 'V': 'V', '1': '1', '2': '2', '3': '3',
  'ArrowUp': 'UP', 'ArrowDown': 'DOWN', 'ArrowLeft': 'LEFT', 'ArrowRight': 'RIGHT',
  'Backspace': 'BACKSPACE', 'Enter': 'ENTER', ' ': 'SPACE'
};

const PRESET_BGS = [
  '', // None
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXZueXpueXpueXpueXpueXpueXpueXpueXpueXpueXpueXpueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMGpxP6dOCG70k/giphy.gif', // Matrix-ish
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXZueXpueXpueXpueXpueXpueXpueXpueXpueXpueXpueXpueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L4TNHVeOPpMME/giphy.gif', // Cyberpunk city
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXZueXpueXpueXpueXpueXpueXpueXpueXpueXpueXpueXpueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif', // Abstract lines
];

const App: React.FC = () => {
  const [inputText, setInputText] = useState(() => localStorage.getItem('wasd_current_input') || '');
  const [suggestions, setSuggestions] = useState<string[]>(["Rush B!", "Need healing!", "Cover me!", "GG WP"]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('wasd_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAILoading, setIsAILoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showImeWarning, setShowImeWarning] = useState(true);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isPipActive, setIsPipActive] = useState(false);
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('wasd_bg') || '');
  const [showBgPicker, setShowBgPicker] = useState(false);

  useEffect(() => {
    localStorage.setItem('wasd_current_input', inputText);
  }, [inputText]);

  useEffect(() => {
    localStorage.setItem('wasd_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('wasd_bg', bgImage);
  }, [bgImage]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputText.length > 2 && isOnline) {
        setIsAILoading(true);
        const newSuggestions = await getSmartSuggestions(inputText);
        setSuggestions(newSuggestions);
        setIsAILoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [inputText, isOnline]);

  const handleKeyPress = useCallback((val: string) => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);

    if (val === 'BACKSPACE') {
      setInputText(prev => prev.slice(0, -1));
    } else if (val === 'ENTER') {
      if (inputText.trim()) {
        setHistory(prev => [{ timestamp: Date.now(), text: inputText }, ...prev].slice(0, 10));
        setInputText('');
      }
    } else if (val === 'SPACE') {
      setInputText(prev => prev + ' ');
    } else {
      setInputText(prev => prev + val);
    }
  }, [inputText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mappedKey = keyMap[e.key];
      if (mappedKey) {
        e.preventDefault();
        if (!activeKeys.has(mappedKey)) {
          setActiveKeys(prev => new Set(prev).add(mappedKey));
          handleKeyPress(mappedKey);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const mappedKey = keyMap[e.key];
      if (mappedKey) {
        setActiveKeys(prev => {
          const next = new Set(prev);
          next.delete(mappedKey);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress, activeKeys]);

  const togglePip = async () => {
    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 420,
          height: 580,
        });
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach((style) => {
          pipWindow.document.head.appendChild(style.cloneNode(true));
        });
        const container = document.getElementById('root');
        if (container) {
          pipWindow.document.body.appendChild(container);
          setIsPipActive(true);
          pipWindow.addEventListener("pagehide", () => {
            document.body.appendChild(container);
            setIsPipActive(false);
          });
        }
      } catch (err) {
        console.error("PiP failed:", err);
      }
    } else {
      alert("Seu navegador não suporta janelas flutuantes nativas.");
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-mono ${isPipActive ? 'p-1' : ''}`}>
      <header className="p-3 border-b border-cyan-900 bg-slate-900 flex justify-between items-center shrink-0">
        <h1 className="text-lg font-orbitron font-bold text-cyan-400 tracking-wider">
          WASD <span className="text-pink-500">FLY</span>
        </h1>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowBgPicker(!showBgPicker)}
             className="p-2 bg-slate-800 hover:bg-pink-600 rounded-lg transition-colors group"
             title="Trocar Fundo"
           >
             <svg className="w-5 h-5 text-pink-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
           </button>
           <button 
             onClick={togglePip}
             className="p-2 bg-slate-800 hover:bg-cyan-600 rounded-lg transition-colors group"
             title="Janela Flutuante"
           >
             <svg className="w-5 h-5 text-cyan-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
           </button>
        </div>
      </header>

      {showBgPicker && (
        <div className="bg-slate-900 p-2 border-b border-cyan-900 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button onClick={() => setBgImage('')} className="w-10 h-10 border-2 border-slate-700 rounded bg-slate-950 flex items-center justify-center text-xs">OFF</button>
          {PRESET_BGS.slice(1).map((bg, i) => (
            <button 
              key={i} 
              onClick={() => setBgImage(bg)}
              className={`w-10 h-10 rounded border-2 shrink-0 bg-cover bg-center ${bgImage === bg ? 'border-cyan-500 shadow-glow-cyan' : 'border-slate-700'}`}
              style={{ backgroundImage: `url(${bg})` }}
            />
          ))}
          <div className="flex-1 min-w-[100px]">
            <input 
              type="text" 
              placeholder="Custom URL..." 
              className="w-full h-10 bg-slate-800 text-[10px] px-2 rounded border border-slate-700 focus:border-cyan-500 outline-none"
              onBlur={(e) => e.target.value && setBgImage(e.target.value)}
            />
          </div>
        </div>
      )}

      {showImeWarning && !isPipActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-cyan-500 p-6 rounded-xl max-w-sm shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <h2 className="text-lg font-orbitron font-bold text-cyan-400 mb-3 text-center uppercase">Aura Gamer</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 text-center">
              Personalize seu teclado flutuante com fundos animados (GIFs) ou imagens! Use o ícone de foto no topo.
            </p>
            <button 
              onClick={() => setShowImeWarning(false)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-all"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}

      <main className={`flex-1 overflow-hidden p-3 flex flex-col gap-3 ${isPipActive ? 'justify-center' : ''}`}>
        <Display text={inputText} onCopy={() => navigator.clipboard.writeText(inputText)} isCompact={isPipActive} />
        
        {!isPipActive && (
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-orbitron">Macro Hub</h3>
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-slate-600 text-xs italic">Aguardando entrada...</div>
              ) : (
                history.map((item) => (
                  <div key={item.timestamp} className="bg-slate-900/50 p-2 rounded border border-slate-800 text-xs flex justify-between items-center group">
                    <span className="text-slate-300 truncate mr-2">{item.text}</span>
                    <button onClick={() => setInputText(item.text)} className="text-cyan-500 hover:text-cyan-300 flex-shrink-0">LOAD</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer 
        className="relative shrink-0 border-t border-slate-800 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for readability if background is present */}
        {bgImage && <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] pointer-events-none"></div>}
        
        <div className="relative z-10">
          <div className="flex gap-2 overflow-x-auto p-2 no-scrollbar bg-slate-950/40">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(s)}
                className="whitespace-nowrap px-3 py-1 bg-slate-800/80 border border-slate-700 rounded text-[10px] text-cyan-300 hover:border-cyan-500 transition-colors uppercase font-bold"
              >
                {s}
              </button>
            ))}
          </div>
          <Keyboard onKey={handleKeyPress} activeKeys={activeKeys} isCompact={isPipActive} />
        </div>
      </footer>
    </div>
  );
};

export default App;
