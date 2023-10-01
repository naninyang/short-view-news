const API = 'https://news.dev1stud.io/api/sitemapData';

function generateSiteMap(shorts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!--We manually set the two URLs we know already-->
      <url>
        <loc>https://news.dev1stud.io/</loc>
      </url>
      ${shorts
        .map(({ idx }) => {
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

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  console.log('Fetching data from:', API);
  const request = await fetch(API);
  console.log('Response:', request);
  const shorts = await request.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(shorts);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
