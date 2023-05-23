import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function passThroughPdf(req: NextApiRequest, res: NextApiResponse) {
  const pathName = req.query.pathName as string;
  if (typeof pathName !== 'string' || !/^[\w/.-]+$/.test(pathName)) {
    res.status(400).send('Bad request');
  } else {
    const fileName = pathName.split('/').pop();
    const url = new URL(pathName, 'https://github.com/Dsek-LTH/');
    const response = await fetch(url);
    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.send(buffer);
  }
}
