import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BlurText({
  text = '',
  delay = 80,
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top', // 'top' | 'bottom'
  stepDuration = 0.35,
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = [0.25, 0.1, 0.25, 1],
  onAnimationComplete,
  className = ''
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,-12px,0)' }
      : { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,12px,0)' };

  const defaultTo = [
    {
      filter: 'blur(4px)',
      opacity: 0.6,
      transform: direction === 'top' ? 'translate3d(0,3px,0)' : 'translate3d(0,-3px,0)'
    },
    { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' }
  ];

  const fromSnapshot = animationFrom || defaultFrom;
  const toSnapshot = animationTo || defaultTo;

  return (
    <p ref={ref} className={`inline-flex flex-wrap items-center justify-center ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={fromSnapshot}
          animate={inView ? toSnapshot : fromSnapshot}
          transition={{
            duration: stepDuration,
            delay: (index * delay) / 1000,
            ease: easing
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
          className="inline-block whitespace-pre will-change-[filter,opacity,transform]"
        >
          {element}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </p>
  );
}
