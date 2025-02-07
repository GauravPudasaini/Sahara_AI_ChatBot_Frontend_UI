import React from "react";
import { ThreeDot } from 'react-loading-indicators';

const LoadingIndicator = () => (
  <div className="fetching-animation">
    <ThreeDot color="#525252" size="small" text="" />
  </div>
);

export default LoadingIndicator;
