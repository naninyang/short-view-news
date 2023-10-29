import axios from 'axios';

interface RowData {
  idx: string;
  titles: string;
  video_ids: string;
  title: string;
  description: string;
  created: string;
  title1: string;
  description1: string;
  comment1: string;
  title2: string;
  description2: string;
  comment2: string;
  title3?: string;
  description3?: string;
  comment3?: string;
  title4?: string;
  description4?: string;
  comment4?: string;
  title5?: string;
  description5?: string;
  comment5?: string;
  title6?: string;
  description6?: string;
  comment6?: string;
  title7?: string;
  description7?: string;
  comment7?: string;
  title8?: string;
  description8?: string;
  comment8?: string;
  title9?: string;
  description9?: string;
  comment9?: string;
  title10?: string;
  description10?: string;
  comment10?: string;
}

export async function getSheetPlaylistData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/youtubePlaylist`, {
    params: {
      start,
      count,
    },
  });
  const filesData = response.data;

  const rowsData: RowData[] = filesData.map((data: any) => ({
    idx: data.attributes.idx,
    title: data.attributes.title,
    description: data.attributes.description,
    titles: data.attributes.titles,
    video_ids: data.attributes.video_ids,
    created: data.attributes.created,
    title1: data.attributes.title1,
    description1: data.attributes.description1,
    comment1: data.attributes.comment1,
    title2: data.attributes.title2,
    description2: data.attributes.description2,
    comment2: data.attributes.comment2,
    title3: data.attributes.title3,
    description3: data.attributes.description3,
    comment3: data.attributes.comment3,
    title4: data.attributes.title4,
    description4: data.attributes.description4,
    comment4: data.attributes.comment4,
    title5: data.attributes.title5,
    description5: data.attributes.description5,
    comment5: data.attributes.comment5,
    title6: data.attributes.title6,
    description6: data.attributes.description6,
    comment6: data.attributes.comment6,
    title7: data.attributes.title7,
    description7: data.attributes.description7,
    comment7: data.attributes.comment7,
    title8: data.attributes.title8,
    description8: data.attributes.description8,
    comment8: data.attributes.comment8,
    title9: data.attributes.title9,
    description9: data.attributes.description9,
    comment9: data.attributes.comment9,
    title10: data.attributes.title10,
    description10: data.attributes.description10,
    comment10: data.attributes.comment10,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  return sortedRowsData;
}
