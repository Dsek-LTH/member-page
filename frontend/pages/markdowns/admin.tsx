import { Button, TextField, Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useGetMarkdownsQuery, useCreateMarkdownMutation } from '~/generated/graphql';

export default function CafePage() {
  const { data, refetch } = useGetMarkdownsQuery();
  const [newMarkdown, setNewMarkdown] = useState('');
  const [createMarkdown] = useCreateMarkdownMutation({ variables: { name: newMarkdown } });
  return (
    <>
      <h2>Markdown Admin</h2>
      <Stack direction="row" spacing={2}>
        <TextField
          value={newMarkdown}
          onChange={(event) => {
            setNewMarkdown(event.target.value);
          }}
        />
        <Button
          variant="outlined"
          type="submit"
          onClick={() => {
            createMarkdown().then(() => {
              refetch();
            });
          }}
        >
          Add
        </Button>
      </Stack>

      {data?.markdowns.map((markdown) => (
        <p key={markdown.name}>{markdown.name}</p>
      ))}
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
