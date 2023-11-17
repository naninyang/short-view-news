import axios from 'axios';

interface RowData {
  idx: string;
  title: string;
  description: string;
  addr: string;
  comment: string;
}

export async function getInsteadData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/instead`, {
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
    addr: data.attributes.addr,
    comment: data.attributes.comment,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  const fullData = await Promise.all(
    sortedRowsData.map(async (preview) => {
      const insteadMetaData = await fetchInsteadMetadata(preview.addr);
      return {
        ...preview,
        insteadMetaData,
      };
    }),
  );

  return fullData;
}

async function fetchInsteadMetadata(url: string) {
  try {
    const response = await axios.get(`https://naver-news-opengraph.vercel.app/api/og?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch article metadata', error);
    return {};
  }
}
