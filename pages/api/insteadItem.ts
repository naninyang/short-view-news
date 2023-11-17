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
    addr: string;
    comment: string;
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

    const mdInstead = treeResponse.data.tree.find(
      (file: any) => file.path === `src/pages/instead-${process.env.NODE_ENV}/${idx}.md`,
    );

    if (!mdInstead) {
      return res.status(404).send('File not found.');
    }

    if (mdInstead) {
      const contentInsteadResponse = await axios.get(mdInstead.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentInstead = contentInsteadResponse.data.content;
      const parsedInsteadData: RowData = matter(Buffer.from(contentInstead, 'base64').toString('utf-8'));

      const responseInsteadData = {
        idx: parsedInsteadData.attributes.created,
        title: parsedInsteadData.attributes.title,
        description: parsedInsteadData.attributes.description,
        addr: parsedInsteadData.attributes.addr,
        comment: parsedInsteadData.attributes.comment,
      };

      const insteadUrl = `https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(
        responseInsteadData.addr,
      )}`;

      try {
        const responseInstead = await axios.get(insteadUrl);
        const insteadMetaData = responseInstead.data;

        const mergedData = {
          ...responseInsteadData,
          insteadMetaData,
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
