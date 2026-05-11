import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../GameContext';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  children: React.ReactNode;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export const Window: React.FC<WindowProps> = ({
  id, title, x, y, width, height, minimized, maximized, zIndex, children
}) => {
  const { closeWindow, minimizeWindow, maximizeWindow, bringToFront, updateWindowPos, updateWindowSize } = useGame();
  const [pos, setPos] = useState({ x, y });
  const [size, setSize] = useState({ w: width, h: height });
  const dragging = useRef(false);
  const resizing = useRef<ResizeDir>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => { setPos({ x, y }); }, [x, y]);
  useEffect(() => { setSize({ w: width, h: height }); }, [width, height]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (dragging.current) {
        const nx = Math.max(0, e.clientX - dragOffset.current.x);
        const ny = Math.max(0, e.clientY - dragOffset.current.y);
        setPos({ x: nx, y: ny });
      }
      if (resizing.current) {
        const dir = resizing.current;
        const { mx, my, x: sx, y: sy, w: sw, h: sh } = resizeStart.current;
        const dx = e.clientX - mx;
        const dy = e.clientY - my;
        let nx = sx, ny = sy, nw = sw, nh = sh;
        if (dir.includes('e')) nw = Math.max(320, sw + dx);
        if (dir.includes('s')) nh = Math.max(200, sh + dy);
        if (dir.includes('w')) { nw = Math.max(320, sw - dx); nx = sx + dx; if (nw === 320) nx = sx + sw - 320; }
        if (dir.includes('n')) { nh = Math.max(200, sh - dy); ny = sy + dy; if (nh === 200) ny = sy + sh - 200; }
        setPos({ x: nx, y: ny });
        setSize({ w: nw, h: nh });
      }
    };
    const handleUp = () => {
      if (dragging.current) { dragging.current = false; updateWindowPos(id, pos.x, pos.y); }
      if (resizing.current) { resizing.current = null; updateWindowSize(id, size.w, size.h); }
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => { document.removeEventListener('mousemove', handleMove); document.removeEventListener('mouseup', handleUp); };
  }, [id, pos, size, updateWindowPos, updateWindowSize]);

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    dragging.current = true;
    bringToFront(id);
  }, [id, pos, maximized, bringToFront]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, dir: ResizeDir) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = dir;
    resizeStart.current = { mx: e.clientX, my: e.clientY, x: pos.x, y: pos.y, w: size.w, h: size.h };
    bringToFront(id);
  }, [id, pos, size, bringToFront]);

  if (minimized) return null;

  const style = maximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex }
    : { top: pos.y, left: pos.x, width: size.w, height: size.h, zIndex };

  return (
    <div
      className="absolute flex flex-col overflow-hidden window-shadow animate-[fade-in_0.15s_ease-out]"
      style={{
        ...style,
        background: 'rgba(245,245,248,0.97)',
        backdropFilter: 'blur(24px)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.5)',
      }}
      onMouseDown={() => bringToFront(id)}
    >
      {/* Naslovna traka */}
      <div
        className="flex items-center justify-between shrink-0 select-none"
        style={{
          height: 34,
          paddingLeft: 12,
          paddingRight: 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,240,245,0.92) 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          cursor: maximized ? 'default' : 'move',
          borderRadius: '10px 10px 0 0',
        }}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <span className="text-xs font-semibold text-gray-700 truncate flex-1 pr-2">{title}</span>
        <div className="flex items-center shrink-0">
          <button
            onClick={e => { e.stopPropagation(); minimizeWindow(id); }}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200/80 transition-colors rounded"
            title="Minimiziraj"
          >
            <Minus size={13} className="text-gray-600" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); maximizeWindow(id); }}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200/80 transition-colors rounded"
            title={maximized ? 'Vrati' : 'Maksimiziraj'}
          >
            {maximized ? <Square size={11} className="text-gray-600" /> : <Maximize2 size={12} className="text-gray-600" />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); closeWindow(id); }}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors rounded"
            title="Zatvori"
          >
            <X size={13} className="text-gray-600 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Sadržaj */}
      <div className="flex-1 overflow-auto min-h-0">
        {children}
      </div>

      {/* Resize handles */}
      {!maximized && (
        <>
          <div className="resize-handle resize-handle-e"  onMouseDown={e => handleResizeMouseDown(e, 'e')} />
          <div className="resize-handle resize-handle-s"  onMouseDown={e => handleResizeMouseDown(e, 's')} />
          <div className="resize-handle resize-handle-se" onMouseDown={e => handleResizeMouseDown(e, 'se')} />
          <div className="resize-handle resize-handle-w"  onMouseDown={e => handleResizeMouseDown(e, 'w')} />
          <div className="resize-handle resize-handle-n"  onMouseDown={e => handleResizeMouseDown(e, 'n')} />
          <div className="resize-handle resize-handle-sw" onMouseDown={e => handleResizeMouseDown(e, 'sw')} />
          <div className="resize-handle resize-handle-nw" onMouseDown={e => handleResizeMouseDown(e, 'nw')} />
          <div className="resize-handle resize-handle-ne" onMouseDown={e => handleResizeMouseDown(e, 'ne')} />
        </>
      )}
    </div>
  );
};
