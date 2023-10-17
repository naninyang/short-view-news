const SheetAPI = 'https://news.dev1stud.io/api/sitemapSheet';

function generateSiteMap(sheets) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sheets
        .map(({ idx, created }) => {
          return `
            <url>
              <loc>https://news.dev1stud.io/watch/${idx}</loc>
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
  const sheetRequest = await fetch(SheetAPI);
  const sheets = await sheetRequest.json();

  const sitemap = generateSiteMap(sheets);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
