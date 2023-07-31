import { Typography } from '@mui/material';
import MasonryCard from '~/components/Nolla/Card';
import ResponsiveMasonry from '~/components/Nolla/ResponsiveMasonry';
import NollaLayout from '~/components/Nolla/layout';
import genGetProps from '~/functions/genGetServerSideProps';
import theme from '~/components/Nolla/theme';

function Registration() {
  return (
    <ResponsiveMasonry>
      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          Vad betyder detta?
        </Typography>
        <Typography variant="body1">
          På universitet behöver du själv se till att du gör allt som krävs för
          att acceptera din plats på ett program. Detta kan verka skrämmande men
          det är inte särskilt svårt egentligen. Stegen du behöver ta står på
          denna sidan. Det är lätt att känna att man glömt göra någonting så var
          aldrig rädd för att kontakta studieledningen för att se till att du
          gjort allting du behöver!
        </Typography>
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          Vad behöver jag göra?
        </Typography>
        <>
          <Typography variant="body1">
            Här är stegen du behöver ta för att säkra din plats på ditt program:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Gå in på antagning.se och acceptera din plats på programmet.
              </Typography>
            </li>
            <br />
            <li>
              <Typography variant="body1">
                Gå på uppropet. Detta hålls av LTH och kommer vara digitalt. Du
                kommer att få mer information om detta av din phadder och skolan
                när nollningen och skolstart närmar sig.
              </Typography>
            </li>
          </ul>
          <Typography variant="body1">
            That’s it! Det är faktiskt allt du behöver göra för att säkra din
            plats på programmet.
            <br />
            <strong>OBS! </strong>
            Du kommer att få ett samtal av din phadder med mer information om
            nollningen och skolstarten ca 1-2 veckor innan nollningen börjar.
            Detta är inte på något sätt en metod för att acceptera din plats på
            programmet, det är bara för att förmedla information till dig som
            nyantagen!
          </Typography>
        </>
      </MasonryCard>

      <MasonryCard>
        <Typography variant="h5" fontWeight={500}>
          Anmälan för kurser
        </Typography>
        <Typography variant="body1">
          På LTH kommer du också att behöva anmäla dig på dina kurser manuellt.
          Detta görs via en hemsida som heter Ladok. Även detta kommer ni att få
          mer information kring i början av skolstarten.
        </Typography>
      </MasonryCard>
    </ResponsiveMasonry>
  );
}

Registration.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

export const getStaticProps = genGetProps(['nolla']);

Registration.theme = theme;

export default Registration;
