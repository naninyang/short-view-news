import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import getGithubToken from '@/utils/github';

export default async (req: VercelRequest, res: VercelResponse) => {
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

    const mdNews = treeResponse.data.tree
      .filter(
        (file: any) =>
          file.path.startsWith(`src/pages/naver-news-${process.env.NODE_ENV}`) && file.path.endsWith('.md'),
      )
      .map((file: any) => {
        const filename = file.path.split('/').pop().replace('.md', '');
        const parts = filename.split('-');
        const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const time = `${parts[3]}:${parts[4]}:${parts[5]}`;
        return {
          idx: filename,
          created: `${date} ${time}`,
        };
      });

    const mdEntertainment = treeResponse.data.tree
      .filter(
        (file: any) =>
          file.path.startsWith(`src/pages/naver-entertainment-${process.env.NODE_ENV}`) && file.path.endsWith('.md'),
      )
      .map((file: any) => {
        const filename = file.path.split('/').pop().replace('.md', '');
        const parts = filename.split('-');
        const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const time = `${parts[3]}:${parts[4]}:${parts[5]}`;
        return {
          idx: filename,
          created: `${date} ${time}`,
        };
      });

    const mergeMd = [...mdNews, ...mdEntertainment];

    res.status(200).send(mergeMd);
  } catch (error) {
    res.status(500).send('Failed to fetch filenames from GitHub');
  }
};
