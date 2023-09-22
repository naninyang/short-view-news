import Link from 'next/link';

interface AnchorLinkProps {
  href: string;
  [key: string]: any;
}

const domainRegex = /http[s]*:\/\/[www.]*domain\.com[/]?/;

const AnchorLink: React.FC<AnchorLinkProps> = ({ href, ...rest }) => {
  const sameDomain = domainRegex.test(href);
  let h = href;
  if (sameDomain) {
    h = h.replace(domainRegex, '/');
  }

  if (href.startsWith('/')) {
    return <Link href={h} {...rest} />;
  }

  if (!h.startsWith('http')) {
    return <a href={h} {...rest} />;
  }

  return (
    <a href={h} target="_blank" rel="noopener noreferrer nofollow" {...rest} />
  );
};

export default AnchorLink;
