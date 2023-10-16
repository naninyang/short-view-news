const ArticleAPI = 'https://news.dev1stud.io/api/sitemapArticle';

function formatDate(dateString) {
  const matches = dateString.match(/(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-/);
  if (!matches) return '';

  const year = matches[1];
  const month = matches[2];
  const day = matches[3];
  const hour = matches[4];
  const minute = matches[5];
  const second = matches[6];

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
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
              <lastmod>${formatDate(idx)}</lastmod>
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
