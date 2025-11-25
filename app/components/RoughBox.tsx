'use client';

import { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface RoughBoxProps {
  children: React.ReactNode;
  fillColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RoughBox({
  children,
  fillColor = '#FFE599',
  className = '',
  style = {}
}: RoughBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rough rounded rectangle using path
      const radius = 20;
      const x = 2;
      const y = 2;
      const width = canvas.width - 4;
      const height = canvas.height - 4;

      // Create rounded rectangle path
      const path = `M ${x + radius} ${y}
                    L ${x + width - radius} ${y}
                    Q ${x + width} ${y} ${x + width} ${y + radius}
                    L ${x + width} ${y + height - radius}
                    Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
                    L ${x + radius} ${y + height}
                    Q ${x} ${y + height} ${x} ${y + height - radius}
                    L ${x} ${y + radius}
                    Q ${x} ${y} ${x + radius} ${y}
                    Z`;

      rc.path(path, {
        fill: fillColor,
        fillStyle: 'solid',
        stroke: '#2C3E50',
        strokeWidth: 3,
        roughness: 1.5,
        bowing: 1,
      });
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
        ...style
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
      <div style={{ position: 'relative', padding: '15px 30px', height: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );
}
