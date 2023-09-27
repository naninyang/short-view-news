export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

type EventProps = {
  action: string;
  category: string;
  label: string;
  value: string | number;
};

export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID as string, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: EventProps): void => {
  if (typeof window !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
