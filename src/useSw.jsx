import { useState, useEffect } from 'react';

const useServiceWorker = (isOnline, isLoggedIn) => {
  const [usingSW, setUsingSW] = useState('serviceWorker' in navigator);
  const [swRegistration, setSWRegistration] = useState(null);
  const [svcworker, setSvcWorker] = useState(null);

  function sendStatusUpdate(target) {
    sendSWMessage({ statusUpdate: { isOnline, isLoggedIn } }, target);
  }

  const sendSWMessage = (msg, target) => {
    if (target) {
      target.postMessage(msg);
    } else if (svcworker) {
      svcworker.postMessage(msg);
    } else if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  };

  const onControllerChange = () => {
    const newSvcWorker = navigator.serviceWorker.controller;
    setSvcWorker(newSvcWorker);
    sendStatusUpdate(newSvcWorker);
  };

  const onSWMessage = (event) => {
    
    var { data } = event;
    if (data.statusUpdateRequest) {
 
      sendStatusUpdate(event.ports && event.ports[0]);
    } else if (data == 'force-logout') {
      document.cookie = 'isLoggedIn=';

      sendStatusUpdate();
    }
  };

  const initServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none',
      });

      setSWRegistration(registration);
      const worker =
        registration.installing || registration.waiting || registration.active;
      setSvcWorker(worker);
      sendStatusUpdate(worker);
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        onControllerChange
      );
      navigator.serviceWorker.addEventListener('message', onSWMessage, false);
    } catch (error) {
      console.error('Error initializing service worker:', error);
    }
  };

  const cleanupServiceWorker = async () => {
    if (swRegistration) {
      try {
        await swRegistration.unregister();
       
      } catch (error) {
        console.error('Error during Service Worker unregister:', error);
      }
    }
  };


  useEffect(() => {
    if (usingSW) {
      initServiceWorker();
    }

    return () => {
      cleanupServiceWorker();
    };
  }, []);

  return {
    usingSW,
    swRegistration,
    svcworker,
    sendSWMessage,
    sendStatusUpdate,
  };

};

export default useServiceWorker;
