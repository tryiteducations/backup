import { useEffect } from 'react';

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('mg-visible');
        });
      },
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll('.mg-reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

export default useScrollReveal;
