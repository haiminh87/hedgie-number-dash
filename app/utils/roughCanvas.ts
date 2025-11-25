import rough from 'roughjs';
import { COLORS } from '../constants';

export interface RoughPathOptions {
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  radius?: number;
}

const DEFAULT_OPTIONS: RoughPathOptions = {
  fillColor: COLORS.YELLOW,
  strokeColor: COLORS.PRIMARY,
  strokeWidth: 3,
  roughness: 1.5,
  bowing: 1,
  radius: 20,
};

export function createRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  return `M ${x + radius} ${y}
          L ${x + width - radius} ${y}
          Q ${x + width} ${y} ${x + width} ${y + radius}
          L ${x + width} ${y + height - radius}
          Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
          L ${x + radius} ${y + height}
          Q ${x} ${y + height} ${x} ${y + height - radius}
          L ${x} ${y + radius}
          Q ${x} ${y} ${x + radius} ${y}
          Z`;
}

export function drawRoughRoundedRect(
  canvas: HTMLCanvasElement,
  options: Partial<RoughPathOptions> = {}
): void {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const rc = rough.canvas(canvas);
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = 2;
  const y = 2;
  const width = canvas.width - 4;
  const height = canvas.height - 4;

  const path = createRoundedRectPath(x, y, width, height, mergedOptions.radius!);

  rc.path(path, {
    fill: mergedOptions.fillColor,
    fillStyle: 'solid',
    stroke: mergedOptions.strokeColor,
    strokeWidth: mergedOptions.strokeWidth,
    roughness: mergedOptions.roughness,
    bowing: mergedOptions.bowing,
  });
}

export function getButtonColorFromClassName(className: string): string {
  if (className.includes('btn-yellow')) return COLORS.YELLOW;
  if (className.includes('btn-cyan')) return COLORS.CYAN;
  if (className.includes('btn-blue')) return COLORS.BLUE;
  if (className.includes('btn-green')) return COLORS.GREEN;
  return COLORS.GREEN;
}
