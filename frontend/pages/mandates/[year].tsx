import { Stack } from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import MandateList from '~/components/Mandates/MandateList';
import Stepper from '~/components/Mandates/Stepper';
import PositionsSelector from '~/components/Members/PositionsSelector';
import CreateMandate from '~/components/Positions/CreateMandate';
import { AllPositionsQuery } from '~/generated/graphql';
import useMandatesByYear from '~/hooks/useMandatesByYear';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';

export default function MandatePageByYear() {
  const router = useRouter();
  const { t } = useTranslation('mandate');

  const [selectedPosition, setSelectedPosition] = useState<AllPositionsQuery['positions']['positions'][number]>(null);
  const apiContext = useApiAccess();
  const year = parseInt(router.query.year as string, 10);
  const { refetch } = useMandatesByYear(year);
  const currentYear = DateTime.now().year;
  const lthOpens = 1961;
  const timeInterval = currentYear - lthOpens;

  const moveForward = () => {
    router.push(`/mandates/${year - 1}`);
  };

  const moveBackward = () => {
    router.push(`/mandates/${year + 1}`);
  };

  return (
    <>
      <h2 className="classes.positionName">
        {`${t('mandates')} ${year}`}
      </h2>
      {lthOpens <= year && year <= currentYear ? (
        <Stack spacing={2}>
          {hasAccess(apiContext, 'core:mandate:create') && (
            <>
              <PositionsSelector setSelectedPosition={setSelectedPosition} />
              <CreateMandate position={selectedPosition} refetch={refetch} />
            </>
          )}
          <Stepper
            moveForward={moveForward}
            moveBackward={moveBackward}
            year={year}
            idx={timeInterval - (year - lthOpens)}
            maxSteps={timeInterval}
          />
          <MandateList year={year} />
        </Stack>
      ) : (
        <div>{t('mandateError')}</div>
      )}
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'mandate'])),
    },
  };
}
