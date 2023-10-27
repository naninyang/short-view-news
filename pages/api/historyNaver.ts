import { NextApiRequest, NextApiResponse } from 'next';
import { getHistoryNaver } from '@/utils/historyNaver';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getHistoryNaver();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Notion' });
  }
}
