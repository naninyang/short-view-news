const ArticleAPI = 'https://news.dev1stud.io/api/sitemapArticle';

function formatData(dateString) {
  const matches = dateString.match(/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-/);
  if (!matches) return '';

  const year = matches[1];
  const month = matches[2];
  const day = matches[3];

  return `${year}-${month}-${day}`;
}

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://news.dev1stud.io/</loc>
      </url>
      ${articles
        .map(({ idx }) => {
          return `
            <url>
              <loc>https://news.dev1stud.io/article/${idx}</loc>
              <lastmod>${formatData(idx)}</lastmod>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const articleRequest = await fetch(ArticleAPI);
  const articles = await articleRequest.json();

  const sitemap = generateSiteMap(articles);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
