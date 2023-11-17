type NotionRichTextProperty = {
  rich_text: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
};

type NotionTitleProperty = {
  title: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
};

export type NotionRawPage = {
  id: string;
  properties: {
    Description?: NotionTitleProperty;
    OID?: NotionRichTextProperty;
    Thumbnail?: NotionRichTextProperty;
    Subject?: NotionRichTextProperty;
    [key: string]: any;
  };
};

export type NotionRawResponse = {
  results: NotionRawPage[];
  next_cursor: string | null;
};

export type Article = {
  idx: string;
  description: string;
  thumbnail: string;
  title: string;
  oid: string;
  aid: string;
  type?: string;
  newsMetaData?: {
    ogTitle: string;
    ogUrl: string;
    ogImage: string;
    ogDescription: string;
    ogCreator: string;
    datestampTimeContent: any;
    datestampTimeAttribute: any;
  };
  entertainmentMetaData?: {
    ogTitle: string;
    ogUrl: string;
    ogImage: string;
    ogDescription: string;
    ogCreator: string;
    datestampTimeContent: any;
    datestampTimeAttribute: any;
  };
};

export type Instead = {
  idx: string;
  title: string;
  description: string;
  addr: string;
  comment: string;
  insteadMetaData?: {
    ogTitle: string;
    ogUrl: string;
    ogImage: string;
    ogDescription: string;
    ogSiteName?: string;
    twitterSite?: string;
  };
};

export interface PeriodtOmt {
  idx: string;
  user: string;
  twit: string;
  title: string;
  thumbnail1?: string;
  thumbnail2?: string;
  thumbnail3?: string;
  thumbnail4?: string;
  userOrigin: string;
  twitOrigin: string;
  description: string;
  thumbnailOrigin1?: string;
  thumbnailOrigin2?: string;
  thumbnailOrigin3?: string;
  thumbnailOrigin4?: string;
  [key: string]: any;
}

export interface PeriodtTimeline {
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
  [key: string]: any;
}

export interface NotionRichText {
  plain_text: string;
  href?: string | null;
}

export interface NotionDate {
  start: string;
}
