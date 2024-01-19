import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  let noPixelEndpoint: string | undefined;
  if (id === 'whitelist') {
    noPixelEndpoint = process.env.NEXT_PUBLIC_NOPIXEL_WHITELIST_API_ENDPOINT;
  } else if (id === 'public-blue') {
    noPixelEndpoint = process.env.NEXT_PUBLIC_NOPIXEL_BLUE_API_ENDPOINT;
  } else {
    noPixelEndpoint = process.env.NEXT_PUBLIC_NOPIXEL_GREEN_API_ENDPOINT;
  }

  const response = await fetch(`${noPixelEndpoint}/info.json`);
  const data = await response.json();

  res.status(200).json(data);
}
