import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface TutorialGuideProps {
  onComplete?: () => void;
}

export const TutorialGuide = ({ onComplete }: TutorialGuideProps) => {
  const driverRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        popoverClass: 'driver-popover',
        steps: [
          {
            element: '[data-tutorial="intro"]',
            popover: {
              title: 'Welcome to OTTER! 🦦',
              description: 'OTTER is a data exchange layer with two types of users: Data Providers (who publish and encrypt data) and Data Consumers (who search and decrypt data). Switch between tabs to explore each role.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '[data-tutorial="tabs"]',
            popover: {
              title: 'Consumer & Provider Tabs',
              description: 'Use these tabs to switch between Consumer mode (search & decrypt) and Provider mode (publish & encrypt). Each tab has different features tailored to that role.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '[data-tutorial="consumer-search"]',
            popover: {
              title: 'Search Bar',
              description: 'Search by Policy Object ID (starts with 0x) or Blob ID. Policy Object IDs show all blobs in that policy, while Blob IDs decrypt a specific blob directly.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '[data-tutorial="consumer-card"]',
            popover: {
              title: 'Data Viewer Card',
              description: 'This card displays search results. If you search by Policy Object ID, you\'ll see a list of blobs. Select a blob to decrypt it. If you search by Blob ID, decryption starts immediately.',
              side: 'right',
              align: 'start',
            },
          },
          {
            element: '[data-tutorial="consumer-image"]',
            popover: {
              title: 'Image Display Area',
              description: 'Decrypted images appear here. Use the Reset button to return to the default image. This area uses 3D tilt effects - move your mouse to see it in action!',
              side: 'left',
              align: 'center',
            },
          },
          {
            element: '[data-tutorial="tabs"]',
            popover: {
              title: 'Switch to Provider Tab',
              description: '<Switch to the <strong>"Provider (Publish & Encrypt)"</strong> tab above to learn about publishing and encrypting data. Click the Help button again when you\'re on the Provider tab to start the Provider tutorial.',
              side: 'bottom',
              align: 'center',
            },
          },
        ],
        onDestroyStarted: () => {
          if (onComplete) {
            onComplete();
          }
        },
      });

      driverRef.current = driverObj;
      driverObj.drive();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [onComplete]);

  return null;
};

export const startConsumerTutorial = () => {
  setTimeout(() => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      popoverClass: 'driver-popover',
      steps: [
        {
          element: '[data-tutorial="intro"]',
          popover: {
            title: 'Welcome to OTTER! 🦦',
            description: 'OTTER is a data exchange layer with two types of users: Data Providers (who publish and encrypt data) and Data Consumers (who search and decrypt data). Switch between tabs to explore each role.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tutorial="tabs"]',
          popover: {
            title: 'Consumer & Provider Tabs',
            description: 'Use these tabs to switch between Consumer mode (search & decrypt) and Provider mode (publish & encrypt). Each tab has different features tailored to that role.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tutorial="consumer-search"]',
          popover: {
            title: 'Search Bar',
            description: 'Search by Policy Object ID (starts with 0x) or Blob ID. Policy Object IDs show all blobs in that policy, while Blob IDs decrypt a specific blob directly.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tutorial="consumer-card"]',
          popover: {
            title: 'Data Viewer Card',
            description: 'This card displays search results. If you search by Policy Object ID, you\'ll see a list of blobs. Select a blob to decrypt it. If you search by Blob ID, decryption starts immediately.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '[data-tutorial="consumer-image"]',
          popover: {
            title: 'Image Display Area',
            description: 'Decrypted images appear here. Use the Reset button to return to the default image. This area uses 3D tilt effects - move your mouse to see it in action!',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: '[data-tutorial="tabs"]',
          popover: {
            title: 'Switch to Provider Tab',
            description: '👉 Switch to the <strong>"Provider (Publish & Encrypt)"</strong> tab above to learn about publishing and encrypting data. Click the Help button again when you\'re on the Provider tab to start the Provider tutorial.',
            side: 'bottom',
            align: 'center',
          },
        },
      ],
    });

    driverObj.drive();
  }, 300);
};

export const startProviderTutorial = () => {
  setTimeout(() => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      popoverClass: 'driver-popover',
      steps: [
        {
          element: '[data-tutorial="provider-tabs"]',
          popover: {
            title: 'Provider Mode',
            description: 'Welcome to Provider mode! Here you can upload and encrypt images with different pricing models. Of course in real scenerios you\'d be the one to deploy your contract and set your own access controls and pricing models. These are just options to show how Otter removes the need for an interface and allows for direct access control and interactions at the data level. Let\'s explore the options below.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tutorial="allowlist-card"]',
          popover: {
            title: 'Allowlist Card',
            description: 'Pay once (0.1 SUI) and get forever access to all images uploaded with this policy. Perfect for one-time purchases. Images are stored as single, unchunked files.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tutorial="subscription-card"]',
          popover: {
            title: 'Subscription Card',
            description: 'Pay for time-based access (3 mins). After the subscription expires, users need to renew to access the content again. Also uses unchunked storage.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tutorial="chunk-constant-card"]',
          popover: {
            title: 'Fixed Per-Chunk Pricing',
            description: 'Chunked data with fixed pricing per chunk (e.g., 0.01 SUI per chunk). Users pay for each chunk they want to decrypt. Great for large files that can be streamed.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '[data-tutorial="chunk-dynamic-card"]',
          popover: {
            title: 'Progressive Pricing',
            description: 'Chunked data with progressive pricing - the initial chunks are cheaper so users can try out the data and then pay premium for the rest if it is what they want.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '[data-tutorial="connect-wallet"]',
          popover: {
            title: 'Connect Wallet',
            description: 'Connect your Sui wallet to interact with OTTER. You\'ll need it to pay for access, upload content, and decrypt data. Click here to connect or manage your wallet.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '[data-tutorial="help-button"]',
          popover: {
            title: 'Need Help?',
            description: 'You can always access this tutorial again by clicking the Help button. Explore OTTER and start exchanging data with ease!',
            side: 'bottom',
            align: 'end',
          },
        },
      ],
    });

    driverObj.drive();
  }, 300);
};

export const startTutorial = (activeTab?: string) => {
  if (activeTab === 'provider') {
    startProviderTutorial();
  } else {
    startConsumerTutorial();
  }
};

