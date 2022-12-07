import { Stack, Typography } from '@mui/material';
import Link from 'components/Link';
import ProgramInfo from './ProgramInfo';

export default function Info() {
  return (
    <Stack sx={{
      marginTop: '1rem',
    }}
    >
      <Stack sx={{
        width: '60%',
        margin: 'auto',
        marginTop: '1rem',
        gap: '1rem',
      }}
      >
        <Typography
          color="primary"
          fontWeight="bold"
        >
          Vilka är vi?
        </Typography>
        <Typography>
          D-sektionen inom TLTH är en ideell organisation
          för studenter och alumner vid programmen Datateknik och InfoCom.
          Sektionen har sociala arrangemang, näringslivskontakter,
          studiebevakning, och allt annat som hjälper studenter och alumner.
        </Typography>
        <Typography
          color="primary"
          fontWeight="bold"
        >
          Vad gör vi?
        </Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna
          aliquabore et dolore magna aliqua. Lorem ipsum dolor sit amet
          , consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Typography>
          Läs mer om oss
          {' '}
          <Link
            href="/"
            newTab
            style={{
              color: 'primary',
            }}
          >
            HÄR!
          </Link>
        </Typography>
        <Typography
          color="primary"
          fontWeight="bold"
          variant="h3"
          sx={{
            textAlign: 'center',
          }}
        >
          Våra program
        </Typography>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <ProgramInfo
            name="Datateknik"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
