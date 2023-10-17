import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import cheerio from 'cheerio';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url as string);
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

    res.status(200).json({
      ogTitle,
      ogUrl,
      ogImage,
      ogDescription,
      ogCreator,
      datestampTimeContent,
      datestampTimeAttribute,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
