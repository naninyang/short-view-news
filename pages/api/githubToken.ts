import jwt from 'jsonwebtoken';
import axios from 'axios';

const APP_ID = process.env.GITHUB_APP_ID;
const PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n') as string;
const INSTALLATION_ID = process.env.GITHUB_INSTALLATION_ID;

let tokenCache: string | null = null;
let tokenExpiry: Date | null = null;

const getGithubToken = async () => {
  if (!tokenCache || (tokenExpiry && new Date() > tokenExpiry)) {
    const newTokenData = await fetchNewToken();
    tokenCache = newTokenData.token;
    tokenExpiry = new Date(newTokenData.expires_at);
  }

  return tokenCache;
};

async function fetchNewToken() {
  const jwtToken = jwt.sign({}, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '10m',
    issuer: APP_ID,
  });

  const response = await axios.post(
    `https://api.github.com/app/installations/${INSTALLATION_ID}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  );

  return {
    token: response.data.token,
    expires_at: response.data.expires_at,
  };
}

export default getGithubToken;
