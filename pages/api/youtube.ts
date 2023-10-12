import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import getGithubToken from '@/utils/github';
import matter from 'front-matter';

export default async (req: VercelRequest, res: VercelResponse) => {
  let token = await getGithubToken();

  if (token) {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      token = await getGithubToken();
    }
  }

  try {
    const fileListResponse = await axios.get(
      `https://api.github.com/repos/naninyang/short-view-news-db/contents/src/pages/youtube-${process.env.NODE_ENV}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const mdFiles = fileListResponse.data.filter((file: any) => file.name.endsWith('.md'));
    const fileContents = await Promise.all(mdFiles.map((file: any) => axios.get(file.download_url)));
    const fileData = fileContents.map((contentResponse) => contentResponse.data);
    const parsedData = fileData.map((content) => matter(content));

    res.status(200).send(parsedData);
  } catch (error) {
    res.status(500).send('Failed to fetch data from GitHub');
  }
};
