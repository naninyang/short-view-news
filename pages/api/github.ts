import { GithubToken } from '@/utils/github';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/naninyang/short-view-news-db/contents/src/pages/youtube-${process.env.NODE_ENV}`,
      {
        headers: {
          Authorization: `bearer ${GithubToken}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      },
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch data from GitHub.' });
  }
}
