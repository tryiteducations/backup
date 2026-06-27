import React from 'react';

const MotionLayer = () => (
  <div aria-hidden="true" className="mg-layer">
    <div className="mg-orb mg-orb-0" />
    <div className="mg-orb mg-orb-1" />
    <div className="mg-orb mg-orb-2" />
    {[...Array(24)].map((_, i) => (
      <div key={"dot" + i} className={"mg-dot mg-dot-" + (i % 8)} />
    ))}
  </div>
);

export default MotionLayer;
