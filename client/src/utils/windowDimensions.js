
import { useState, useEffect } from 'react';

function getWindowDimensions() {

  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
  
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());


  let resizeTimer;
  useEffect(() => {
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowDimensions(getWindowDimensions());
      }, 250);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}