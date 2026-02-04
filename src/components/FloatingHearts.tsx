import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      for (let i = 0; i < 15; i++) {
        newHearts.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 20 + 12,
          delay: Math.random() * 8,
          duration: Math.random() * 4 + 6,
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
