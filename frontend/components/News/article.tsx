import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import
{
  Avatar, Box, IconButton, Paper, Stack, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
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

import selectTranslation from '~/functions/selectTranslation';
import { ArticleQuery, useLikeArticleMutation, useUnlikeArticleMutation } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useUser } from '~/providers/UserProvider';
import { timeAgo } from '~/functions/datetimeFunctions';
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
};

export default function Article({
  article,
  fullArticle,
  refetch,
}: ArticleProps) {
  const classes = articleStyles();
  const { t, i18n } = useTranslation('common');
  const date = DateTime.fromISO(article.publishedDatetime).setLocale(i18n.language);
  const apiContext = useApiAccess();
  const { user } = useUser();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const markdownRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

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

  return (
    <Paper className={classes.article} component="article">
      <Stack>
        <Grid
          className={classes.bodyGrid}
          item
          xs={12}
          md={12}
          lg={article.imageUrl ? 7 : 12}
        >
          {/* Top part */}
          <Stack direction="row" spacing={1}>

            {/* Avatar and name */}
            <Link href={routes.member(getAuthorStudentId(article.author))}>
              <Avatar
                src={getAuthor(article.author)?.picture_path}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </Link>
            <Stack spacing={0.5}>
              <Link
                href={routes.member(getAuthorStudentId(article.author))}
              >
                {getSignature(article.author)}
              </Link>
              <Typography>
                {timeAgo(date)}
              </Typography>
            </Stack>

            {/* Edit button */}
            {(hasAccess(apiContext, 'news:article:update')
              || authorIsUser(article.author, user)) && (
              <Link style={{ marginLeft: 'auto' }} href={routes.editArticle(article.id)}>
                <IconButton color="primary">
                  <EditOutlinedIcon />
                </IconButton>
              </Link>
            )}
          </Stack>

          {/* Header */}
          <Link href={routes.article(article.slug || article.id)}>
            <Typography variant="h5" className={classes.header}>
              {selectTranslation(i18n, article.header, article.headerEn)}
            </Typography>
          </Link>
          {(fullArticle && article.imageUrl) && (
          <div style={{
            position: 'relative', height: '300px', width: '100%', margin: '1rem 0',
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
          </div>
          )}
          {/* Tags */}
          {article.tags.length > 0 && (
            <Box flexDirection="row" flexWrap="wrap">
              {article.tags.map((tag) => (<Tag key={tag.id} tag={tag} />
              ))}
            </Box>
          )}
          {/* Body */}
          {fullArticle && (
          <Box
            ref={markdownRef}
          >
            <ReactMarkdown
              components={{
                a: Link,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </Box>
          )}
        </Grid>

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
            onClick={() => setShowAll(true)}
          />
        </Stack>

        {/* Actions */}
        {fullArticle && (
          <>
            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="space-around"
            >
              <LikeButton
                isLikedByMe={article.isLikedByMe}
                toggleLike={() => toggleLike()}
                access="news:article:like"
              />
              <CommentButton toggleComment={() => commentInputRef.current.focus()} access="news:article:comment" />
            </Stack>

            <Comments
              id={article.id}
              comments={article.comments}
              type="article"
              commentInputRef={commentInputRef}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          </>
        )}
        {!fullArticle && (
        <LikeButton
          isLikedByMe={article.isLikedByMe}
          toggleLike={() => toggleLike()}
          access="news:article:like"
        />
        )}
      </Stack>
    </Paper>
  );
}
