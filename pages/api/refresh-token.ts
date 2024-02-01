import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_TWITCH_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  const data = await response.json();
  res.status(200).json(data);
}
