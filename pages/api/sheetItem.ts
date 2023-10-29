import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import matter from 'front-matter';
import getGithubToken from '@/utils/github';

interface NewsRowData {
  attributes: {
    idx: string;
    video_id: string;
    description: string;
    comment: string;
    created: string;
    title: string;
  };
}

interface PlaylistRowData {
  attributes: {
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
  };
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const idx = req.query.idx as string;

  if (!idx) {
    return res.status(400).send('Please provide an idx parameter.');
  }

  let token = await getGithubToken();

  if (token) {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      token = await getGithubToken();
    }
  }

  try {
    const commitResponse = await axios.get(
      `https://api.github.com/repos/naninyang/short-view-news-db/git/ref/heads/main`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const latestCommitSha = commitResponse.data.object.sha;

    const treeResponse = await axios.get(
      `https://api.github.com/repos/naninyang/short-view-news-db/git/trees/${latestCommitSha}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const mdNews = treeResponse.data.tree.find(
      (file: any) => file.path === `src/pages/youtube-news-${process.env.NODE_ENV}/${idx}.md`,
    );

    const mdPlaylist = treeResponse.data.tree.find(
      (file: any) => file.path === `src/pages/youtube-playlist-${process.env.NODE_ENV}/${idx}.md`,
    );

    if (mdNews) {
      const contentNewsResponse = await axios.get(mdNews.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentNews = contentNewsResponse.data.content;
      const parsedNewsData: NewsRowData = matter(Buffer.from(contentNews, 'base64').toString('utf-8'));

      const responseNewsData = {
        idx: parsedNewsData.attributes.idx,
        video_id: parsedNewsData.attributes.video_id,
        description: parsedNewsData.attributes.description,
        comment: parsedNewsData.attributes.comment,
        created: parsedNewsData.attributes.created,
        title: parsedNewsData.attributes.title,
        type: 'item',
      };

      return res.status(200).json(responseNewsData);
    }

    if (mdPlaylist) {
      const contentPlaylistResponse = await axios.get(mdPlaylist.url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentPlaylist = contentPlaylistResponse.data.content;
      const parsedPlaylistData: PlaylistRowData = matter(Buffer.from(contentPlaylist, 'base64').toString('utf-8'));

      const responsePlaylistData = {
        idx: parsedPlaylistData.attributes.idx,
        title: parsedPlaylistData.attributes.title,
        description: parsedPlaylistData.attributes.description,
        titles: parsedPlaylistData.attributes.titles,
        video_ids: parsedPlaylistData.attributes.video_ids,
        created: parsedPlaylistData.attributes.created,
        title1: parsedPlaylistData.attributes.title1,
        description1: parsedPlaylistData.attributes.description1,
        comment1: parsedPlaylistData.attributes.comment1,
        title2: parsedPlaylistData.attributes.title2,
        description2: parsedPlaylistData.attributes.description2,
        comment2: parsedPlaylistData.attributes.comment2,
        title3: parsedPlaylistData.attributes.title3,
        description3: parsedPlaylistData.attributes.description3,
        comment3: parsedPlaylistData.attributes.comment3,
        title4: parsedPlaylistData.attributes.title4,
        description4: parsedPlaylistData.attributes.description4,
        comment4: parsedPlaylistData.attributes.comment4,
        title5: parsedPlaylistData.attributes.title5,
        description5: parsedPlaylistData.attributes.description5,
        comment5: parsedPlaylistData.attributes.comment5,
        title6: parsedPlaylistData.attributes.title6,
        description6: parsedPlaylistData.attributes.description6,
        comment6: parsedPlaylistData.attributes.comment6,
        title7: parsedPlaylistData.attributes.title7,
        description7: parsedPlaylistData.attributes.description7,
        comment7: parsedPlaylistData.attributes.comment7,
        title8: parsedPlaylistData.attributes.title8,
        description8: parsedPlaylistData.attributes.description8,
        comment8: parsedPlaylistData.attributes.comment8,
        title9: parsedPlaylistData.attributes.title9,
        description9: parsedPlaylistData.attributes.description9,
        comment9: parsedPlaylistData.attributes.comment9,
        title10: parsedPlaylistData.attributes.title10,
        description10: parsedPlaylistData.attributes.description10,
        comment10: parsedPlaylistData.attributes.comment10,
        type: 'playlist',
      };

      return res.status(200).json(responsePlaylistData);
    }
  } catch (error) {
    console.error('GitHub Error:', error);
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
