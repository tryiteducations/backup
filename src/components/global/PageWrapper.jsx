import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const PageWrapper = ({ children }) => (
  <motion.div variants={variants} initial="initial" animate="animate" exit="exit"
    style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
    {children}
  </motion.div>
);

export default PageWrapper;
