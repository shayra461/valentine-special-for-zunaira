 import { useState, useEffect } from 'react';
 
 interface NameRevealProps {
   name: string;
   onComplete?: () => void;
 }
 
 const NameReveal = ({ name, onComplete }: NameRevealProps) => {
   const [visibleLetters, setVisibleLetters] = useState(0);
   const [showSparkles, setShowSparkles] = useState(false);
   const letters = name.toUpperCase().split('');
 
   useEffect(() => {
     if (visibleLetters < letters.length) {
       const timer = setTimeout(() => {
         setVisibleLetters(prev => prev + 1);
       }, 200); // 200ms between each letter
       return () => clearTimeout(timer);
     } else {
       // All letters visible, show sparkles
       setShowSparkles(true);
       onComplete?.();
     }
   }, [visibleLetters, letters.length, onComplete]);
 
   return (
     <div className="relative inline-block py-8">
       {/* Sparkles around name */}
       {showSparkles && (
         <>
           {Array.from({ length: 12 }).map((_, i) => (
             <span
               key={i}
               className="absolute animate-sparkle"
               style={{
                 left: `${10 + (i % 6) * 16}%`,
                 top: `${i < 6 ? '0%' : '85%'}`,
                 animationDelay: `${i * 0.15}s`,
                 fontSize: '1.2rem',
               }}
             >
               {i % 3 === 0 ? '✨' : i % 3 === 1 ? '💕' : '⭐'}
             </span>
           ))}
         </>
       )}
       
       {/* Name letters */}
       <div className="flex items-center justify-center gap-2 md:gap-4">
         <span className="text-2xl md:text-3xl animate-pulse">✨</span>
         {letters.map((letter, index) => (
           <span
             key={index}
             className={`font-romantic text-4xl md:text-6xl lg:text-7xl transition-all duration-500 ${
               index < visibleLetters
                 ? 'opacity-100 translate-y-0 scale-100'
                 : 'opacity-0 translate-y-4 scale-75'
             }`}
             style={{
               color: 'hsl(var(--romantic))',
               textShadow: index < visibleLetters 
                 ? '0 0 20px hsl(var(--romantic) / 0.6), 0 0 40px hsl(var(--romantic) / 0.4)' 
                 : 'none',
               transitionDelay: `${index * 50}ms`,
             }}
           >
             {letter}
           </span>
         ))}
         <span className="text-2xl md:text-3xl animate-pulse">✨</span>
       </div>
       
       {/* Glow effect under name */}
       {showSparkles && (
         <div 
           className="absolute inset-0 -z-10 blur-2xl opacity-50 animate-pulse"
           style={{
             background: 'radial-gradient(ellipse at center, hsl(var(--romantic) / 0.4) 0%, transparent 70%)',
           }}
         />
       )}
     </div>
   );
 };
 
 export default NameReveal;