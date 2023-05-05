import
{
  Avatar,
  Button,
  Link, Paper, Stack, Tooltip, Typography, styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { i18n, useTranslation } from 'next-i18next';
import CommitteeIcon from '~/components/Committees/CommitteeIcon';
import genGetProps from '~/functions/genGetServerSideProps';
import { getFullName } from '~/functions/memberFunctions';
import selectTranslation from '~/functions/selectTranslation';
import { PositionQueryResult, usePositionQuery } from '~/generated/graphql';
import { useApiAccess } from '~/providers/ApiAccessProvider';
import routes from '~/routes';
import { useSetPageName } from '~/providers/PageNameProvider';

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
function PositionCard({
  position,
  mandates,
}:
{
  position: PositionQueryResult['data']['positions']['positions'][number];
  mandates: MandateType[]
}) {
  const { t } = useTranslation(['common', 'position']);
  const { hasAccess } = useApiAccess();

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

  const emailAliases = position.emailAliases?.filter((alias) => alias !== position.email);

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
        >
          <PositionTitle variant="h4">
            <Tooltip title={position.committee.name}>
              <Link
                href={routes.committeePage(position.committee.shortName)}
                sx={{ mr: 2 }}
              >
                <CommitteeIcon name={position.committee.name} />
              </Link>
            </Tooltip>
            {selectTranslation(i18n, position.name, position.nameEn)}
          </PositionTitle>
        </Stack>
        {hasAccess('core:position:update') && (
          <Link href={routes.editPosition(position.id)} component={Button}>
            Edit
          </Link>
        )}
      </Stack>
      {position.email && (
        <PositionTitle variant="h4" sx={{ mb: 1 }}>
          <Link fontSize="0.8em" href={`mailto:${position.email}`}>
            {position.email}
          </Link>
        </PositionTitle>
      )}
      {emailAliases?.length > 0 && (
      <>
        <Typography fontSize="0.8rem">
          {t('position:otherEmails')}
        </Typography>
        <Stack direction="row" flexWrap="wrap" columnGap={2} sx={{ fontSize: 12, mb: 1 }}>
          {emailAliases.map((alias) => (
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
  const position = data?.positions?.positions[0];

  const POSITION_TITLE = selectTranslation(i18n, 'Post', 'Position');

  useSetPageName(
    position?.name
      ? selectTranslation(i18n, position.name, position?.nameEn ?? position.name)
      : POSITION_TITLE,
    POSITION_TITLE,
  );
  if (loading) return null;
  if (!data || !position) return <div>Position not found</div>;
  const { mandates } = data.mandatePagination;

  return (
    <PositionCard position={position} mandates={mandates} />
  );
}

export const getServerSideProps = genGetProps(['position']);
