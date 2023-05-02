import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function passThroughPdf(req: NextApiRequest, res: NextApiResponse) {
  const { url, title } = req.query;
  const response = await fetch(url as string);
  const buffer = await response.buffer();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`);
  res.send(buffer);
}
