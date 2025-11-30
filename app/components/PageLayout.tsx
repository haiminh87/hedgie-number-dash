'use client';

import { ReactNode } from 'react';
import RoughBox from './RoughBox';

interface PageLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundClass?: 'peach-bg' | 'blue-bg';
  boxStyle?: React.CSSProperties;
  boxFillColor?: string;
}

export default function PageLayout({
  children,
  backgroundImage,
  backgroundClass = 'peach-bg',
  boxStyle = {},
  boxFillColor = 'transparent',
}: PageLayoutProps) {
  const defaultBoxStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'visible',
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
  };

  return (
    <div className={`page-container ${backgroundClass}`}>
      <div className="page-content-wrapper">
        <div className="page-content-box">
          <RoughBox
            fillColor={boxFillColor}
            style={{ ...defaultBoxStyle, ...boxStyle }}
          >
            {children}
          </RoughBox>
        </div>
      </div>
    </div>
  );
}
