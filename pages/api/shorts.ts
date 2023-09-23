import type { NextApiRequest, NextApiResponse } from 'next';
import { getSheetData } from '@/utils/sheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const data = await getSheetData();
    res.status(200).json(data);
  } else {
    console.log('adfasdffsa');
  }
}
