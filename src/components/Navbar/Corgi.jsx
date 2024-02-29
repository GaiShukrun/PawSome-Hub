import React from 'react';

function Corgi() {
  return (
    <div className="container">
      <div className="corgi">
        {/* Head section */}
        <div className="head">
          {/* Ears */}
          <div className="ear ear--r"></div>
          <div className="ear ear--l"></div>

          {/* Eyes */}
          <div className="eye eye--left"></div>
          <div className="eye eye--right"></div>

          {/* Face */}
          <div className="face">
            <div className="face__white">
              <div className="face__orange face__orange--l"></div>
              <div className="face__orange face__orange--r"></div>
            </div>
          </div>

          <div className="face__curve"></div>

          {/* Mouth */}
          <div className="mouth">
            {/* Nose and mouth parts */}
            <div className="nose"></div>
            <div className="mouth__left">
              <div className="mouth__left--round"></div>
              <div className="mouth__left--sharp"></div>
            </div>
            <div className="lowerjaw">
              <div className="lips"></div>
              <div className="tongue test"></div>
            </div>
            <div className="snout"></div>
          </div>
        </div>

        {/* Neck, body, and feet */}
        <div className="neck__back"></div>
        <div className="neck__front"></div>
        <div className="body">
          <div className="body__chest"></div>
        </div>
        <div className="foot foot__left foot__front foot__1"></div>
        <div className="foot foot__right foot__front foot__2"></div>
        <div className="foot foot__left foot__back foot__3"></div>
        <div className="foot foot__right foot__back foot__4"></div>

        {/* Tail */}
        <div className="tail test"></div>
      </div>
    </div>
  );
}

export default Corgi;
