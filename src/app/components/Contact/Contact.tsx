'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  const buttonsRef = useRef<HTMLDivElement[]>([]);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  buttonsRef.current = [];

  const setBtnRef = (el: HTMLDivElement | null, idx: number) => {
    if (el) buttonsRef.current[idx] = el;
  };

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    buttonsRef.current.forEach((btn) => {
      if (!btn) return;
      const splash = btn.querySelector<HTMLElement>(`.${styles.splash}`);
      const label = btn.querySelector<HTMLElement>('.btnLabel');
      if (!splash || !label) return;

      label.style.zIndex = '3';
      btn.style.zIndex = '2';
      splash.style.zIndex = '1';

      splash.style.setProperty('--inner-color', '#0a0a1a');
      splash.style.setProperty('--mid-color', '#001f4d');
      splash.style.setProperty('--outer-color', '#00e5ff');

      const handleEnter = (e: MouseEvent) => {
        gsap.killTweensOf(splash);
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const maxDim = Math.max(rect.width, rect.height);

        splash.style.left = `${x}px`;
        splash.style.top = `${y}px`;
        splash.style.width = '0px';
        splash.style.height = '0px';
        splash.style.filter = 'blur(25px)';

        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to(splash, { width: maxDim * 4, height: maxDim * 4, duration: 1.2 }, 0)
          .to(splash, { filter: 'blur(8px)', duration: 0.8 }, 0.1)
          .to(splash as any, {
            '--inner-color': '#09258bff',
            '--mid-color': '#106cbbff',
            '--outer-color': '#04d9ff',
            duration: 0.8,
            ease: 'power3.inOut'
          }, 0);
      };

      const handleLeave = (e: MouseEvent) => {
        gsap.killTweensOf(splash);
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.timeline({ defaults: { ease: 'power3.inOut' } })
          .to(splash as any, {
            '--inner-color': '#00cfff',
            '--mid-color': '#0077ff',
            '--outer-color': '#001f4d',
            duration: 0.8
          }, 0)
          .to(splash, {
            width: 0,
            height: 0,
            left: x,
            top: y,
            filter: 'blur(25px)',
            duration: 0.8
          }, 0.15)
          .to(splash as any, {
            '--inner-color': '#0a0a1a',
            '--mid-color': '#001f4d',
            '--outer-color': '#00e5ff',
            duration: 0.4
          }, '>-0.1');
      };

      const handleClick = () => {
        gsap.killTweensOf(btn, '.emailForm button');
        gsap.timeline()
          .to(btn, { '--glow-blur': '10px', '--glow-spread': '1px', duration: 0.12 })
          .to(btn, { '--glow-blur': '0px', '--glow-spread': '0px', duration: 0.2 });
      };

      btn.addEventListener('mouseenter', handleEnter);
      btn.addEventListener('mouseleave', handleLeave);
      btn.addEventListener('click', handleClick);

      cleanups.push(() => {
        btn.removeEventListener('mouseenter', handleEnter);
        btn.removeEventListener('mouseleave', handleLeave);
        btn.removeEventListener('click', handleClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_OWNER!,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_USER!,
        formData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('Failed to send. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsFormOpen((prev) => {
      const newState = !prev;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      const form = formWrapperRef.current;

      if (newState) {
        tl.fromTo(form,
          { opacity: 0, y: -40, scale: 0.9, filter: 'blur(15px)', display: 'none' },
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.6, display: 'flex' }
        );
      } else {
        tl.to(form,
          { opacity: 0, y: -40, scale: 0.95, filter: 'blur(15px)', duration: 0.4, onComplete: () => { if (form) form.style.display = 'none'; } }
        );
      }

      return newState;
    });
  };

  const items = [
    { id: 'email', text: isFormOpen ? 'Cancel' : 'Email', href: '#' },
    { id: 'linkedin', text: 'LinkedIn', href: 'https://www.linkedin.com/in/ramneek-singh-uleth' },
    { id: 'github', text: 'GitHub', href: 'https://github.com/ramneek1-exe' }
  ];

  return (
    <section className={styles.contactSection}>
      <h2 className={styles.contactHeader}>Contact</h2>
      <p className={styles.contactText}>Let's get in touch!</p>

      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          marginTop: '20px'
        }}
      >
        {items.map((item, i) => (
          <li data-cursor-target key={item.id}>
            <div
              data-cursor-target
              ref={(el) => setBtnRef(el, i)}
              className={`${styles.btn} ${item.id === 'email' ? styles.emailBtn : ''}`}
              role="button"
              onClick={item.id === 'email' ? toggleForm : () => {
                if (item.href && item.href !== '#') {
                  window.open(item.href, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <div className={styles.splash} aria-hidden="true" />
              <span className="btnLabel">{item.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <div ref={formWrapperRef} className={styles.emailFormWrapper} style={{ display: 'none' }}>
        <form onSubmit={handleSubmit} className={styles.emailForm}>
          <p>
            My name is{' '}
          <input
            type="text"
            name="name"
            placeholder="[Your Name]"
            className={styles.inlineInputN}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />{' '}
            and I can be reached at{' '}
          <input
            type="email"
            name="email"
            placeholder="example@abc.com"
            className={styles.inlineInputE}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          . 
          </p>
          <label htmlFor="message">Message:</label>
          <textarea
            name="message"
            placeholder="What's on your mind?"
            className={styles.inlineInputM}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <div className="sendButtonContainer">
          <button data-cursor-target type="submit" className={styles.sendButton}>Send</button>
          </div>
          {status && <p className={styles.statusText}>{status}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;
