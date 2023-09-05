/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useRef, useState, useEffect, ChangeEvent,
} from 'react';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import fetchReceiptData, { ReceiptData } from './fetchReceiptData';
import recognizeImage from './recognizeImage';
import resizeImageOnCanvas from './resizeImageOnCanvas';
import convertPdfToImage from './convertPdfToImage';

export type ReceiptEditorData = {
  total: number;
  vat: number;
  date: string;
  description: string;
  currency: string;
  utskott: string;
  nr: string;
};

export default function ReceiptEditor({
  i,
  onChange,
  lang,
}: {
  i: number;
  onChange: (data: ReceiptEditorData) => void;
  lang: 'swe' | 'eng';
}) {
  const [debug, setDebug] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | undefined>();
  const [imagePath, setImagePath] = useState('');
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState('');
  const [vat, setVat] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [utskott, setUtskott] = useState('');
  const [nr, setNr] = useState('');

  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [t0, setT0] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  useEffect(() => {
    if (receiptData) {
      setTotal(receiptData.total.toString());
      setVat(receiptData.vat.toString());
      setDate(receiptData.date);
      setDescription(receiptData.description);
      setCurrency(receiptData.currency);
    }
  }, [receiptData]);

  useEffect(() => {
    if (
      total
      && vat
      && date
      && description
      && currency
      && !Number.isNaN(Number(total))
      && !Number.isNaN(Number(vat))
    ) {
      onChange({
        total: Number(total),
        vat: Number(vat),
        date,
        description,
        currency,
        utskott,
        nr,
      });
    }
  }, [total, vat, date, description, currency, utskott, nr]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setImagePath(await convertPdfToImage(file));
      } else {
        setImagePath(URL.createObjectURL(file));
      }
      setText('');
      setProgress(0);
      setReceiptData(undefined);
      setTimeElapsed(0);
    }
  };

  const resizeImage = () => {
    setStatus('Resizing image');
    setProgress(30);
    return resizeImageOnCanvas(imageRef, canvasRef);
  };

  const getReceiptData = async (_text: string) => {
    const data = await fetchReceiptData(_text, setProgress, setStatus);
    setReceiptData(data);
    setTimeElapsed(Date.now() - t0);
  };

  const handleClick = async () => {
    setText('');
    setProgress(0);
    setReceiptData(undefined);
    setTimeElapsed(0);
    setT0(Date.now());
    const dataUrl = resizeImage();
    const result = await recognizeImage(dataUrl, lang, setProgress, setStatus);
    setText(result.data.text);
    setProgress(0);
    getReceiptData(result.data.text);
  };

  return (
    <Paper>
      <Stack padding={2} spacing={1}>
        <Typography variant="h3">
          Kvitto #
          {i}
        </Typography>
        <FormControlLabel
          control={(
            <Checkbox
              checked={debug}
              onChange={(e) => {
                setDebug(e.target.checked);
              }}
            />
          )}
          label="Debug"
        />
        {debug && imagePath && <Typography>Actual image uploaded: </Typography>}
        <img
          style={{
            display: debug ? 'block' : 'none',
          }}
          src={imagePath}
          className="App-image"
          alt="logo"
          ref={imageRef}
        />
        {debug && <Typography>Canvas:</Typography>}
        <canvas
          style={{
            display: debug ? 'block' : 'none',
          }}
          ref={canvasRef}
        />
        {debug && text && (
          <>
            <Typography fontWeight={500}>Extracted text: </Typography>
            <Divider />
            <Typography>
              {' '}
              {text}
              {' '}
            </Typography>
          </>
        )}
        {status && (
        <Typography>
          Status:
          {' '}
          {status}
        </Typography>
        )}
        <LinearProgressWithLabel variant="determinate" value={progress} />
        <TextField type="file" onChange={handleChange} />
        <Button
          onClick={handleClick}
          style={{ height: 50 }}
          variant="contained"
          disabled={!imagePath}
        >
          Scan
        </Button>
        {debug && text && (
          <Button
            onClick={() => {
              getReceiptData(text);
            }}
          >
            Get receipt data
          </Button>
        )}
        {receiptData && (
          <Stack
            spacing={1}
            style={{
              marginTop: 32,
            }}
          >
            <TextField
              label="Total brutto"
              value={total}
              onChange={(e) => {
                setTotal(e.target.value);
              }}
            />
            <TextField
              label="Moms"
              value={vat}
              onChange={(e) => {
                setVat(e.target.value);
              }}
            />
            <TextField
              label="Date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <TextField
              label="Currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
            />
            <TextField
              label="Utskott"
              value={utskott}
              onChange={(e) => {
                setUtskott(e.target.value);
              }}
            />
            <TextField
              label="Nr"
              value={nr}
              onChange={(e) => {
                setNr(e.target.value);
              }}
            />
          </Stack>
        )}
        {debug && timeElapsed > 0 && (
          <Typography>
            Time elapsed:
            {' '}
            {timeElapsed / 1000}
            {' '}
            s
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
