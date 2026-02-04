import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  type: 'heart' | 'circle' | 'star';
}

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      'hsl(340, 80%, 65%)',
      'hsl(350, 70%, 60%)',
      'hsl(330, 60%, 70%)',
      'hsl(0, 80%, 70%)',
      'hsl(340, 50%, 80%)',
      'hsl(320, 60%, 65%)',
    ];

    const types: ('heart' | 'circle' | 'star')[] = ['heart', 'circle', 'star'];

    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 8,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    setPieces(newPieces);
  }, []);

  const renderPiece = (piece: ConfettiPiece) => {
    switch (piece.type) {
      case 'heart':
        return '💖';
      case 'star':
        return '✨';
      case 'circle':
        return (
          <div
            className="rounded-full"
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            fontSize: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {renderPiece(piece)}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
