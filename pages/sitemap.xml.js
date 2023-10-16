const SheetAPI = 'https://news.dev1stud.io/api/sitemapSheet';
const ArticleAPI = 'https://news.dev1stud.io/api/sitemapArticle';

function formatSheet(dateString) {
  const matches = dateString.match(/(\d+)년 (\d+)월 (\d+)일/);
  if (!matches) return '';

  const year = matches[1];
  const month = matches[2].padStart(2, '0');
  const day = matches[3].padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatArticle(dateString) {
  const matches = dateString.match(/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-/);
  if (!matches) return '';

  const year = matches[1];
  const month = matches[2];
  const day = matches[3];

  return `${year}-${month}-${day}`;
}

function generateSiteMap(sheets) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://news.dev1stud.io/</loc>
      </url>
      ${sheets
        .map(({ idx, created }) => {
          return `
            <url>
              <loc>https://news.dev1stud.io/watch/${idx}</loc>
              <lastmod>${formatSheet(created)}</lastmod>
            </url>
          `;
        })
        .join('')}
      ${articles
        .map(({ idx }) => {
          return `
            <url>
              <loc>https://news.dev1stud.io/article/${idx}</loc>
              <lastmod>${formatArticle(idx)}</lastmod>
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
