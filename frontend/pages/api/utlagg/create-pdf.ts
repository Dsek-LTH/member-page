// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { CreatePdfBody } from 'components/ReceiptEditor/createPdf';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const filled = 'CIRCLE';
const notFilled = 'Circle';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    fullName, receiptDatas, studentId, type,
  } = req.body as CreatePdfBody;
  const directory = path.join(process.cwd(), 'public/latex');
  const data = await fs.promises.readFile(`${directory}/original.tex`, 'utf-8');

  let newValue = data
    .replace('@studentId', studentId)
    .replace('@date', receiptDatas[0].date)
    .replace('@fullName', fullName)
    .replace('@dateToday', new Date().toISOString().split('T')[0])
    .replace('@fullName', fullName);

  for (let index = 0; index <= 8; index += 1) {
    const element = receiptDatas[index];
    if (element) {
      newValue = newValue
        .replace('@utskott', element.utskott)
        .replace('@nr', element.nr)
        .replace('@description', element.description)
        .replace('@total', element.total.toString())
        .replace('@kvittonr', `\\#${index + 1}`);
    } else {
      newValue = newValue
        .replace('@utskott', '')
        .replace('@nr', '')
        .replace('@description', '')
        .replace('@total', '')
        .replace('@kvittonr', '');
    }
  }

  if (type === 'privat') {
    newValue = newValue
      .replace('@privat', filled)
      .replace('@sektionskort', notFilled);
  }
  if (type === 'sektionskort') {
    newValue = newValue
      .replace('@privat', notFilled)
      .replace('@sektionskort', filled);
  }

  await fs.promises.writeFile(`${directory}/main.tex`, newValue, 'utf-8');
  const { err, stdout, stderr } = await exec(
    'cd public/latex && pdflatex -halt-on-error main.tex',
  );
  if (err) {
    res.status(500).json({ err, stdout, stderr });
  } else {
    const pdfPath = path.join(process.cwd(), 'public/latex/main.pdf');
    const { size } = fs.statSync(pdfPath);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': size,
    });
    const readStream = fs.createReadStream(pdfPath);
    await new Promise((resolve) => {
      readStream.pipe(res);
      readStream.on('end', resolve);
    });
  }
}
