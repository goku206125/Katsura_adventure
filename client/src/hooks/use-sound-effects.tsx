import { useCallback, useRef } from "react";

interface SoundEffect {
  name: string;
  url?: string;
  frequency?: number;
  duration?: number;
}

const soundEffects: Record<string, SoundEffect> = {
  'adventures': { name: 'POW!', frequency: 440, duration: 200 },
  'quotes': { name: 'ZURA!', frequency: 523, duration: 300 },
  'games': { name: 'BANG!', frequency: 330, duration: 250 },
  'videos': { name: 'KATSURA!', frequency: 392, duration: 350 },
  'quote': { name: 'JOUI!', frequency: 659, duration: 200 },
  'category': { name: 'DA!', frequency: 494, duration: 150 },
  'elizabeth': { name: 'HUNGRY!', frequency: 349, duration: 400 },
  'correct': { name: 'PATRIOT!', frequency: 784, duration: 300 },
  'wrong': { name: 'FAIL!', frequency: 220, duration: 500 },
  'feed': { name: 'CHOMP!', frequency: 587, duration: 200 },
  'katsurap': { name: 'YO!', frequency: 698, duration: 250 },
  'next': { name: 'NEXT!', frequency: 523, duration: 150 },
  'disguise': { name: 'ZURAKO!', frequency: 440, duration: 300 },
  'play': { name: 'PLAY!', frequency: 880, duration: 200 }
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    }
    return audioContextRef.current;
  }, []);

  const createSoundEffect = useCallback((text: string, x: number, y: number) => {
    const effect = document.createElement('div');
    effect.className = 'sound-effect';
    effect.textContent = text;
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.position = 'fixed';
    effect.style.zIndex = '9999';
    effect.style.pointerEvents = 'none';
    effect.style.fontFamily = 'Creepster, cursive';
    effect.style.fontWeight = 'bold';
    effect.style.fontSize = '24px';
    effect.style.color = '#ef4444';
    effect.style.textShadow = '-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF';
    
    document.body.appendChild(effect);
    
    // Animate the effect
    effect.style.animation = 'pop 0.6s ease-out forwards';
    
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 600);
  }, []);

  const playBeep = useCallback((frequency: number, duration: number) => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  }, [initAudioContext]);

  const playSound = useCallback((soundName: string, event?: MouseEvent) => {
    const sound = soundEffects[soundName];
    if (!sound) return;

    // Play beep sound
    if (sound.frequency && sound.duration) {
      playBeep(sound.frequency, sound.duration);
    }

    // Create visual effect
    const x = event ? event.clientX : Math.random() * window.innerWidth;
    const y = event ? event.clientY : Math.random() * window.innerHeight;
    createSoundEffect(sound.name, x, y);
  }, [playBeep, createSoundEffect]);

  const playRandomSound = useCallback((event?: MouseEvent) => {
    const sounds = ['POW!', 'BANG!', 'ZURA!', 'KATSURA!', 'JOUI!', 'DA!'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    
    const x = event ? event.clientX : Math.random() * window.innerWidth;
    const y = event ? event.clientY : Math.random() * window.innerHeight;
    
    createSoundEffect(randomSound, x, y);
    playBeep(440 + Math.random() * 440, 200 + Math.random() * 300);
  }, [createSoundEffect, playBeep]);

  const playKonamiCode = useCallback(() => {
    // Special effect for konami code
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createSoundEffect('ZURA JANAI!', 
                        Math.random() * window.innerWidth, 
                        Math.random() * window.innerHeight);
        playBeep(440 + Math.random() * 880, 100);
      }, i * 100);
    }
    
    // Add screen shake
    document.body.style.animation = 'shake 2s ease-in-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 2000);
  }, [createSoundEffect, playBeep]);

  return {
    playSound,
    playRandomSound,
    playKonamiCode,
    playBeep
  };
}
