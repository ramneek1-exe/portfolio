'use client';

import React from 'react';
import Styles from './Hero.module.css';
import Logo from './Logo/Logo';

const Hero = () => {
  return (
    <div className={Styles.hero}>
      <Logo className="my-logo-class" width={420} height={219} />
      <i className={Styles.singh}>Singh</i>
      <i className={Styles.ramneek}>Ramneek</i>
    </div>);
};

export default Hero;