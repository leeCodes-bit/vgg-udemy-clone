import React from 'react';
import '../assets/css/backdrop.css';

const Backdrop = () => {
    return (
      <div className="backdrop">
    <div className='spinner_container'>
      <div className='lds-roller'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
      </div>
    )
};

export default Backdrop;