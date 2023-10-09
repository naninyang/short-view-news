import { notion } from './notion';
import axios from 'axios';

export async function getArticleData(start?: number, count?: number) {
  const response = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID_NAVER! });
  const rowsData = response.results.map((result: any) => {
    return {
      idx: result.id,
      oid: result.properties.oid?.rich_text[0]?.plain_text || '',
      aid: result.properties.aid?.rich_text[0]?.plain_text || '',
      thumbnail: result.properties.thumbnail?.rich_text[0]?.plain_text || '',
      subject: result.properties.subject?.title[0]?.plain_text || '',
      description: result.properties.description?.rich_text[0]?.plain_text || '',
    };
  });
  const sortedRowsData = rowsData.sort((a, b) => b.idx.localeCompare(a.idx));

  const fullData = await Promise.all(
    sortedRowsData.map(async (article) => {
      const url = `https://n.news.naver.com/article/${article.oid}/${article.aid}`;
      const metaData = await fetchArticleMetadata(url);
      return {
        ...article,
        metaData,
      };
    }),
  );

  if (start !== undefined && count !== undefined) {
    return fullData.slice(start, start + count);
  }
  return fullData;
}

async function fetchArticleMetadata(url: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/naverScraping?url=${url}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch article metadata', error);
    return {};
  }
}
