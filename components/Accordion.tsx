import React from 'react';
import { useAccordion, useAccordionProvider, AccordionProvider } from '@szhsin/react-accordion';
import styles from '@/styles/history.module.sass';

const Accordion = ({ children }: { children: React.ReactNode }) => {
  const providerValue = useAccordionProvider({
    transition: true,
    transitionTimeout: 750,
  });
  const { accordionProps } = useAccordion();

  return (
    <AccordionProvider value={providerValue}>
      <div className={styles.accordion} {...accordionProps}>
        {children}
      </div>
    </AccordionProvider>
  );
};

export default Accordion;
