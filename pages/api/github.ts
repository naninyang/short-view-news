import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import getGithubToken from './githubToken';

export default async (req: VercelRequest, res: VercelResponse) => {
  let token = await getGithubToken();

  if (token) {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      token = await getGithubToken();
    }
  }

  try {
    const response = await axios.get(
      // `https://api.github.com/repos/naninyang/short-view-news-db/contents/src/pages/youtube-${process.env.NODE_ENV}`,
      `https://api.github.com/repos/naninyang/short-view-news-db/contents/src/pages/youtube-production`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error('에러 발생:', error.message);
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
