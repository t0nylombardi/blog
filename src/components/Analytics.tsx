import { useEffect } from 'react';
import { loadGtag } from '../untils/gtag';

const Analytics = () => {
  useEffect(() => {
    loadGtag();
  }, []);

  return null;
};

export default Analytics;
