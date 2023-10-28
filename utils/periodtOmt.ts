import axios from 'axios';

interface RowData {
  idx: string;
  title: string;
  user: string;
  twit: string;
  thumbnail1?: string;
  thumbnail2?: string;
  thumbnail3?: string;
  thumbnail4?: string;
  description: string;
  userOrigin: string;
  twitOrigin: string;
  thumbnailOrigin1?: string;
  thumbnailOrigin2?: string;
  thumbnailOrigin3?: string;
  thumbnailOrigin4?: string;
}

export async function getPeriodtOmtData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/twitterOmt`, {
    params: {
      start,
      count,
    },
  });
  const filesData = response.data;

  const rowsData: RowData[] = filesData.map((data: any) => ({
    idx: data.attributes.created,
    user: data.attributes.user,
    twit: data.attributes.twit,
    title: data.attributes.title,
    thumbnail1: data.attributes.thumbnails?.thumbnail1,
    thumbnail2: data.attributes.thumbnails?.thumbnail2,
    thumbnail3: data.attributes.thumbnails?.thumbnail3,
    thumbnail4: data.attributes.thumbnails?.thumbnail4,
    userOrigin: data.attributes.userOrigin,
    twitOrigin: data.attributes.twitOrigin,
    description: data.attributes.description,
    thumbnailOrigin1: data.attributes.thumbnailsOrigin?.thumbnailOrigin1,
    thumbnailOrigin2: data.attributes.thumbnailsOrigin?.thumbnailOrigin2,
    thumbnailOrigin3: data.attributes.thumbnailsOrigin?.thumbnailOrigin3,
    thumbnailOrigin4: data.attributes.thumbnailsOrigin?.thumbnailOrigin4,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  return sortedRowsData;
}
