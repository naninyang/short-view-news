import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url } = req.query;

  if (typeof url !== 'string') {
    res.status(400).json({ error: 'Invalid URL parameter.' });
    return;
  }

  try {
    const response = await axios.get(`https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
};
