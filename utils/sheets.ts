import { notion } from './notion';

export async function getSheetData(start?: number, count?: number) {
  const response = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID_YOUTUBE! });
  const rowsData = response.results.map((result: any) => {
    return {
      idx: result.properties.idx?.formula?.string || '',
      video_id: result.properties.video_id?.rich_text[0]?.plain_text || '',
      summary: result.properties.summary?.rich_text[0]?.plain_text || '',
      blockquote: result.properties.blockquote?.rich_text[0]?.plain_text || '',
      created: result.properties.created?.date?.start || '',
      subject: result.properties.subject?.title[0]?.plain_text || '',
    };
  });
  const sortedRowsData = rowsData.sort((a, b) => b.idx.localeCompare(a.idx));

  if (start !== undefined && count !== undefined) {
    return sortedRowsData.slice(start, start + count);
  }
  return sortedRowsData;
}
