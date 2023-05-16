import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import
{
  Avatar, Box, IconButton, Paper, Stack, Typography, useMediaQuery,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Markdown from '~/components/Markdown';
import CommentAmount from '~/components/Social/Comments/CommentAmount';
import Likers from '~/components/Social/Likers/Likers';
import LikeButton from '~/components/Social/SocialButton/LikeButton';
import
{
  authorIsUser,
  getAuthor,
  getAuthorStudentId,
  getSignature,
} from '~/functions/authorFunctions';

import { timeAgo } from '~/functions/datetimeFunctions';
import selectTranslation from '~/functions/selectTranslation';
import { ArticleQuery, useLikeArticleMutation, useUnlikeArticleMutation } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import routes from '~/routes';
import Link from '../Link';
import Comments from '../Social/Comments/Comments';
import CommentButton from '../Social/SocialButton/CommentButton';
import Tag from '../Tag';
import articleStyles from './articleStyles';

type ArticleProps = {
  article: ArticleQuery['article'];
  refetch: () => void;
  fullArticle?: boolean;
  small?: boolean;
};

export default function Article({
  article,
  fullArticle,
  refetch,
  small,
}: ArticleProps) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation('common');
  const date = DateTime.fromISO(article.publishedDatetime).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const { user } = useUser();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const markdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showAll, setShowAll] = useState(router.asPath.includes('#comments-section'));

  const [likeArticleMutation] = useLikeArticleMutation({
    variables: {
      id: article.id,
    },
  });

  const [unlikeArticleMutation] = useUnlikeArticleMutation({
    variables: {
      id: article.id,
    },
  });

  function toggleLike() {
    if (article.isLikedByMe) {
      unlikeArticleMutation().then(() => refetch());
    } else {
      likeArticleMutation().then(() => refetch());
    }
  }

  const markdown = selectTranslation(i18n, article.body, article.bodyEn);
  const isScreenLarge = useMediaQuery((theme: any) => theme.breakpoints.up('md'));
  const isLarge = isScreenLarge && !small;

  const topPart = (
    <Stack direction={isLarge ? 'row-reverse' : 'row'} spacing={1}>
      {/* Avatar and name */}
      <Stack direction={isLarge ? 'row-reverse' : 'row'} spacing={1}>
        <Link href={routes.member(getAuthorStudentId(article.author))}>
          <Avatar
            src={getAuthor(article.author)?.picture_path}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </Link>
        <Stack spacing={0.5} alignItems={isLarge ? 'flex-end' : 'flex-start'}>
          <Link
            style={{ textAlign: isLarge ? 'right' : 'left' }}
            href={routes.member(getAuthorStudentId(article.author))}
          >
            {getSignature(article.author)}
          </Link>
          <Typography>
            {timeAgo(date)}
          </Typography>
        </Stack>

      </Stack>

      {/* Edit button */}
      {fullArticle && (hasAccess(apiContext, 'news:article:update')
        || authorIsUser(article.author, user)) && (
        <Link style={{ marginLeft: 'auto' }} href={routes.editArticle(article.id)}>
          <IconButton color="primary">
            <EditOutlinedIcon />
          </IconButton>
        </Link>
      )}
    </Stack>
  );

  const header = (
    <Link href={routes.article(article.slug || article.id)}>
      <Typography variant="h5" className={classes.header}>
        {selectTranslation(i18n, article.header, article.headerEn)}
      </Typography>
    </Link>
  );

  return (
    <Paper className={classes.article} component="article">
      <Stack>
        <Stack direction={isLarge ? 'row-reverse' : 'column'} justifyContent="space-between" spacing={1}>
          {topPart}
          <Box>
            {header}
            {/* Tags */}
            {article.tags.length > 0 && (
            <Box flexDirection="row" flexWrap="wrap">
              {article.tags.map((tag) => (<Tag key={tag.id} tag={tag} />
              ))}
            </Box>
            )}
          </Box>
        </Stack>
        {(fullArticle && article.imageUrl) && (
          <Box sx={{
            position: 'relative',
            height: '150px',
            flexGrow: 1,
            width: '100%',
            margin: '1rem 0',
          }}
          >
            <Image
              layout="fill"
              src={article.imageUrl}
              objectFit="cover"
              style={{
                borderRadius: '20px',
              }}
              alt=""
            />
          </Box>
        )}
        <Stack direction="row" gap={1}>
          {/* Body */}
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: '75ch',
              maxHeight: fullArticle ? undefined : '180px',
              overflow: 'hidden',
              position: 'relative',
              maskImage: fullArticle ? undefined : 'linear-gradient(to bottom, black 130px, transparent 175px, transparent)',
            }}
            ref={markdownRef}
          >
            <Markdown content={markdown} />
          </Box>
        </Stack>

        {/* Read more button */}
        {!fullArticle && (
          <Link href={routes.article(article.slug || article.id)}>{t('read_more')}</Link>
        )}

        <Stack
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
          width="100%"
          justifyContent="space-between"
        >
          <Likers likers={article.likers} />
          <CommentAmount
            comments={article.comments}
            onClick={async () => {
              setShowAll(true);
              if (!fullArticle) {
                await router.push(routes.article(article.slug || article.id, true));
                // scroll to comment section
                if (commentInputRef.current) {
                  commentInputRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          />
        </Stack>

        <Stack
          direction="row"
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
          gap={1}
        >
          <LikeButton
            isLikedByMe={article.isLikedByMe}
            toggleLike={() => toggleLike()}
            access="news:article:like"
          />
          <CommentButton
            access="news:article:comment"
            toggleComment={async () => {
              setShowAll(true);
              if (commentInputRef.current) {
                commentInputRef.current.scrollIntoView({ behavior: 'smooth' });
                commentInputRef.current.focus();
              } else {
                await router.push(routes.article(article.slug || article.id, true));
              }
            }}
          />
        </Stack>
        {/* Actions */}
        {fullArticle && (
          <Comments
            id={article.id}
            comments={article.comments}
            type="article"
            commentInputRef={commentInputRef}
            showAll={showAll}
            setShowAll={setShowAll}
          />
        )}
      </Stack>
    </Paper>
  );
}

export function SmallArticle({ article }) {
  const { i18n } = useTranslation('common');
  const date = DateTime.fromISO(article.publishedDatetime).setLocale(i18n.language);
  const header = selectTranslation(i18n, article.header, article.headerEn);

  return (
    <Paper component="article" sx={{ p: 1 }}>
      <Stack>
        {/* Top part */}
        <Stack direction="row" spacing={1}>

          {/* Avatar and name */}
          <Link href={routes.member(getAuthorStudentId(article.author))}>
            <Avatar
              src={getAuthor(article.author)?.picture_path}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </Link>
          <Stack flex={1} sx={{ overflow: 'hidden' }}>
            <Stack spacing={0.5} direction="row" justifyContent="space-between">
              <Link
                href={routes.member(getAuthorStudentId(article.author))}
                style={{
                  fontSize: '0.7em',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {getSignature(article.author)}
              </Link>
              <Typography
                sx={{
                  fontSize: '0.7em', whiteSpace: 'nowrap',
                }}
              >
                {timeAgo(date)}
              </Typography>
            </Stack>

            {/* Header */}
            <Link href={routes.article(article.slug || article.id)}>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {header}
              </Typography>
            </Link>
          </Stack>

        </Stack>

      </Stack>
    </Paper>
  );
}
