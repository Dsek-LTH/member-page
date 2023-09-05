import { useState } from 'react';
import {
  Stack,
  Typography,
  TextField,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
} from '@mui/material';
import ReceiptEditor, { ReceiptEditorData } from 'components/ReceiptEditor';
import createPDF from 'components/ReceiptEditor/createPdf';
import LinearProgressWithLabel from 'components/ReceiptEditor/LinearProgressWithLabel';
import genGetProps from '~/functions/genGetServerSideProps';

function App() {
  const [type, setType] = useState<'privat' | 'sektionskort'>('privat');
  const [studentId, setStudentId] = useState<string>('ol1662le-s');
  const [fullName, setFullName] = useState<string>('Oliver Levay');
  const [lang] = useState<'swe' | 'eng'>('swe');
  const [receiptCount, setReceiptCount] = useState<number>(1);
  const [receiptDatas, setReceiptDatas] = useState<ReceiptEditorData[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  return (
    <Stack alignItems="center" padding={1}>
      <Paper elevation={1}>
        <Stack padding={3} spacing={1}>
          <Typography variant="h3">Scan a receipt</Typography>
          <RadioGroup
            row
            value={type}
            onChange={(e) => {
              setType(e.target.value as 'privat' | 'sektionskort');
            }}
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="privat"
              control={<Radio />}
              label="Privat utlägg"
            />
            <FormControlLabel
              value="sektionskort"
              control={<Radio />}
              label="Sektionskort"
            />
          </RadioGroup>
          <TextField
            label="Stil-id"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
            }}
          />
          <TextField
            label="Namn"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {[...Array(receiptCount)].map((_, i) => (
              <ReceiptEditor
                // eslint-disable-next-line react/no-array-index-key
                key={`${i}receipt`}
                i={i + 1}
                lang={lang}
                onChange={(data) => {
                  const newReceiptDatas = [...receiptDatas];
                  newReceiptDatas[i] = data;
                  setReceiptDatas(newReceiptDatas);
                }}
              />
            ))}
          </Stack>
          <Stack justifyContent="center" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setReceiptCount(receiptCount + 1);
                }}
              >
                Lägg till kvitto
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  setReceiptCount(receiptCount - 1);
                }}
              >
                Ta bort kvitto
              </Button>
            </Stack>
            {receiptDatas.length > 0 && (
              <Stack>
                <Typography variant="h5">
                  Status:
                  {' '}
                  {status}
                </Typography>
                <LinearProgressWithLabel value={progress} />
                <Button
                  variant="contained"
                  onClick={async () => {
                    await createPDF(
                      {
                        type,
                        studentId,
                        fullName,
                        receiptDatas,
                      },
                      setProgress,
                      setStatus,
                    );
                  }}
                >
                  Looks good! Skapa PDF
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export const getStaticProps = genGetProps(['mandate']);

export default App;
