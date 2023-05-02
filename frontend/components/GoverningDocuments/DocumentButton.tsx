import { Button, IconButton, Stack } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import displayPdf from '~/functions/urlFunctions';

export default function DocumentButton({ url, title, icon }: { url: string, title: string, icon: 'gavel' | 'article' }) {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        sx={{ width: 'fit-content' }}
        variant="contained"
        target="_blank"
        rel="noopener noreferrer"
        href={displayPdf(url)}
        onClick={(e) => {
          e.preventDefault();
          window.open(displayPdf(url));
        }}
      >
        {icon === 'gavel' && <GavelIcon style={{ marginRight: '0.5rem' }} />}
        {icon === 'article' && <ArticleIcon style={{ marginRight: '0.5rem' }} />}
        {title}
      </Button>
      <IconButton
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        download
      >
        <DownloadIcon />
      </IconButton>
    </Stack>
  );
}
