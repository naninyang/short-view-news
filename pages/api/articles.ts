import { NextApiRequest, NextApiResponse } from 'next';
import { notion } from '@/utils/notion';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const response = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID_NAVER! });

    if (!response || !response.results) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const articles = response.results.map((result: any) => {
      return {
        idx: result.id,
        oid: result.properties.oid?.rich_text[0]?.plain_text || '',
        aid: result.properties.aid?.rich_text[0]?.plain_text || '',
        thumbnail: result.properties.thumbnail?.rich_text[0]?.plain_text || '',
        subject: result.properties.subject?.rich_text[0]?.plain_text || '',
        description: result.properties.description?.title[0]?.plain_text || '',
      };
    });

    if (id) {
      const article = articles.find((article) => article.idx === id);
      if (!article) {
        return res.status(404).json({ error: 'Article not found.' });
      }
      return res.json(article);
    }

    return res.json(articles);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch articles.' });
  }
};
