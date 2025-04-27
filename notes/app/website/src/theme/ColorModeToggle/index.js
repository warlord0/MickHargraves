/**
 * Custom color mode toggle for Black Eyes & Broken Souls
 */

import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

function ColorModeToggle({
  className,
  value,
  onChange,
}) {
  const isBrowser = useIsBrowser();

  const title = translate(
    {
      message: 'Switch between dark and light mode (currently {mode})',
      id: 'theme.colorToggle.ariaLabel',
      description: 'The ARIA label for the navbar color mode toggle',
    },
    {
      mode:
        value === 'dark'
          ? translate({
              message: 'dark mode',
              id: 'theme.colorToggle.ariaLabel.mode.dark',
              description: 'The name for the dark color mode',
            })
          : translate({
              message: 'light mode',
              id: 'theme.colorToggle.ariaLabel.mode.light',
              description: 'The name for the light color mode',
            }),
    },
  );

  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx(
          'clean-btn',
          styles.toggleButton,
          !isBrowser && styles.toggleButtonDisabled,
        )}
        type="button"
        onClick={() => onChange(value === 'dark' ? 'light' : 'dark')}
        disabled={!isBrowser}
        title={title}
        aria-label={title}
        aria-live="polite">
        <div className={styles.toggleIcon}>
          {value === 'dark' ? (
            <div className={styles.moonIcon}>
              <div className={styles.moonOrb}></div>
              {/* Custom red glow for the moon icon */}
              <div className={styles.moonGlow}></div>
            </div>
          ) : (
            <div className={styles.sunIcon}>
              <div className={styles.sunOrb}></div>
              <div className={styles.sunRays}></div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default React.memo(ColorModeToggle);