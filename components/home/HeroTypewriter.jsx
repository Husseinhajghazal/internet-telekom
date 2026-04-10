"use client";

import { useState, useEffect } from "react";

const typewriterPhrases = [
  "بدون عقود التزام",
  "باقات تبدأ من 699 ليرة",
  "دعم فني باللغة العربية",
  "تركيب الخدمة خلال يومين",
];

export default function HeroTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typewriterPhrases[phraseIndex];

    if (!isDeleting && charIndex === currentPhrase.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      return;
    }

    const speed = isDeleting ? 40 : 80;
    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  const displayText = typewriterPhrases[phraseIndex].slice(0, charIndex);

  return (
    <>
      {displayText}
      <span className="animate-pulse">|</span>
    </>
  );
}
