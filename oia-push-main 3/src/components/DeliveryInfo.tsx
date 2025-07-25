import { motion } from 'framer-motion';

const DeliveryInfo = () => {
  return (
    <motion.div 
      className="flex items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span 
        className="text-foreground flex-shrink-0"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        🚚
      </motion.span>
      <motion.span
        className="text-xs font-medium leading-tight max-w-[160px] sm:max-w-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <span className="inline-flex items-center">
          <span>Receba de 20 a 40 minutos na sua casa</span>
        </span>
      </motion.span>
    </motion.div>
  );
};

export default DeliveryInfo; 