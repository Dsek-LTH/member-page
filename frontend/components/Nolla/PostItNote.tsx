import { styled } from '@mui/system';
import { COLOR } from '~/components/Nolla/constants';

const Container = styled('div')`
  position: relative;
  font-family: 'Ubuntu Mono';
  margin-left: auto;
  margin-right: auto;
`;

const Tape = styled('img')`
  position: absolute;
  width: 9rem;
  height: 10rem;
  top: -5rem;
  left: 5rem;
`;

const Paper = styled('div')`
  min-width: 20rem;
  max-width: 20rem;
  min-height: 20rem;
  max-height: 20rem;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 20px 40px 40px 10px rgba(13, 13, 13, 0.3);
`;

export default function PostItNote({
  purple,
  children,
}: {
  purple?: boolean;
  children?: JSX.Element | JSX.Element[];
}) {
  return (
    <Container>
      <Tape src="/images/nolla/tape.png" />
      <Paper style={{ backgroundColor: purple ? COLOR.PURPLE : COLOR.PINK }}>
        {children}
      </Paper>
    </Container>
  );
}
