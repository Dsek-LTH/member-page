import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import TagSearch from '~/components/Settings/TagSearch';
import Tag from '~/components/Tag';
import
{
  Tag as TagType,
  useBlacklistTagMutation,
  useGetBlacklistedTagsQuery,
  useUnblacklistTagMutation,
} from '~/generated/graphql';

export default function TagBlacklister() {
  const {
    data,
    loading,
  } = useGetBlacklistedTagsQuery();
  const [blacklistTag] = useBlacklistTagMutation();
  const [unblacklistTag] = useUnblacklistTagMutation();

  const [blacklistedTags, setBlacklistedTags] = useState<TagType[]>([]);

  const blacklist = (tag: TagType) => {
    blacklistTag({
      variables: {
        id: tag.id,
      },
    });
    setBlacklistedTags((curr) => [...curr, tag]
      .filter((t, i, a) => a.findIndex((t2) => t2.id === t.id) === i));
  };
  const unblacklist = (tagId: string) => {
    unblacklistTag({
      variables: {
        id: tagId,
      },
    });
    setBlacklistedTags((curr) => curr.filter((tag) => tag.id !== tagId));
  };

  useEffect(() => {
    setBlacklistedTags(data?.blacklistedTags ?? []);
  }, [data?.blacklistedTags]);

  if (loading) {
    return null;
  }

  return (
    <Box>
      <TagSearch onSelect={blacklist} alreadyChosen={blacklistedTags.map((t) => t.id)} />
      <Box sx={{ mt: 2 }}>
        {blacklistedTags.map((tag) => (
          <Tag key={tag.id} tag={tag} onDelete={() => unblacklist(tag.id)} />
        ))}
      </Box>

    </Box>
  );
}
