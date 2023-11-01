import React from 'react';
import { useAccordionItem, useAccordionItemEffect, useHeightTransition } from '@szhsin/react-accordion';
import styled from '@emotion/styled';
import { images } from './images';
import styles from '@/styles/history.module.sass';

const Chevron = styled.i({
  transition: 'transform .75s cubic-bezier(0, 0, 0, 1)',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.downLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.downDark}) no-repeat 50% 50%/contain`,
  },

  '&.icon-entered': {
    transform: 'rotate(-180deg)',
  },
  '&.icon-exited': {
    transform: 'rotate(0deg)',
  },
});

const AccordionItem = ({
  header,
  stat,
  children,
  itemKey,
  initialEntered,
  disabled,
}: {
  header: React.ReactNode;
  stat: React.ReactNode;
  children: React.ReactNode;
  itemKey?: string | number;
  initialEntered?: boolean;
  disabled?: boolean;
}) => {
  const { itemRef, state, toggle } = useAccordionItemEffect<HTMLDivElement>({
    itemKey,
    initialEntered,
    disabled,
  });
  const { buttonProps, panelProps } = useAccordionItem({
    state,
    toggle,
    disabled,
  });

  const [transitionStyle, panelRef] = useHeightTransition<HTMLDivElement>(state);

  const { status, isMounted, isEnter } = state;

  return (
    <div
      className={`${styles.item} ${status === 'entering' ? styles['item-entering'] : ''} ${
        status === 'entered' ? styles['item-entered'] : ''
      } ${status === 'exiting' ? styles['item-exiting'] : ''}`}
      ref={itemRef}
    >
      <button type="button" className={isEnter ? styles.buttonExpanded : styles.button} {...buttonProps}>
        <span>
          {header}
          {stat && <em>종결</em>}
        </span>
        <Chevron className={`${status === 'exited' || status === 'exiting' ? 'icon-exited' : 'icon-entered'}`} />
      </button>

      {isMounted && (
        <div
          className={styles.content}
          style={{
            display: status === 'exited' ? 'none' : undefined,
            ...transitionStyle,
          }}
        >
          <div className={styles.panel} ref={panelRef} {...panelProps}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
