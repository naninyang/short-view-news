import { notion } from '@/utils/notion';
import { NextApiRequest, NextApiResponse } from 'next';

const databaseId = process.env.NOTION_DATABASE_ID_CONTACT as any;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { title, name, email, created, description } = req.body;

  try {
    const pageData = {
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [{ text: { content: title } }],
        },
        name: {
          rich_text: [{ text: { content: name } }],
        },
        email: {
          email: email,
        },
        created: {
          date: { start: created },
        },
        description: {
          rich_text: [{ text: { content: description } }],
        },
      },
    };

    await notion.pages.create(pageData);

    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
