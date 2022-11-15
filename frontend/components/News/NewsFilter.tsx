import { Stack } from '@mui/material';
import TagSelector from '../ArticleEditor/TagSelector';

export default function NewsFilter({ tagIds, setTagIds }) {
  return (
    <Stack marginBottom="1rem">
      <TagSelector currentlySelected={tagIds} onChange={setTagIds} />
    </Stack>
  );
}
