// src/components/global/MotionLayer.jsx
// TRYIT EDUCATIONS — Premium WOW Motion Layer
import React from 'react'

const FLAMES  = [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93]
const SPARKLES = [5,13,22,31,40,49,58,67,76,85,92,18,44,70]
const EMBERS  = [8,16,24,32,48,56,64,72,88,96]

export default function MotionLayer() {
  return (
    <div aria-hidden="true" className="mg-layer">

      {/* === COSMIC ORBS === */}
      <div className="mg-orb mg-orb-0"/>
      <div className="mg-orb mg-orb-1"/>
      <div className="mg-orb mg-orb-2"/>
      <div className="mg-orb mg-orb-3"/>

      {/* === FLAME STREAMS === */}
      {FLAMES.map((l,i) => (
        <div key={"f"+i} className={"mg-flame mg-flame-"+(i%6)}
          style={{left:l+"%",animationDuration:(4+i%5)+"s",animationDelay:(i*0.55%6)+"s",
            width:(3+i%5)+"px",height:(6+i%10)+"px"}}/>
      ))}

      {/* === EMBER DOTS === */}
      {EMBERS.map((l,i) => (
        <div key={"e"+i} className={"mg-ember mg-ember-"+(i%4)}
          style={{left:l+"%",animationDuration:(8+i%6)+"s",animationDelay:(i*0.8%8)+"s"}}/>
      ))}

      {/* === SPARKLE STARS === */}
      {SPARKLES.map((l,i) => (
        <div key={"s"+i} className={"mg-sparkle mg-sparkle-"+(i%5)}
          style={{left:l+"%",top:(8+i*6%82)+"%",animationDelay:(i*0.35)+"s"}}/>
      ))}

      {/* === SHOOTING STARS === */}
      <div className="mg-shoot mg-shoot-0"/>
      <div className="mg-shoot mg-shoot-1"/>
      <div className="mg-shoot mg-shoot-2"/>
      <div className="mg-shoot mg-shoot-3"/>

      {/* === PULSE RINGS === */}
      <div className="mg-ring mg-ring-0"/>
      <div className="mg-ring mg-ring-1"/>
      <div className="mg-ring mg-ring-2"/>

      {/* === GRADIENT MESH === */}
      <div className="mg-mesh"/>

    </div>
  )
}
