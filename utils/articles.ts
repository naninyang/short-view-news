import { notion } from './notion';

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

  if (start !== undefined && count !== undefined) {
    return sortedRowsData.slice(start, start + count);
  }
  return sortedRowsData;
}
