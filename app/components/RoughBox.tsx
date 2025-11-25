'use client';

import { useEffect, useRef } from 'react';
import { drawRoughRoundedRect } from '../utils/roughCanvas';
import { COLORS } from '../constants';

interface RoughBoxProps {
  children: React.ReactNode;
  fillColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RoughBox({
  children,
  fillColor = COLORS.YELLOW,
  className = '',
  style = {},
}: RoughBoxProps) {
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

      drawRoughRoundedRect(canvas, { fillColor });
    };

    updateCanvas();

    const resizeObserver = new ResizeObserver(updateCanvas);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [fillColor]);

  return (
    <div
      ref={containerRef}
      className={`rough-box-container ${className}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        ...style,
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
      <div
        style={{
          position: 'relative',
          padding: '15px 30px',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}
