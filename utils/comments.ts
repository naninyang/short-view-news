import { notion } from './notion';

export async function getCommentData() {
  const response = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID_COMMENTS! });
  const rowsData = response.results.map((result: any) => {
    return {
      collection: result.properties.collection?.title[0]?.plain_text || '',
      created: result.properties.created?.date?.start || '',
      idx: result.properties.idx?.rich_text[0]?.plain_text || '',
      username: result.properties.username?.rich_text[0]?.plain_text || '',
      comment: result.properties.comment?.rich_text[0]?.plain_text || '',
    };
  });
  const sortedRowsData = rowsData.sort((a, b) => b.created.localeCompare(a.created));
  return sortedRowsData;
}
