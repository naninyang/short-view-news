import { notion } from './notion';

type NotionPageResponse = {
  object: string;
  results: {
    object: string;
    id: string;
    properties: {
      description: {
        id: string;
        type: string;
        rich_text: Array<{
          type: string;
          text: {
            content: string;
            link: null | string;
          };
          annotations: {
            bold: boolean;
            italic: boolean;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
          };
          plain_text: string;
          href: null | string;
        }>;
      };
      [key: string]: any;
    }[];
    [key: string]: any;
  };
};

export async function getPageInfo(titleValue: string): Promise<string | null> {
  const databaseId = process.env.NOTION_DATABASE_ID_PAGE as string;

  try {
    const response = (await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'name',
        rich_text: {
          contains: titleValue,
        },
      },
      page_size: 1,
    })) as any as NotionPageResponse;

    if (response.results.length > 0 && response.results[0].properties.description) {
      const description = response.results[0].properties.description.rich_text[0]?.plain_text || null;
      return description;
    }
  } catch (error) {
    console.error('Error fetching page info:', error);
  }

  return null;
}
