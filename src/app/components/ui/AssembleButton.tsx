import React from 'react';

interface AssembleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'blue' | 'red';
  className?: string;
}

export function AssembleButton({ children, variant = 'blue', className = '', ...props }: AssembleButtonProps) {
  // Цветовая палитра в зависимости от выбранного режима
  const isRed = variant === 'red';
  const cornerColor = isRed ? 'border-red-500' : 'border-[#3D6FC4]';
  const textColor = isRed ? 'text-red-400 hover:text-red-300' : 'text-slate-100 hover:text-white';
  const bgAndBorder = isRed 
    ? 'border-red-950/30 bg-red-950/5 hover:bg-red-950/10' 
    : 'border-slate-800/40 bg-slate-950/20 hover:bg-slate-900/10';

  // Пружинистый тайминг для анимации сбора уголков (cubic-bezier)
  const kineticTransition = {
    transition: 'transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease'
  };

  return (
    <button 
      className={`group relative px-7 py-3.5 border ${bgAndBorder} ${textColor} 
                  font-mono text-xs tracking-widest uppercase cursor-pointer select-none 
                  overflow-visible transition-colors duration-300 rounded-none ${className}`}
      {...props}
    >
      <span 
        style={kineticTransition}
        className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 ${cornerColor} 
                    -translate-x-3.5 -translate-y-3.5 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100`} 
      />
      <span 
        style={kineticTransition}
        className={`absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 ${cornerColor} 
                    translate-x-3.5 -translate-y-3.5 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100`} 
      />
      <span 
        style={kineticTransition}
        className={`absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 ${cornerColor} 
                    -translate-x-3.5 translate-y-3.5 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100`} 
      />
      {/* Правый нижний угол */}
      <span 
        style={kineticTransition}
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 ${cornerColor} 
                    translate-x-3.5 translate-y-3.5 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100`} 
      />
      
      {/* Контент кнопки (иконка + текст) */}
      <div className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
      </div>
    </button>
  );
}