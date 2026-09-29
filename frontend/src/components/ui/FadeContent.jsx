import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function FadeContent({
  children,
  blur = false,
  duration = 0.6,
  ease = 'power2.out',
  _threshold = 0.1,
  initialOpacity = 0,
  _disappearAfter = 0,
  delay = 0,
  className = ''
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: initialOpacity,
          y: 12,
          filter: blur ? 'blur(8px)' : 'none'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: duration,
          delay: delay,
          ease: ease
        }
      );
    }, elementRef);

    return () => ctx.revert();
  }, [blur, duration, ease, initialOpacity, delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
