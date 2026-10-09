import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IntroAnimationPage,
  getHasSeenIntro,
  markIntroSeen,
} from './IntroAnimationPage';
import { LandingPage } from './LandingPage';

export const RootPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const forceIntro = searchParams.get('intro') === 'true';
  const forceSkip = searchParams.get('skipIntro') === 'true';

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (forceSkip) return false;
    if (forceIntro) return true;
    return !getHasSeenIntro();
  });

  const handleComplete = () => {
    markIntroSeen();
    setShowIntro(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="min-h-screen w-full"
        >
          <IntroAnimationPage onComplete={handleComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="landing-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="min-h-screen w-full"
        >
          <LandingPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RootPage;
