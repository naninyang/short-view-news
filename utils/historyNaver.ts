import axios from 'axios';
import { NotionDate, NotionRichText } from '@/types';
import { notion } from './notion';

interface NaverProperties {
  title: {
    title: NotionRichText[];
  };
  update: {
    date: NotionDate;
  };
  due: {
    checkbox: boolean;
  };
  article_id1: {
    rich_text: NotionRichText[];
  };
  datetime1: {
    date: NotionDate;
  };
  article_id2: {
    rich_text: NotionRichText[];
  };
  datetime2: {
    date: NotionDate;
  };
  article_id3: {
    rich_text: NotionRichText[];
  };
  datetime3: {
    date: NotionDate;
  };
  article_id4: {
    rich_text: NotionRichText[];
  };
  datetime4: {
    date: NotionDate;
  };
  article_id5: {
    rich_text: NotionRichText[];
  };
  datetime5: {
    date: NotionDate | null;
  };
  article_id6: {
    rich_text: NotionRichText[];
  };
  datetime6: {
    date: NotionDate | null;
  };
  article_id7: {
    rich_text: NotionRichText[];
  };
  datetime7: {
    date: NotionDate | null;
  };
  article_id8: {
    rich_text: NotionRichText[];
  };
  datetime8: {
    date: NotionDate | null;
  };
  article_id9: {
    rich_text: NotionRichText[];
  };
  datetime9: {
    date: NotionDate | null;
  };
  article_id10: {
    rich_text: NotionRichText[];
  };
  datetime10: {
    date: NotionDate | null;
  };
  article_id11: {
    rich_text: NotionRichText[];
  };
  datetime11: {
    date: NotionDate | null;
  };
  article_id12: {
    rich_text: NotionRichText[];
  };
  datetime12: {
    date: NotionDate | null;
  };
  article_id13: {
    rich_text: NotionRichText[];
  };
  datetime13: {
    date: NotionDate | null;
  };
  article_id14: {
    rich_text: NotionRichText[];
  };
  datetime14: {
    date: NotionDate | null;
  };
  article_id15: {
    rich_text: NotionRichText[];
  };
  datetime15: {
    date: NotionDate | null;
  };
  article_id16: {
    rich_text: NotionRichText[];
  };
  datetime16: {
    date: NotionDate | null;
  };
  article_id17: {
    rich_text: NotionRichText[];
  };
  datetime17: {
    date: NotionDate | null;
  };
  article_id18: {
    rich_text: NotionRichText[];
  };
  datetime18: {
    date: NotionDate | null;
  };
  article_id19: {
    rich_text: NotionRichText[];
  };
  datetime19: {
    date: NotionDate | null;
  };
  article_id20: {
    rich_text: NotionRichText[];
  };
  datetime20: {
    date: NotionDate | null;
  };
}

export interface NaverResult {
  properties: NaverProperties;
}

export interface NaverAPIResponse {
  results: NaverResult[];
}

export async function getHistoryNaver(): Promise<NaverAPIResponse> {
  const databaseId = process.env.NOTION_DATABASE_ID_HISTORY_NAVER;

  if (!databaseId) {
    throw new Error('뭐용?');
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    const RowData = response.results
      .map((item: any) => {
        if (item.object !== 'page' || !item.properties) {
          return null;
        }

        const properties = {
          title: item.properties.title.title[0]?.plain_text,
          update: item.properties.update?.date?.start,
          due: item.properties.due?.checkbox,
          article_id1: item.properties.article_id1?.rich_text[0]?.plain_text,
          datetime1: item.properties.datetime1?.date?.start,
          article_id2: item.properties.article_id2?.rich_text[0]?.plain_text,
          datetime2: item.properties.datetime2?.date?.start,
          article_id3: item.properties.article_id3?.rich_text[0]?.plain_text,
          datetime3: item.properties.datetime3?.date?.start,
          article_id4: item.properties.article_id4?.rich_text[0]?.plain_text,
          datetime4: item.properties.datetime4?.date?.start,
          article_id5: item.properties.article_id5?.rich_text[0]?.plain_text,
          datetime5: item.properties.datetime5?.date?.start,
          article_id6: item.properties.article_id6?.rich_text[0]?.plain_text,
          datetime6: item.properties.datetime6?.date?.start,
          article_id7: item.properties.article_id7?.rich_text[0]?.plain_text,
          datetime7: item.properties.datetime7?.date?.start,
          article_id8: item.properties.article_id8?.rich_text[0]?.plain_text,
          datetime8: item.properties.datetime8?.date?.start,
          article_id9: item.properties.article_id9?.rich_text[0]?.plain_text,
          datetime9: item.properties.datetime9?.date?.start,
          article_id10: item.properties.article_id10?.rich_text[0]?.plain_text,
          datetime10: item.properties.datetime10?.date?.start,
          article_id11: item.properties.article_id11?.rich_text[0]?.plain_text,
          datetime11: item.properties.datetime11?.date?.start,
          article_id12: item.properties.article_id12?.rich_text[0]?.plain_text,
          datetime12: item.properties.datetime12?.date?.start,
          article_id13: item.properties.article_id13?.rich_text[0]?.plain_text,
          datetime13: item.properties.datetime13?.date?.start,
          article_id14: item.properties.article_id14?.rich_text[0]?.plain_text,
          datetime14: item.properties.datetime14?.date?.start,
          article_id15: item.properties.article_id15?.rich_text[0]?.plain_text,
          datetime15: item.properties.datetime15?.date?.start,
          article_id16: item.properties.article_id16?.rich_text[0]?.plain_text,
          datetime16: item.properties.datetime16?.date?.start,
          article_id17: item.properties.article_id17?.rich_text[0]?.plain_text,
          datetime17: item.properties.datetime17?.date?.start,
          article_id18: item.properties.article_id18?.rich_text[0]?.plain_text,
          datetime18: item.properties.datetime18?.date?.start,
          article_id19: item.properties.article_id19?.rich_text[0]?.plain_text,
          datetime19: item.properties.datetime19?.date?.start,
          article_id20: item.properties.article_id20?.rich_text[0]?.plain_text,
          datetime20: item.properties.datetime20?.date?.start,
        };

        return {
          properties,
        };
      })
      .filter((item): item is NaverResult => item !== null);
    return {
      results: RowData,
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}
