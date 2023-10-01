const API = 'https://news.dev1stud.io/api/sitemapData';

function formatDate(dateString) {
  const matches = dateString.match(/(\d+)년 (\d+)월 (\d+)일/);
  if (!matches) return '';

  const year = matches[1];
  const month = matches[2].padStart(2, '0');
  const day = matches[3].padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function generateSiteMap(shorts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://news.dev1stud.io/</loc>
      </url>
      ${shorts
        .map(({ idx, created }) => {
          return `
            <url>
              <loc>https://news.dev1stud.io/news/${idx}</loc>
              <lastmod>${formatDate(created)}</lastmod>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const request = await fetch(API);
  const shorts = await request.json();

  const sitemap = generateSiteMap(shorts);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
