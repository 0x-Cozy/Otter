import UseOtterHero from '../components/useotter/UseOtterHero';
import UseOtterUI from '../components/useotter/UseOtterUI';
import { motion } from 'framer-motion';

const UseOtterPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-screen">
        <UseOtterHero />
      </section>

      <section className="relative bg-black overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"
        />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(100, 200, 255, 0.2) 0%, transparent 50%),
                              radial-gradient(circle at 40% 80%, rgba(120, 255, 200, 0.2) 0%, transparent 50%)`,
          }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            backgroundPosition: 'center center'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <UseOtterUI />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="relative z-10 text-center pb-10"
        >
          <div className="text-gray-500 font-mono text-sm uppercase tracking-wider">
            Scroll for more
          </div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 mx-auto mt-2 border border-gray-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-gray-500 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default UseOtterPage;