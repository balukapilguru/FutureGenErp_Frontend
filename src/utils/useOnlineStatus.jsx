import { useEffect, useState } from 'react';
import useServiceWorker from '../useSw';


const useOnlineStatus = () => {
  const { sendStatusUpdate } = useServiceWorker();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);
    sendStatusUpdate();
  };


  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;

};

export default useOnlineStatus;
