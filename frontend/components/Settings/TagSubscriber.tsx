import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TagSearch from '~/components/Settings/TagSearch';
import Tag from '~/components/Tag';
import {
  Tag as TagType,
  useGetMyTagSubscriptionsQuery,
  useSubscribeToTagMutation,
  useUnsubscribeToTagMutation,
} from '~/generated/graphql';

export default function TagSubscriber() {
  const {
    data,
    loading,
  } = useGetMyTagSubscriptionsQuery();
  const [subscribeToTag] = useSubscribeToTagMutation();
  const [unsubscribeFromTag] = useUnsubscribeToTagMutation();

  const [subscribedTags, setSubscribedTags] = useState<TagType[]>([]);

  const subscribe = (tag: TagType) => {
    subscribeToTag({
      variables: {
        tagId: tag.id,
      },
    });
    setSubscribedTags([...subscribedTags, tag]
      .filter((t, i, a) => a.findIndex((t2) => t2.id === t.id) === i));
  };
  const unsubscribe = (tagId: string) => {
    unsubscribeFromTag({
      variables: {
        tagId,
      },
    });
    setSubscribedTags(subscribedTags.filter((tag) => tag.id !== tagId));
  };

  useEffect(() => {
    setSubscribedTags(data?.myTagSubscriptions ?? []);
  }, [data?.myTagSubscriptions]);

  if (loading) {
    return null;
  }

  return (
    <Box>
      <TagSearch onSelect={subscribe} alreadyChosen={subscribedTags.map((t) => t.id)} />
      <Box sx={{ mt: 2 }}>
        {subscribedTags.map((tag) => (
          <Tag key={tag.id} tag={tag} onDelete={() => unsubscribe(tag.id)} />
        ))}
      </Box>
    </Box>
  );
}
