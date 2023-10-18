import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import matter from 'front-matter';
import getGithubToken from '@/utils/github';

export default async (req: VercelRequest, res: VercelResponse) => {
  const start = Number(req.query.start) || 0;
  const count = Number(req.query.count) || 20;

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

    const mdFiles = treeResponse.data.tree
      .filter(
        (file: any) => file.path.startsWith(`src/pages/youtube-${process.env.NODE_ENV}`) && file.path.endsWith('.md'),
      )
      .sort((a: any, b: any) => b.path.localeCompare(a.path))
      .slice(start, start + count);

    const fileContents = await Promise.all(
      mdFiles.map((file: any) =>
        axios.get(file.url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ),
    );
    const fileData = fileContents.map((contentResponse) => contentResponse.data.content);
    const parsedData = fileData.map((content) => matter(Buffer.from(content, 'base64').toString('utf-8')));

    res.status(200).send(parsedData);
  } catch (error) {
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
