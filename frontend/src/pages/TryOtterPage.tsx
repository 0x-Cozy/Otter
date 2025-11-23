import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import TryOtterUI from '../components/tryotter/TryOtterUI';

const TryOtterPage = () => {
  return (
    <div className="relative bg-background">
      <Navbar />
      <section className="relative z-10 bg-background overflow-hidden pt-20">
        <div className="relative">
          <motion.div className="relative z-10">
            <TryOtterUI />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TryOtterPage;
