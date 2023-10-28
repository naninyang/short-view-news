import axios from 'axios';

interface RowData {
  idx: string;
  title: string;
  description: string;
  oid: string;
  aid: string;
  thumbnail: string;
}

export async function getArticleEntertainmentData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/naverEntertainment`, {
    params: {
      start,
      count,
    },
  });
  const filesData = response.data;

  const rowsData: RowData[] = filesData.map((data: any) => ({
    idx: data.attributes.created,
    title: data.attributes.title,
    description: data.attributes.description,
    oid: data.attributes.oid,
    aid: data.attributes.aid,
    thumbnail: data.attributes.thumbnail,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  const fullData = await Promise.all(
    sortedRowsData.map(async (article) => {
      const url = `https://n.news.naver.com/entertain/article/${article.oid}/${article.aid}`;
      const entertainmentMetaData = await fetchArticleMetadata(url);
      return {
        ...article,
        entertainmentMetaData,
      };
    }),
  );

  return fullData;
}

async function fetchArticleMetadata(url: string) {
  try {
    const response = await axios.get(`https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch article metadata', error);
    return {};
  }
}
