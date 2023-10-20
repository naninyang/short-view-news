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

    const mdFile = treeResponse.data.tree.find(
      (file: any) => file.path === `src/pages/naver-${process.env.NODE_ENV}/${idx}.md`,
    );

    if (!mdFile) {
      return res.status(404).send('File not found.');
    }

    const contentResponse = await axios.get(mdFile.url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const content = contentResponse.data.content;
    const parsedData: RowData = matter(Buffer.from(content, 'base64').toString('utf-8'));

    const responseData = {
      idx: parsedData.attributes.created,
      title: parsedData.attributes.title,
      description: parsedData.attributes.description,
      oid: parsedData.attributes.oid,
      aid: parsedData.attributes.aid,
      thumbnail: parsedData.attributes.thumbnail,
    };

    const naverUrl = `https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(
      `https://n.news.naver.com/article/${responseData.oid}/${responseData.aid}`,
    )}`;

    try {
      const response = await axios.get(naverUrl);
      const metaData = response.data;

      const mergedData = {
        ...responseData,
        metaData,
      };
      res.status(200).json(mergedData);
    } catch (error) {
      res.status(500).send('Failed to fetch data from Scraper');
      return;
    }
  } catch (error) {
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
