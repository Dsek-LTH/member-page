import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import HOME_COPY from '~/components/Nolla/copy/home';

const CopyContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScalingParagraph = styled('p')`
  ${DESKTOP_MQ} {
    font-size: 36px;
    text-align: center;
  }
`;

const ImageCopyContainer = styled('div')`
  display: flex;
`;

const VolleybollTeam = styled('img')`
  display: none;
  ${DESKTOP_MQ} {
    display: block;
    min-width: 27rem;
  }
`;

const LowerCopy = styled('div')`
  ${DESKTOP_MQ} {
    margin-top: 1rem;
    margin-left: 2rem;
  }
`;

export default function Copy() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? HOME_COPY.en : HOME_COPY.sv;
  return (
    <CopyContainer>
      <ScalingParagraph>{copy.bigText}</ScalingParagraph>
      <ImageCopyContainer>
        <VolleybollTeam src="/images/nolla/volleyboll.png" alt="Glada d-sekare" />
        <LowerCopy>{copy.main()}</LowerCopy>
      </ImageCopyContainer>
    </CopyContainer>
  );
}
