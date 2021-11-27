import { DateTime } from 'luxon';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import MandateList from '~/components/Mandates/MandateList';
import Stepper from '~/components/Mandates/Stepper';

export default function MandatePageByYear() {
  const router = useRouter();
  const { t, i18n } = useTranslation('mandate');

  const year = router.query.year as string;
  const currentYear = DateTime.now().year;
  const lthOpens = 1961;
  const timeInterval = currentYear - lthOpens;

  const moveForward = () => {
    router.push('/mandates/' + (parseInt(year) - 1));
  };

  const moveBackward = () => {
    router.push('/mandates/' + (parseInt(year) + 1));
  };

  return (
    <>
      <h2 className="classes.positionName">
        {t('mandates')} {year}
      </h2>
      {lthOpens <= parseInt(year) && parseInt(year) <= currentYear ? (
        <>
          <Stepper
            moveForward={moveForward}
            moveBackward={moveBackward}
            year={parseInt(year)}
            idx={timeInterval - (parseInt(year) - lthOpens)}
            maxSteps={timeInterval}
          ></Stepper>
          <MandateList year={year} />
        </>
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
