import AddIcon from '@mui/icons-material/Add';
import
{
  Badge,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useArticleRequestsQuery } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

function ActionButtons() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const apiContext = useApiAccess();
  const { data: requests } = useArticleRequestsQuery({});

  return (
    <Stack direction="row" spacing={2}>
      {hasAccess(apiContext, 'news:article:create') && (
      <Button
        onClick={() => router.push(routes.createArticle)}
        style={{ height: 'fit-content' }}
        variant="outlined"
      >
        {t('news:new_article')}
        <AddIcon style={{ marginLeft: '0.25rem' }} />
      </Button>
      )}
      {hasAccess(apiContext, 'tags:update') && hasAccess(apiContext, 'tags:create') && (
      <Button
        onClick={() => router.push(routes.tags)}
        style={{ height: 'fit-content' }}
        variant="outlined"
      >
        {t('news:tags')}
      </Button>
      )}
      {(hasAccess(apiContext, 'news:article:manage') || requests?.articleRequests?.length > 0) && (
      <Badge
        badgeContent={(requests?.articleRequests?.length ?? 0) === 0
          ? undefined
          : requests?.articleRequests?.length}
        color="primary"
      >
        <Button
          onClick={() => router.push(routes.articleRequests)}
          style={{ height: 'fit-content' }}
          variant="outlined"
        >
          {t('news:requests')}
        </Button>

      </Badge>
      )}
    </Stack>
  );
}

export default function NewsPageHeader() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <Stack sx={{ mb: 2 }} spacing={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
        spacing={2}
      >
        <Stack direction="row" spacing={2}>
          <h2 style={{ marginBlockEnd: 0 }}>{t('news')}</h2>
          <Box sx={{
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
          >
            <ActionButtons />
          </Box>
        </Stack>

        <Tooltip title={t('news:showAllDescription')}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={t('news:showAll')}
            sx={{
              whiteSpace: 'nowrap',
            }}
            checked={router.query.showAll === 'true'}
            onChange={(_, checked) => {
              router.query.showAll = checked ? 'true' : 'false';
              router.push(router);
            }}
          />
        </Tooltip>
      </Stack>
      <Box sx={{
        display: {
          xs: 'block',
          sm: 'none',
        },
      }}
      >
        <ActionButtons />
      </Box>

    </Stack>
  );
}
