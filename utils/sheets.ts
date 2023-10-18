import axios from 'axios';

interface RowData {
  idx: string;
  video_id: string;
  description: string;
  comment: string;
  created: string;
  title: string;
}

export async function getSheetData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube`, {
    params: {
      start,
      count,
    },
  });
  const filesData = response.data;

  const rowsData: RowData[] = filesData.map((data: any) => ({
    idx: data.attributes.idx,
    video_id: data.attributes.video_id,
    description: data.attributes.description,
    comment: data.attributes.comment,
    created: data.attributes.created,
    title: data.attributes.title,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  return sortedRowsData;
}
