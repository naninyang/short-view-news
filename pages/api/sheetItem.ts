import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import matter from 'front-matter';
import getGithubToken from '@/utils/github';

interface RowData {
  attributes: {
    idx: string;
    video_id: string;
    description: string;
    comment: string;
    created: string;
    title: string;
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
      (file: any) => file.path === `src/pages/youtube-${process.env.NODE_ENV}/${idx}.md`,
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
      idx: parsedData.attributes.idx,
      video_id: parsedData.attributes.video_id,
      description: parsedData.attributes.description,
      comment: parsedData.attributes.comment,
      created: parsedData.attributes.created,
      title: parsedData.attributes.title,
    };
    res.status(200).send(responseData);
  } catch (error) {
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
