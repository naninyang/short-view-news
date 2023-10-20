import { VercelRequest, VercelResponse } from '@vercel/node';
import ogs from 'open-graph-scraper';

async function fetchOpenGraphData(url: string) {
  const data = await ogs({ url });
  if (data.error) {
    throw new Error(data.result.error);
  }
  return data.result;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url } = req.query;

  try {
    const rawData = await fetchOpenGraphData(url as string);

    const filteredData = {
      ogTitle: rawData.ogTitle,
      ogUrl: rawData.ogUrl,
      ogImage: rawData.ogImage ? rawData.ogImage[0].url : null,
      ogDescription: rawData.ogDescription,
      ogCreator: rawData.ogArticleAuthor || rawData.twitterCreator,
    };

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
};
