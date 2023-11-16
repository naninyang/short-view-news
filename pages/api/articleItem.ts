import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import matter from 'front-matter';
import getGithubToken from '@/utils/github';

interface RowData {
  attributes: {
    created: string;
    title: string;
    description: string;
    oid: string;
    aid: string;
    thumbnail: string;
  };
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const idx = req.query.idx as string;

  if (!idx) {
    return res.status(400).send('Please provide an idx parameter.');
  }

  let token = await getGithubToken();

  if (token) {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      token = await getGithubToken();
    }
  }

  try {
    const commitResponse = await axios.get(
      `https://api.github.com/repos/naninyang/short-view-news-db/git/ref/heads/main`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const latestCommitSha = commitResponse.data.object.sha;

    const treeResponse = await axios.get(
      `https://api.github.com/repos/naninyang/short-view-news-db/git/trees/${latestCommitSha}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const mdNews = treeResponse.data.tree.find(
      (file: any) => file.path === `src/pages/naver-news-${process.env.NODE_ENV}/${idx}.md`,
    );

    const mdEntertainment = treeResponse.data.tree.find(
      (file: any) => file.path === `src/pages/naver-entertainment-${process.env.NODE_ENV}/${idx}.md`,
    );

    if (!mdNews && !mdEntertainment) {
      return res.status(404).send('File not found.');
    }

    if (mdNews) {
      const contentNewsResponse = await axios.get(mdNews.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentNews = contentNewsResponse.data.content;
      const parsedNewsData: RowData = matter(Buffer.from(contentNews, 'base64').toString('utf-8'));

      const responseNewsData = {
        idx: parsedNewsData.attributes.created,
        title: parsedNewsData.attributes.title,
        description: parsedNewsData.attributes.description,
        oid: parsedNewsData.attributes.oid,
        aid: parsedNewsData.attributes.aid,
        thumbnail: parsedNewsData.attributes.thumbnail,
        type: 'news',
      };

      const naverNewsUrl = `https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(
        `https://n.news.naver.com/article/${responseNewsData.oid}/${responseNewsData.aid}`,
      )}`;

      try {
        const responseNews = await axios.get(naverNewsUrl);
        const newsMetaData = responseNews.data;

        const mergedData = {
          ...responseNewsData,
          newsMetaData,
        };
        return res.status(200).json(mergedData);
      } catch (error) {
        res.status(500).send('Failed to fetch data from Scraper');
        return;
      }
    }

    if (mdEntertainment) {
      const contentEntertainmentResponse = await axios.get(mdEntertainment.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentEntertainment = contentEntertainmentResponse.data.content;
      const parsedEntertainmentData: RowData = matter(Buffer.from(contentEntertainment, 'base64').toString('utf-8'));

      const responseEntertainmentData = {
        idx: parsedEntertainmentData.attributes.created,
        title: parsedEntertainmentData.attributes.title,
        description: parsedEntertainmentData.attributes.description,
        oid: parsedEntertainmentData.attributes.oid,
        aid: parsedEntertainmentData.attributes.aid,
        thumbnail: parsedEntertainmentData.attributes.thumbnail,
        type: 'entertainment',
      };

      const naverEntertainmentUrl = `https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(
        `https://n.news.naver.com/entertain/article/${responseEntertainmentData.oid}/${responseEntertainmentData.aid}`,
      )}`;

      try {
        const responseEntertainment = await axios.get(naverEntertainmentUrl);
        const entertainmentMetaData = responseEntertainment.data;

        const mergedData = {
          ...responseEntertainmentData,
          entertainmentMetaData,
        };
        return res.status(200).json(mergedData);
      } catch (error) {
        res.status(500).send('Failed to fetch data from Scraper');
        return;
      }
    }
  } catch (error) {
    console.error('GitHub Error:', error);
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
