import { useState, useEffect, useCallback } from 'react';
import FloatingHearts from './FloatingHearts';
import Confetti from './Confetti';

type Scene = 'intro' | 'question' | 'celebration';

const playfulMessages = [
  "Are you sure? 😐",
  "Think again 🙄",
  "Really?? 😭",
  "Nice try 😏",
  "Nope, try again 💅",
  "You can't escape 🥺",
  "Just say yes! 💕",
];

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

  const displayName = name || 'you';

  const moveNoButton = useCallback(() => {
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    setNoButtonPosition({ x: newX, y: newY });
    setNoAttempts(prev => prev + 1);
    setCurrentMessage(playfulMessages[Math.floor(Math.random() * playfulMessages.length)]);
  }, []);

  useEffect(() => {
    if (noAttempts >= 4 && !showSoftMessage) {
      setShowSoftMessage(true);
      setTimeout(() => {
        setNoButtonVisible(false);
        setYesButtonEnlarged(true);
      }, 2000);
    }
  }, [noAttempts, showSoftMessage]);

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

  const handleNoHover = () => {
    if (!showSoftMessage) {
      moveNoButton();
    }
  };

  const handleNoTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!showSoftMessage) {
      moveNoButton();
    }
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
              className="fixed z-20"
              style={{
                left: noButtonPosition.x || '60%',
                top: noButtonPosition.y || '70%',
                transform: noButtonPosition.x ? 'none' : 'translate(-50%, -50%)',
              }}
            >
              <div className="flex flex-col items-center">
                {noAttempts > 0 && (
                  <p className="text-sm md:text-base text-romantic-deep mb-2 animate-wiggle font-body whitespace-nowrap">
                    {currentMessage}
                  </p>
                )}
                <button
                  onMouseEnter={handleNoHover}
                  onTouchStart={handleNoTouch}
                  className="px-6 py-3 bg-secondary text-secondary-foreground font-body font-medium text-sm md:text-base rounded-full border-2 border-border hover:bg-muted transition-all duration-200"
                >
                  No 😅
                </button>
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
              <div className="text-6xl md:text-8xl mb-8 animate-bounce-soft">
                💖
              </div>
              
              <h1 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-romantic-deep leading-relaxed">
                I knew it 😌❤️
              </h1>
              
              <p className="font-romantic text-2xl md:text-4xl text-romantic mt-6 animate-fade-in opacity-0 delay-500">
                Thank you for choosing me…
              </p>
              
              <h2 className="font-romantic text-3xl md:text-5xl lg:text-6xl text-romantic-deep mt-10 animate-fade-in opacity-0 delay-1000">
                Happy Valentine's Day 💐
              </h2>
              
              <p className="font-body text-lg md:text-xl text-muted-foreground mt-12 animate-fade-in opacity-0 delay-1500 italic">
                Forever yours.
              </p>
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
