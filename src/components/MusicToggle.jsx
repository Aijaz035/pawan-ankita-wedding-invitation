import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { subscribeMusic, isMusicOn, toggleMusic, unlockAudio } from '../hooks/sound';

export default function MusicToggle({ visible }) {
  const [on, setOn] = useState(isMusicOn());
  useEffect(() => subscribeMusic(setOn), []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className={`music-toggle ${on ? 'is-on' : ''}`}
          onClick={() => { unlockAudio(); toggleMusic(); }}
          aria-label={on ? 'Pause music' : 'Play music'}
          aria-pressed={on}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileTap={{ scale: 0.9 }}
        >
          {on ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
          {on && <span className="ring" aria-hidden="true" />}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
