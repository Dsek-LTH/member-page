import { Stack, Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { selectTranslation } from '~/functions/selectTranslation';
import { GetPositionsQuery } from '~/generated/graphql';
import { usePositions } from '~/hooks/usePositions';

const PositionsSelector = ({ setSelectedPosition }) => {
  const { positions } = usePositions();

  const { t, i18n } = useTranslation('common');

  return (
    <Stack direction="row" spacing={2} width="100%">
      <Autocomplete
        onChange={(
          e,
          position: GetPositionsQuery['positions']['positions'][number]
        ) => {
          if (position) {
            setSelectedPosition(position);
          } else {
            setSelectedPosition(null);
          }
        }}
        sx={{ width: '100%' }}
        options={positions.map((position) => {
          return {
            ...position,
            label: selectTranslation(i18n, position.name, position.nameEn),
          };
        })}
        renderInput={(params) => <TextField {...params} label={t('role')} />}
        isOptionEqualToValue={() => true}
      />
    </Stack>
  );
};

export default PositionsSelector;
