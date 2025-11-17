'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Instructions() {
  const [currentStep, setCurrentStep] = useState(1);

  const stepTitles = ['Step One', 'Step Two', 'Step Three', 'Step Four'];
  const stepDescriptions = [
    'Press start, customize your game, and press continue.',
    'Wait at an obstacle.',
    'Answer the question',
    'Go on and earn high scores!'
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="page-container peach-bg">
      <div className="container peach-bg" style={{ display: 'flex', flexDirection: 'column', padding: '50px' }}>
        <div className="instructions-content">
          {/* Step Header */}
          <div className="step-header">
            <div className="step-title">{stepTitles[currentStep - 1]}</div>
            <div className="step-dots">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={`dot ${step <= currentStep ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="step-content">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="step active">
                <div className="step-screen split-screen">
                  <div className="left-panel">
                    <div className="mini-home">
                      <div className="mini-title">Hedgie<br/>Number<br/>Dash</div>
                      <div className="mini-buttons">
                        <div className="mini-btn mini-btn-green">Start</div>
                        <div className="mini-btn mini-btn-yellow">How to play</div>
                      </div>
                    </div>
                    <div className="arrow arrow-start">press ↓</div>
                  </div>
                  <div className="right-panel">
                    <div className="mini-customize">
                      <div className="mini-section-title">Grade:</div>
                      <div className="mini-grade-grid">
                        <div className="mini-btn mini-btn-cyan">K</div>
                        <div className="mini-btn mini-btn-cyan">1st</div>
                        <div className="mini-btn mini-btn-cyan">2nd</div>
                        <div className="mini-btn mini-btn-cyan">3rd</div>
                        <div className="mini-btn mini-btn-cyan">4th</div>
                        <div className="mini-btn mini-btn-cyan">5th</div>
                      </div>
                      <div className="mini-section-title">Mode:</div>
                      <div className="mini-mode-group">
                        <div className="mini-btn mini-btn-blue">Endless</div>
                        <div className="mini-btn mini-btn-cyan">90s</div>
                      </div>
                      <div className="mini-btn mini-btn-green continue-btn">Continue</div>
                    </div>
                    <div className="arrow arrow-mode">choose ↗</div>
                    <div className="arrow arrow-continue">then press →</div>
                  </div>
                </div>
                <p className="step-description">{stepDescriptions[0]}</p>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="step active">
                <div className="step-screen">
                  <div className="mini-game">
                    <div className="mini-hedgehog"></div>
                    <div className="mini-obstacles">
                      <div className="mini-obstacle"></div>
                      <div className="mini-obstacle"></div>
                      <div className="mini-obstacle"></div>
                      <div className="mini-obstacle"></div>
                    </div>
                    <div className="mini-ground"></div>
                  </div>
                </div>
                <p className="step-description">{stepDescriptions[1]}</p>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="step active">
                <div className="step-screen">
                  <div className="mini-game">
                    <div className="mini-hearts">❤️❤️❤️</div>
                    <div className="mini-hedgehog"></div>
                    <div className="mini-obstacles">
                      <div className="mini-obstacle"></div>
                      <div className="mini-obstacle"></div>
                      <div className="mini-obstacle"></div>
                      <div className="mini-obstacle"></div>
                    </div>
                    <div className="mini-ground"></div>
                    <div className="mini-answer-area">
                      <div className="mini-input"></div>
                      <div className="mini-score">Score:</div>
                    </div>
                  </div>
                </div>
                <p className="step-description">{stepDescriptions[2]}</p>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="step active">
                <div className="step-screen">
                  <div className="mini-highscore">
                    <div className="mini-highscore-title">High Scores:</div>
                    <div className="mini-highscore-table">
                      <div className="mini-table-header">
                        <span>Name</span>
                        <span>Score</span>
                      </div>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="mini-table-row"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="step-description">{stepDescriptions[3]}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="step-navigation">
            {currentStep > 1 && (
              <button className="btn btn-yellow" onClick={previousStep}>
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button className="btn btn-green" onClick={nextStep}>
                Next
              </button>
            ) : (
              <Link href="/" className="btn btn-green">
                Done
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
