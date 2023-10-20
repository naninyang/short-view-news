import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import cheerio from 'cheerio';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function fetchData(url: string) {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogCreator =
    $('meta[property="og:creator"]').attr('content') || $('meta[property="og:article:author"]').attr('content');
  const datestampTimeContent = $(
    '.media_end_head_info_datestamp .media_end_head_info_datestamp_bunch:eq(0) .media_end_head_info_datestamp_time',
  ).text();
  const datestampTimeAttribute = $(
    '.media_end_head_info_datestamp .media_end_head_info_datestamp_bunch:eq(0) .media_end_head_info_datestamp_time',
  ).attr('data-date-time');

  return {
    ogTitle,
    ogUrl,
    ogImage,
    ogDescription,
    ogCreator,
    datestampTimeContent,
    datestampTimeAttribute,
  };
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url } = req.query;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const data = await fetchData(url as string);
      return res.status(200).json(data);
    } catch (error) {
      if (i === MAX_RETRIES - 1) {
        return res.status(500).json({ error: 'Failed to fetch data after multiple retries' });
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};
