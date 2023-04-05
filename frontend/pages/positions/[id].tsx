import
{
  Avatar,
  Link, Paper, Stack, Typography, styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Mandate from '~/components/Positions/Mandate';
import genGetProps from '~/functions/genGetServerSideProps';
import { getFullName } from '~/functions/memberFunctions';
import selectTranslation from '~/functions/selectTranslation';
import { PositionQueryResult, usePositionQuery } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem;
`;

const PositionTitle = styled(Typography)`
  word-break: break-all;
  hyphens: auto;
`;

const PositionDescription = styled(Typography)`
  margin-bottom: 1rem;
`;
type MandateType = PositionQueryResult['data']['mandatePagination']['mandates'][number];
type StructuredMandates = {
  year: string;
  mandates: MandateType[];
}[];
function PositionCard({ position, mandates }) {
  const { t, i18n } = useTranslation(['common', 'position']);
  const apiContext = useApiAccess();

  // Format mandates as an ordered array
  const mandatesByYear: StructuredMandates = useMemo(
    () => mandates.reduce((acc: StructuredMandates, mandate: MandateType) => {
      const startYear = new Date(mandate.start_date).getFullYear();
      const endYear = new Date(mandate.end_date).getFullYear();
      const year: string = startYear === endYear ? startYear.toString() : `${startYear}-${endYear}`;
      const existing = acc.find((m) => m.year === year);
      if (existing) {
        existing.mandates.push(mandate);
      } else {
        // add in correct position in ascending order
        const index = acc.findIndex((m) => m.year < year);
        if (index === -1) {
          acc.push({ year, mandates: [mandate] });
        } else {
          acc.splice(index, 0, { year, mandates: [mandate] });
        }
      }
      return acc;
    }, [] as StructuredMandates),
    [mandates],
  );

  return (
    <Container>
      <PositionTitle variant="h4" sx={{ mb: 2 }}>
        {selectTranslation(i18n, position.name, position.nameEn)}
        <br />
        {position.email && (
        <Link fontSize="0.8em" href={`mailto:${position.email}`}>
          {position.email}
        </Link>
        )}
      </PositionTitle>
      {position.emailAliases?.length > 0 && (
      <>
        <Typography fontSize="0.8rem">
          {t('position:otherEmails')}
        </Typography>
        <Stack direction="row" flexWrap="wrap" columnGap={2} sx={{ fontSize: 12, mb: 1 }}>
          {position.emailAliases.map((alias) => (
            <Link key={alias} href={`mailto:${alias}`}>
              {alias}
            </Link>
          ))}
        </Stack>
      </>
      )}

      {position.description && (
      <PositionDescription>
        {selectTranslation(i18n, position.description, position.descriptionEn)}
      </PositionDescription>
      )}
      <Stack gap={1}>
        {mandatesByYear.map((mandateAndYear) => (
          <Stack key={`mandate-categegory${mandateAndYear.year}`} style={{ marginTop: '1rem' }} gap={1}>
            <Typography variant="h5">{mandateAndYear.year}</Typography>
            {mandateAndYear.mandates.map(({ id, member }) => (
              <Link key={id} href={routes.member(member.id)}>
                <Stack direction="row" alignItems="center">
                  <Avatar
                    src={member.picture_path}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <Typography style={{ marginLeft: '1rem' }}>
                    {getFullName(member)}
                  </Typography>
                </Stack>

              </Link>
            ))}
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}

export default function PositionPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = usePositionQuery({ variables: { id: id.toString() } });
  if (loading) return null;
  const position = data?.positions?.positions[0];
  if (!data || !position) return <div>Position not found</div>;
  const { mandates } = data.mandatePagination;
  return (
    <PositionCard position={position} mandates={mandates} />
  );
}

export const getServerSideProps = genGetProps(['position']);
