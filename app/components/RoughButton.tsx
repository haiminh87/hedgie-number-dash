'use client';

import { useEffect, useRef } from 'react';
import { drawRoughRoundedRect, getButtonColorFromClassName } from '../utils/roughCanvas';
import { COLORS } from '../constants';

interface RoughButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function RoughButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: RoughButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    const updateCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const fillColor = getButtonColorFromClassName(className);
      drawRoughRoundedRect(canvas, { fillColor, radius: 25 });
    };

    updateCanvas();

    const resizeObserver = new ResizeObserver(updateCanvas);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [className]);

  return (
    <div
      ref={containerRef}
      className={`rough-button-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: '25px',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
        }}
      />
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="rough-button-content"
        style={{
          position: 'relative',
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Virgil, cursive',
          fontSize: '28px',
          fontWeight: 700,
          padding: '20px 40px',
          color: COLORS.PRIMARY,
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {children}
      </button>
    </div>
  );
}
