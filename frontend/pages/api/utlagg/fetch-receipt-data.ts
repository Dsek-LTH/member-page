// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = OpenAI.Chat.Completions.ChatCompletion;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { text } = req.body;
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
    Efter denna text kommer ett kvitto som har skannats med en OCR. Svara endast med ett JSON objekt med det totala priset, datumet köpet gjordes, vad du tror har köpts och i vilken valuta. Dessutom vill vi veta hur mycket av köpet som består av moms. Till exempel:
    {
      "total": 100,
      "vat": 25,
      "date": "2023-04-20",
      "description": "Electronics",
      "currency": "SEK"
    }
    Tänk på att datumet nästan alltid är i formatet YY-MM-DD
    Försök hålla description fältet kort, och endast med en kategori.
    Nu kommer texten: ${text}
    `,
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  res.status(200).json(chatCompletion);
}
