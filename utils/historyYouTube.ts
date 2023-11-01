import { NotionDate, NotionRichText } from 'types';
import { notion } from './notion';

interface YouTubeProperties {
  title: {
    title: NotionRichText[];
  };
  update: {
    date: NotionDate;
  };
  due: {
    checkbox: boolean;
  };
  video_id1: {
    rich_text: NotionRichText[];
  };
  datetime1: {
    date: NotionDate;
  };
  subject1: {
    rich_text: NotionRichText[];
  };
  description1: {
    rich_text: NotionRichText[];
  };
  video_id2: {
    rich_text: NotionRichText[];
  };
  datetime2: {
    date: NotionDate;
  };
  subject2: {
    rich_text: NotionRichText[];
  };
  description2: {
    rich_text: NotionRichText[];
  };
  video_id3: {
    rich_text: NotionRichText[];
  };
  datetime3: {
    date: NotionDate;
  };
  subject3: {
    rich_text: NotionRichText[];
  };
  description3: {
    rich_text: NotionRichText[];
  };
  video_id4: {
    rich_text: NotionRichText[];
  };
  datetime4: {
    date: NotionDate;
  };
  subject4: {
    rich_text: NotionRichText[];
  };
  description4: {
    rich_text: NotionRichText[];
  };
  video_id5: {
    rich_text: NotionRichText[];
  };
  datetime5: {
    date: NotionDate | null;
  };
  subject5: {
    rich_text: NotionRichText[];
  };
  description5: {
    rich_text: NotionRichText[];
  };
}

export interface YouTubeResult {
  properties: YouTubeProperties;
}

export interface YouTubeAPIResponse {
  results: YouTubeResult[];
}

export async function getHistoryYouTube(): Promise<YouTubeAPIResponse> {
  const databaseId = process.env.NOTION_DATABASE_ID_HISTORY_YOUTUBE;

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

          video_id1: item.properties.video_id1?.rich_text[0]?.plain_text,
          datetime1: item.properties.datetime1?.date?.start,
          subject1: item.properties.subject1?.rich_text.map((rt: NotionRichText) => rt.plain_text).join(' '),
          description1: item.properties.description1?.rich_text[0]?.plain_text,

          video_id2: item.properties.video_id2?.rich_text[0]?.plain_text,
          datetime2: item.properties.datetime2?.date?.start,
          subject2: item.properties.subject2?.rich_text.map((rt: NotionRichText) => rt.plain_text).join(' '),
          description2: item.properties.description2?.rich_text[0]?.plain_text,

          video_id3: item.properties.video_id3?.rich_text[0]?.plain_text,
          datetime3: item.properties.datetime3?.date?.start,
          subject3: item.properties.subject3?.rich_text.map((rt: NotionRichText) => rt.plain_text).join(' '),
          description3: item.properties.description3?.rich_text[0]?.plain_text,

          video_id4: item.properties.video_id4?.rich_text[0]?.plain_text,
          datetime4: item.properties.datetime4?.date?.start,
          subject4: item.properties.subject4?.rich_text.map((rt: NotionRichText) => rt.plain_text).join(' '),
          description4: item.properties.description4?.rich_text[0]?.plain_text,

          video_id5: item.properties.video_id5?.rich_text[0]?.plain_text,
          datetime5: item.properties.datetime5?.date?.start,
          subject5: item.properties.subject5?.rich_text.map((rt: NotionRichText) => rt.plain_text).join(' '),
          description5: item.properties.description5?.rich_text[0]?.plain_text,
        };

        return {
          properties,
        };
      })
      .filter((item): item is YouTubeResult => item !== null);
    return {
      results: RowData,
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}
