import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import
{
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';
import Markdown from '~/components/Markdown';
import articleStyles from '~/components/News/articleStyles';
import
{
  authorIsUser,
  getSignature,
} from '~/functions/authorFunctions';
import { timeAgo } from '~/functions/datetimeFunctions';
import selectTranslation from '~/functions/selectTranslation';
import
{
  ArticleQuery,
  ArticleRequestStatus,
} from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import Link from '../Link';

type ArticleProps = {
  article: ArticleQuery['article'];
};

export default function Article({ article }: ArticleProps) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation('common');
  const date = DateTime.fromISO(
    article.status === ArticleRequestStatus.Approved
      ? article.publishedDatetime
      : article.createdDatetime,
  ).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const markdownRef = useRef<HTMLDivElement>(null);

  const markdown = selectTranslation(i18n, article.body, article.bodyEn);
  const isScreenLarge = useMediaQuery((theme: any) =>
    theme.breakpoints.up('md'));

  const topPart = (
    <Stack direction="row" spacing={1}>
      {/* Avatar and name */}
      <Stack direction="row" spacing={1}>
        <Avatar
          src={
            article.author.member?.picture_path
            || '/images/nolla/nollning_logo_small.png'
          }
          sx={{
            width: 50,
            height: 50,
            backgroundColor: '#1e1e1e',
          }}
        />
        <Stack spacing={0.5} alignItems="flex-start">
          {getSignature(article.author)}
          <Typography>{timeAgo(date)}</Typography>
        </Stack>
      </Stack>

      {/* Edit button */}
      {(hasAccess(apiContext, 'news:article:update')
        || authorIsUser(article.author, user)) && (
        <Link href={routes.editArticle(article.id)}>
          <IconButton color="primary">
            <EditOutlinedIcon />
          </IconButton>
        </Link>
      )}
    </Stack>
  );

  return (
    <Paper className={classes.article} component="article">
      <Stack>
        <Stack
          direction={isScreenLarge ? 'row' : 'column'}
          justifyContent="space-between"
          spacing={1}
        >
          {topPart}
        </Stack>
        <Stack direction="row" gap={1}>
          {/* Body */}
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: '75ch',
              maxHeight: expanded ? undefined : '180px',
              position: 'relative',
              maskImage: expanded
                ? undefined
                : 'linear-gradient(to bottom, black 130px, transparent 175px, transparent)',
            }}
            ref={markdownRef}
          >
            <Markdown content={markdown} />
          </Box>
        </Stack>

        {/* Read more button */}
        <Button
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => setExpanded((state) => !state)}
        >
          {expanded ? t('minimize') : t('read_more')}
        </Button>
      </Stack>
    </Paper>
  );
}
