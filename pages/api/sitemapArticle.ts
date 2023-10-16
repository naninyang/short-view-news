import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticleData } from '@/utils/articles';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = await getArticleData();
    res.status(200).json(data);
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
