import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function passThroughPdf(req: NextApiRequest, res: NextApiResponse) {
  const pathName = req.query.pathName as string;
  const fileName = pathName.split('/').pop();
  const url = `https://github.com/Dsek-LTH/${pathName}`;
  const response = await fetch(url as string);
  const buffer = await response.buffer();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
  res.send(buffer);
}
