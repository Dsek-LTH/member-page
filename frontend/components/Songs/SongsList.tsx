import { Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSongsQuery } from '~/generated/graphql';
import Song from './Song';

export default function SongsList() {
  const { t } = useTranslation();
  const { data } = useSongsQuery();
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState('');
  const [sliceEnd, setSliceEnd] = useState(10);

  useEffect(() => {
    if (data?.songs) {
      setSongs(data?.songs
        .filter((song) =>
          song.title.toLowerCase().includes(filter.toLowerCase())
          || song.lyrics.toLowerCase().includes(filter.toLowerCase())
          || song.category.toLowerCase().includes(filter.toLowerCase())
          || song.melody.toLowerCase().includes(filter.toLowerCase())));
    }
  }, [data, filter]);

  useEffect(() => {
    setSliceEnd(10);
    let newScroll = window.scrollY;
    document.addEventListener('scroll', () => {
      const oldScroll = newScroll;
      newScroll = window.scrollY;
      const scrollDelta = oldScroll - newScroll;
      if (scrollDelta < -5 && data?.songs.length > sliceEnd) {
        setSliceEnd((state) => state + 1);
      }
    });
  }, [data, filter]);

  return (
    <Stack spacing={3}>
      <TextField label={t('search')} value={filter} onChange={(event) => setFilter(event.target.value)} />
      {songs.slice(0, sliceEnd).map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </Stack>
  );
}
