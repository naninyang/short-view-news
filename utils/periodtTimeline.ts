import axios from 'axios';

interface RowData {
  idx: string;
  title: string;
  description: string;
  quote: boolean;
  user: string;
  tweet: string;
  content: string;
  created: string;
  thumbnail1?: string;
  thumbnail2?: string;
  thumbnail3?: string;
  thumbnail4?: string;
  user1: string;
  tweet1: string;
  content1: string;
  tweetCreated1: string;
  thumbnail11?: string;
  thumbnail21?: string;
  thumbnail31?: string;
  thumbnail41?: string;
  user2: string;
  tweet2: string;
  content2: string;
  tweetCreated2: string;
  thumbnail12?: string;
  thumbnail22?: string;
  thumbnail32?: string;
  thumbnail42?: string;
  user3: string;
  tweet3: string;
  content3: string;
  tweetCreated3: string;
  thumbnail13?: string;
  thumbnail23?: string;
  thumbnail33?: string;
  thumbnail43?: string;
  user4: string;
  tweet4: string;
  content4: string;
  tweetCreated4: string;
  thumbnail14?: string;
  thumbnail24?: string;
  thumbnail34?: string;
  thumbnail44?: string;
  user5: string;
  tweet5: string;
  content5: string;
  tweetCreated5: string;
  thumbnail15?: string;
  thumbnail25?: string;
  thumbnail35?: string;
  thumbnail45?: string;
}

export async function getPeriodtTimelineData(start?: number, count?: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/twitterTimeline`, {
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
    quote: data.attributes.quote,
    created: data.attributes.created,
    tweetCreated: data.attributes.originText.tweetCreated,
    user: data.attributes.originText.user,
    content: data.attributes.originText.content,
    tweet: data.attributes.originText.tweet,
    thumbnail1: data.attributes.originText.thumbnails?.thumbnail1,
    thumbnail2: data.attributes.originText.thumbnails?.thumbnail2,
    thumbnail3: data.attributes.originText.thumbnails?.thumbnail3,
    thumbnail4: data.attributes.originText.thumbnails?.thumbnail4,
    tweetCreated1: data.attributes.tweets.tweet1.tweetCreated1,
    user1: data.attributes.tweets.tweet1.user1,
    content1: data.attributes.tweets.tweet1.content1,
    tweet1: data.attributes.tweets.tweet1.tweet1,
    thumbnail11: data.attributes.tweets.tweet1.thumbnails1?.thumbnail11,
    thumbnail21: data.attributes.tweets.tweet1.thumbnails1?.thumbnail21,
    thumbnail31: data.attributes.tweets.tweet1.thumbnails1?.thumbnail31,
    thumbnail41: data.attributes.tweets.tweet1.thumbnails1?.thumbnail41,

    tweetCreated2: data.attributes.tweets.tweet2.tweetCreated2,
    user2: data.attributes.tweets.tweet2.user2,
    content2: data.attributes.tweets.tweet2.content2,
    tweet2: data.attributes.tweets.tweet2.tweet2,
    thumbnail12: data.attributes.tweets.tweet2.thumbnails2?.thumbnail12,
    thumbnail22: data.attributes.tweets.tweet2.thumbnails2?.thumbnail22,
    thumbnail32: data.attributes.tweets.tweet2.thumbnails2?.thumbnail32,
    thumbnail42: data.attributes.tweets.tweet2.thumbnails2?.thumbnail42,

    tweetCreated3: data.attributes.tweets.tweet3.tweetCreated3,
    user3: data.attributes.tweets.tweet3.user3,
    content3: data.attributes.tweets.tweet3.content3,
    tweet3: data.attributes.tweets.tweet3.tweet3,
    thumbnail13: data.attributes.tweets.tweet3.thumbnails3?.thumbnail13,
    thumbnail23: data.attributes.tweets.tweet3.thumbnails3?.thumbnail23,
    thumbnail33: data.attributes.tweets.tweet3.thumbnails3?.thumbnail33,
    thumbnail43: data.attributes.tweets.tweet3.thumbnails3?.thumbnail43,

    tweetCreated4: data.attributes.tweets.tweet4.tweetCreated4,
    user4: data.attributes.tweets.tweet4.user4,
    content4: data.attributes.tweets.tweet4.content4,
    tweet4: data.attributes.tweets.tweet4.tweet4,
    thumbnail14: data.attributes.tweets.tweet4.thumbnails4?.thumbnail14,
    thumbnail24: data.attributes.tweets.tweet4.thumbnails4?.thumbnail24,
    thumbnail34: data.attributes.tweets.tweet4.thumbnails4?.thumbnail34,
    thumbnail44: data.attributes.tweets.tweet4.thumbnails4?.thumbnail44,

    tweetCreated5: data.attributes.tweets.tweet5.tweetCreated5,
    user5: data.attributes.tweets.tweet5.user5,
    content5: data.attributes.tweets.tweet5.content5,
    tweet5: data.attributes.tweets.tweet5.tweet5,
    thumbnail15: data.attributes.tweets.tweet5.thumbnails5?.thumbnail15,
    thumbnail25: data.attributes.tweets.tweet5.thumbnails5?.thumbnail25,
    thumbnail35: data.attributes.tweets.tweet5.thumbnails5?.thumbnail35,
    thumbnail45: data.attributes.tweets.tweet5.thumbnails5?.thumbnail45,
  }));

  const sortedRowsData = rowsData.sort((a: RowData, b: RowData) => b.idx.localeCompare(a.idx));

  return sortedRowsData;
}
