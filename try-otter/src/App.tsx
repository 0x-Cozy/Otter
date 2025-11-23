import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import TryOtterUI from './components/TryOtterUI';
import { TutorialGuide } from './components/TutorialGuide';

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('consumer');

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('otter-tutorial-completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('otter-tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="relative bg-background min-h-screen">
      <Navbar activeTab={activeTab} />
      <section className="relative z-10 bg-background overflow-hidden pt-20">
        <TryOtterUI activeTab={activeTab} onTabChange={handleTabChange} />
      </section>
      {showTutorial && <TutorialGuide onComplete={handleTutorialComplete} />}
    </div>
  );
}

export default App;
