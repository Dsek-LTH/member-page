import { Stack, Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import selectTranslation from '~/functions/selectTranslation';
import { AllPositionsQuery } from '~/generated/graphql';
import useAllPositions from '~/hooks/useAllPositions';

interface PositionsSelectorProps {
  setSelectedPosition: (position: AllPositionsQuery['positions']['positions'][number]) => void;
}

function PositionsSelector({ setSelectedPosition }: PositionsSelectorProps) {
  const { positions } = useAllPositions();

  const { t, i18n } = useTranslation('common');

  return (
    <Stack direction="row" spacing={2} width="100%">
      <Autocomplete
        onChange={(
          e,
          position: AllPositionsQuery['positions']['positions'][number],
        ) => {
          if (position) {
            setSelectedPosition(position);
          } else {
            setSelectedPosition(null);
          }
        }}
        sx={{ width: '100%' }}
        options={(positions || []).map((position) => ({
          ...position,
          label: selectTranslation(i18n, position.name, position.nameEn),
        }))}
        renderInput={(params) => <TextField {...params} label={t('role')} />}
        isOptionEqualToValue={() => true}
      />
    </Stack>
  );
}

export default PositionsSelector;
