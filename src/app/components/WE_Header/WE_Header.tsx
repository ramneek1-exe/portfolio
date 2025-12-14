import React from 'react'
import styles from './WE_Header.module.css'
import AnimatedUnderline from '../AnimatedUnderline/AnimatedUnderline'

const WE_Header = () => {
  return (
      <div className={styles.weHeader}>
          {/* <i className={styles.applyingWhatI}>Applying what I know, learning what I don’t.</i> */}
          <div className={styles.workExperience}>Work Experience</div>
          <AnimatedUnderline text="Applying what I know, learning what I don’t."/>
      </div>
  )
}

export default WE_Header