const API = 'https://news.dev1stud.io/api/sitemapData';

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
              <lastmod>${created}</lastmod>
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
