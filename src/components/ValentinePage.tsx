import { useState, useEffect, useCallback } from 'react';
import { useRef } from 'react';
import FloatingHearts from './FloatingHearts';
import Confetti from './Confetti';
import NameReveal from './NameReveal';

type Scene = 'intro' | 'question' | 'celebration';

const playfulMessages = [
  "Are you sure? 😐",
  "Think again 🙄",
  "Really?? 😭",
  "Nice try 😏",
  "Nope, try again 💅",
  "You can't escape 🥺",
  "Just say yes! 💕",
  "Not gonna happen 🙃",
  "Keep trying 😂",
  "I'm faster! 💨",
  "Almost got me 😏",
  "Too slow! 🐢",
  "Never! 💪",
  "Ha! Missed! 😜",
];

const ESCAPE_RADIUS = 150; // pixels - detect mouse from this distance
const MIN_ATTEMPTS_BEFORE_FADE = 20;
const EDGE_PADDING = 100; // avoid screen edges
const YES_BUTTON_SAFE_ZONE = 200; // don't overlap YES button

interface ValentinePageProps {
  name?: string;
}

const ValentinePage = ({ name }: ValentinePageProps) => {
  const [scene, setScene] = useState<Scene>('intro');
  const [showQuestion, setShowQuestion] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(playfulMessages[0]);
  const [showSoftMessage, setShowSoftMessage] = useState(false);
  const [noButtonVisible, setNoButtonVisible] = useState(true);
  const [yesButtonEnlarged, setYesButtonEnlarged] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [moveSpeed, setMoveSpeed] = useState(1);
  const [noButtonWiggle, setNoButtonWiggle] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState(0);
  
  const noButtonRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const lastMoveTime = useRef<number>(0);

  const displayName = name || 'Zunaira';

  const getYesButtonRect = useCallback(() => {
    if (yesButtonRef.current) {
      return yesButtonRef.current.getBoundingClientRect();
    }
    return null;
  }, []);

  const moveNoButton = useCallback(() => {
    const now = Date.now();
    // Throttle to prevent too rapid movements (min 50ms between moves)
    if (now - lastMoveTime.current < 50) return;
    lastMoveTime.current = now;

    const buttonWidth = 100;
    const buttonHeight = 50;
    
    // Calculate safe boundaries
    const minX = EDGE_PADDING;
    const maxX = window.innerWidth - buttonWidth - EDGE_PADDING;
    const minY = EDGE_PADDING;
    const maxY = window.innerHeight - buttonHeight - EDGE_PADDING;
    
    const yesRect = getYesButtonRect();
    
    let newX: number;
    let newY: number;
    let attempts = 0;
    const maxPositionAttempts = 20;
    
    // Find a position that doesn't overlap with YES button
    do {
      newX = minX + Math.random() * (maxX - minX);
      newY = minY + Math.random() * (maxY - minY);
      attempts++;
      
      if (!yesRect) break;
      
      // Check if too close to YES button
      const centerX = newX + buttonWidth / 2;
      const centerY = newY + buttonHeight / 2;
      const yesCenterX = yesRect.left + yesRect.width / 2;
      const yesCenterY = yesRect.top + yesRect.height / 2;
      const distance = Math.sqrt(
        Math.pow(centerX - yesCenterX, 2) + Math.pow(centerY - yesCenterY, 2)
      );
      
      if (distance > YES_BUTTON_SAFE_ZONE) break;
    } while (attempts < maxPositionAttempts);
    
    setNoButtonPosition({ x: newX, y: newY });
    
    // Trigger wiggle animation
    setNoButtonWiggle(true);
    setTimeout(() => setNoButtonWiggle(false), 400);
    
    setNoAttempts(prev => {
      const newCount = prev + 1;
      // Increase speed slightly with each attempt
      setMoveSpeed(1 + newCount * 0.05);
      return newCount;
    });
    setCurrentMessage(playfulMessages[Math.floor(Math.random() * playfulMessages.length)]);
  }, [getYesButtonRect]);

  // Global mouse move detection for desktop
  useEffect(() => {
    if (scene !== 'question' || !showQuestion || !noButtonVisible || showSoftMessage) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!noButtonRef.current) return;
      
      const rect = noButtonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) + 
        Math.pow(e.clientY - buttonCenterY, 2)
      );
      
      // Move button when cursor gets within escape radius
      if (distance < ESCAPE_RADIUS) {
        moveNoButton();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scene, showQuestion, noButtonVisible, showSoftMessage, moveNoButton]);

  // Touch detection for mobile
  useEffect(() => {
    if (scene !== 'question' || !showQuestion || !noButtonVisible || showSoftMessage) return;

    const handleTouch = (e: TouchEvent) => {
      if (!noButtonRef.current) return;
      
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      
      const rect = noButtonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(touch.clientX - buttonCenterX, 2) + 
        Math.pow(touch.clientY - buttonCenterY, 2)
      );
      
      // Move button when touch gets within escape radius
      if (distance < ESCAPE_RADIUS * 1.5) { // Larger radius for touch
        e.preventDefault();
        moveNoButton();
      }
    };

    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('touchmove', handleTouch, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [scene, showQuestion, noButtonVisible, showSoftMessage, moveNoButton]);

  // Initialize NO button position when question appears
  useEffect(() => {
    if (showQuestion && noButtonVisible) {
      // Start in a random position away from center
      const startX = window.innerWidth * 0.6 + Math.random() * (window.innerWidth * 0.2);
      const startY = window.innerHeight * 0.6 + Math.random() * (window.innerHeight * 0.2);
      setNoButtonPosition({ x: startX, y: startY });
    }
  }, [showQuestion, noButtonVisible]);

  useEffect(() => {
    if (noAttempts >= MIN_ATTEMPTS_BEFORE_FADE && !showSoftMessage) {
      setShowSoftMessage(true);
      setTimeout(() => {
        setNoButtonVisible(false);
        setYesButtonEnlarged(true);
      }, 2000);
    }
  }, [noAttempts, showSoftMessage]);

  // Celebration sequence timing
  useEffect(() => {
    if (scene === 'celebration') {
      // Step 1: Show "I knew it" immediately
      setCelebrationStep(1);
      
      // Step 2: Show "Because my Valentine..." after 1.5s
      setTimeout(() => setCelebrationStep(2), 1500);
      
      // Step 3: Show name reveal after 3s
      setTimeout(() => setCelebrationStep(3), 3000);
      
      // Step 4: Show final message after 5s
      setTimeout(() => setCelebrationStep(4), 5500);
    }
  }, [scene]);

  const handleIntroClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScene('question');
      setIsTransitioning(false);
      setTimeout(() => setShowQuestion(true), 2000);
    }, 500);
  };

  const handleYesClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScene('celebration');
      setIsTransitioning(false);
    }, 500);
  };

  // Fail-safe: if somehow clicked, move immediately and ignore
  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    moveNoButton();
  };

  return (
    <div className="min-h-screen bg-romantic-gradient relative overflow-hidden">
      <FloatingHearts />
      
      {/* Intro Scene */}
      {scene === 'intro' && (
        <div 
          className={`flex flex-col items-center justify-center min-h-screen px-6 z-10 relative transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center animate-fade-in-up">
            <h1 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-romantic-deep mb-8 leading-relaxed">
              Hey… I have a very serious <br className="hidden md:block" />
              question for you 😌❤️
            </h1>
          </div>
          
          <button
            onClick={handleIntroClick}
            className="mt-8 px-10 py-4 bg-button-gradient text-primary-foreground font-body font-semibold text-lg md:text-xl rounded-full shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in opacity-0 delay-500"
          >
            Okay, ask me 💭
          </button>
        </div>
      )}

      {/* Question Scene */}
      {scene === 'question' && (
        <div 
          className={`flex flex-col items-center justify-center min-h-screen px-6 z-10 relative transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-romantic text-2xl md:text-4xl lg:text-5xl text-romantic-deep leading-relaxed animate-fade-in-up">
              You make my normal days special,
            </p>
            <p className="font-romantic text-2xl md:text-4xl lg:text-5xl text-romantic-deep leading-relaxed animate-fade-in-up opacity-0 delay-300 mt-2">
              my smiles real,
            </p>
            <p className="font-romantic text-2xl md:text-4xl lg:text-5xl text-romantic-deep leading-relaxed animate-fade-in-up opacity-0 delay-500 mt-2">
              and my life beautiful…
            </p>
            
            {showQuestion && (
              <div className="mt-12 animate-scale-in">
                <h2 className="font-romantic text-3xl md:text-5xl lg:text-6xl text-romantic leading-relaxed">
                  So… will you be my Valentine{displayName !== 'you' ? `, ${displayName}` : ''}? 🌹
                </h2>
                
                {/* Soft message after failed attempts */}
                {showSoftMessage && (
                  <p className="mt-6 text-lg md:text-xl text-romantic-deep animate-fade-in font-body">
                    Okay… jokes aside, you actually mean a lot to me ❤️
                  </p>
                )}
                
                {/* Buttons container */}
                <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
                  <button
                    ref={yesButtonRef}
                    onClick={handleYesClick}
                    className={`px-12 py-5 bg-button-gradient text-primary-foreground font-body font-bold text-xl md:text-2xl rounded-full shadow-button animate-pulse-glow transition-all duration-500 hover:scale-110 ${
                      yesButtonEnlarged ? 'scale-110 px-16 py-6 text-2xl md:text-3xl' : ''
                    }`}
                  >
                    YES 💖
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floating NO button */}
          {showQuestion && noButtonVisible && (
            <div
              ref={noButtonRef}
              className={`fixed z-20 select-none ${noButtonWiggle ? 'animate-wiggle-move' : ''}`}
              style={{
                left: noButtonPosition.x,
                top: noButtonPosition.y,
                transition: `all ${0.15 / moveSpeed}s ease-out`,
                willChange: 'left, top',
              }}
            >
              <div className="flex flex-col items-center">
                {noAttempts > 0 && (
                  <p className="text-sm md:text-base text-white mb-2 font-body whitespace-nowrap drop-shadow-md">
                    {currentMessage}
                  </p>
                )}
                <div
                  onClick={handleNoClick}
                  onTouchStart={handleNoClick}
                  className="px-6 py-3 font-body font-semibold text-sm md:text-base rounded-full border-2 select-none cursor-not-allowed shadow-lg"
                  style={{
                    pointerEvents: 'none', // Completely disable interactions
                    userSelect: 'none',
                    touchAction: 'none',
                    background: 'linear-gradient(135deg, hsl(10, 80%, 65%) 0%, hsl(350, 75%, 60%) 100%)',
                    borderColor: 'hsl(350, 70%, 55%)',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  No 😅
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Celebration Scene */}
      {scene === 'celebration' && (
        <>
          <Confetti />
          <div 
            className={`flex flex-col items-center justify-center min-h-screen px-6 z-10 relative transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="text-center animate-scale-in">
              <div className="text-6xl md:text-8xl mb-6 animate-bounce-soft">
                💖
              </div>
              
              {/* Step 1: I knew it */}
              {celebrationStep >= 1 && (
                <h1 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-romantic-deep leading-relaxed animate-typewriter">
                  I knew it 😌❤️
                </h1>
              )}
              
              {/* Step 2: Because my Valentine... */}
              {celebrationStep >= 2 && (
                <p className="font-romantic text-2xl md:text-4xl text-romantic mt-6 animate-typewriter">
                  Because my Valentine was always you…
                </p>
              )}
              
              {/* Step 3: Name reveal */}
              {celebrationStep >= 3 && (
                <div className="mt-8">
                  <NameReveal name={displayName} />
                </div>
              )}
              
              {/* Step 4: Final message */}
              {celebrationStep >= 4 && (
                <div className="mt-8 animate-typewriter">
                  <h2 className="font-romantic text-3xl md:text-5xl lg:text-6xl text-romantic-deep">
                    Happy Valentine's Day, {displayName} 💐
                  </h2>
                  
                  <p className="font-body text-lg md:text-xl text-muted-foreground mt-8 italic">
                    Forever yours.
                  </p>
                </div>
              )}
            </div>
            
            {/* Extra floating hearts for celebration */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-heart-burst"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 30 + 20}px`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  💕
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ValentinePage;
