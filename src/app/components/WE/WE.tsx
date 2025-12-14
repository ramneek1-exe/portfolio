import React from 'react'
import styles from './WE.module.css'
import Image from 'next/image'
import GoA_Logo from '../../../../public/GoA_logo.png'

const WE = () => {
  return (
      <div className={styles.workExperience}>
          <div className={styles.we1}>
              <div className={styles.programDevelopmentAssistant}>Program Development Assistant</div>
              <div className={styles.may2025}>May 2025 - Present</div>
              <div className={styles.governmentOfAlberta}>Government of Alberta</div>
              <Image className={styles.albertaGovernmentLogo2svg1Icon} width={161.6} height={61.7} sizes="100vw" alt="" src={GoA_Logo} />
              <div className={styles.imPartOf}><p>I’m part of a cross-functional team building a new Case Management System - TENET - for the <span className={styles.italics}>Ministry of Jobs, Economy, Trade, and Immigration.</span> Upon release this software will be used by teams province-wide as part of a shift from existing legacy systems. I work closely with <span className={styles.italics}>developers, designers, QA devs, & project leads</span> to track issues, refine features, and support product decisions. Most of my day involves digging into feedback, writing test scenarios, and exploring ways to improve both usability and system performance by <span className={styles.italics}>collaborating</span> with team members and users from external organizations.</p></div>
          </div>
          <div className={styles.we2}>
              <div className={styles.programDevelopmentAssistant}>Software Solutions Specialist</div>
              <div className={styles.programDevelopmentAssistant}>Oct 2024 - Dec 2024</div>
              <div className={styles.governmentOfAlberta1}>Government of Alberta</div>
              <Image className={styles.albertaGovernmentLogo2svg1Icon} width={161.6} height={61.7} sizes="100vw" alt="" src={GoA_Logo} />
              <div className={styles.imPartOf}><p>In this role, I continued supporting internal <span className={styles.italics}>digital</span> projects across departments, expanding on the work I began earlier in the year. The focus shifted to broader <span className={styles.italics}>collaboration & contribution</span> to shared tools across multiple teams.</p></div>
          </div>
          <div className={styles.we3}>
              <div className={styles.summerStudent}>Summer Student</div>
              <div className={styles.programDevelopmentAssistant}>Jun 2024 - Aug 2024</div>
              <div className={styles.governmentOfAlberta2}>Government of Alberta</div>
              <Image className={styles.albertaGovernmentLogo2svg1Icon} width={161.6} height={61.7} sizes="100vw" alt="" src={GoA_Logo} />
              <div className={styles.workingInThe}><p>Working in the <span className={styles.italics}>Ministry of Children and Family Services,</span> I designed and built an internal SharePoint websites for the <span className={styles.italics}>Legal</span> Services and <span className={styles.italics}>Contracting</span> Departments that helped the frontline staff in Child Intervention across Southern Alberta. From gathering input from stakeholders to writing clean components in <span className={styles.italics}>React + TypeScript,</span> this project taught me how to balance technical decisions with real user needs. The interface of the site followed <span className={styles.italics}>Microsoft's Fluent UI 2</span> and GoA standards and prioritized <span className={styles.italics}>accessibility, clarity,</span> and <span className={styles.italics}>ease of use.</span></p></div>
          </div>
      </div>
  )
}

export default WE