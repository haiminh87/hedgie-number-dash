'use client';

import { useEffect, useRef } from 'react';
import rough from 'roughjs';

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
  disabled = false
}: RoughButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const updateCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get background color from className
      let fillColor = '#90EE90'; // default green
      if (className.includes('btn-yellow')) fillColor = '#FFE599';
      if (className.includes('btn-cyan')) fillColor = '#A8E6E3';
      if (className.includes('btn-blue')) fillColor = '#5DADE2';
      if (className.includes('btn-green')) fillColor = '#90EE90';

      // Draw rough rounded rectangle using path
      const radius = 25;
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

    // Redraw on resize
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
        overflow: 'hidden'
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
          color: '#2C3E50',
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
