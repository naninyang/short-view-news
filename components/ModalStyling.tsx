import { rem } from '@/styles/designSystem';

export const modalContainer = {
  overlay: {
    zIndex: 1070,
    backgroundColor: `var(--bg-primary-opacity)`,
    backdropFilter: `saturate(180%) blur(${rem(20)})`,
    WebkitBackdropFilter: `saturate(180%) blur(${rem(20)})`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    inset: undefined,
    overflow: undefined,
    position: undefined,
    background: 'var(--bg-secondary)',
    margin: 0,
    border: undefined,
    borderRadius: undefined,
    padding: undefined,
    maxWidth: rem(922),
    maxHeight: `calc(100dvh - ${rem(140)})`,
  },
};
