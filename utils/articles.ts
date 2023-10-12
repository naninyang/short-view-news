import axios from 'axios';

interface RowData {
  idx: string;
  title: string;
  description: string;
  oid: string;
  aid: string;
  thumbnail: string;
}

export async function getArticleData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/naver`);
  const filesData = response.data;

  const rowsData: RowData[] = filesData.map((data: any) => ({
    idx: `${data.attributes.oid}${data.attributes.aid}`,
    title: data.attributes.title,
    description: data.attributes.description,
    oid: data.attributes.oid,
    aid: data.attributes.aid,
    thumbnail: data.attributes.thumbnail,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  const fullData = await Promise.all(
    sortedRowsData.map(async (article) => {
      const url = `https://n.news.naver.com/article/${article.oid}/${article.aid}`;
      const metaData = await fetchArticleMetadata(url);
      return {
        ...article,
        metaData,
      };
    }),
  );

  if (start !== undefined && count !== undefined) {
    return fullData.slice(start, start + count);
  }
  return fullData;
}

async function fetchArticleMetadata(url: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/naverScraping?url=${url}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch article metadata', error);
    return {};
  }
}
