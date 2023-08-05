import { Box, Typography } from '@mui/material';
import React from 'react';
import MasonryCard from '~/components/Nolla/Card';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

function FAQ() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))', gap: [2, 4, 8] }}>
      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          Vad är en phadder?
        </Typography>
        <Typography variant="body1">
          En phadder är en äldre student som ofta springer runt i en ouveralle,
          och en del springer runt utan ouveralle. Phaddern vet en fruktansvärt
          massa saker om LTH och då speciellt hur D-sektionen och studentlivet
          fungerar. En phadder kan också allt som står på nollningsprogrammet,
          var foreläsningssalar ligger, hur man beställer pizza och var man tar
          vägen om man missade sista tåget hem. Alla phaddrarna har även gått på
          utbildning i ledarskap, alkoholansvar och mycket, mycket mer, så tveka
          inte att fråga dem något om en kris uppstår. Phaddern är till för Din
          skull.
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          Vad är en peppare?
        </Typography>
        <Typography variant="body1">
          En peppare är en person som bistår de som har planerat nollningen i
          deras arbete med att planera och utföra nollningen. De springer allt
          som oftast runt i rosa frackar och ser till så att både nollor och
          phaddrar är peppade. Pepparna håller även i en stor del av nollningens
          event och förfester. De vet allt om hur nollningen fungerar - om du
          har missat att köpa biljett till en sittning eller känner dig osäker
          på var och när du ska infinna dig till olika event så kan du alltid
          prata med en peppare!
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          När börjar nollningen?
        </Typography>
        <Typography variant="body1">
          Nollningen börjar måndagen den 21:a augusti. Detta är även din första
          “skoldag”, men den består främst av en rundvandering där du kommer att
          få fixa alla konton du behöver för dina studier, köpa din ouvveralle
          och sångbok, träffa din phaddergrupp med mera. Nollningen första stora
          event sker dagen efter, alltså tisdagen den 22:a augusti och hålls av
          pepparna, så missa inte det!
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          Hur lång är nollningen?
        </Typography>
        <Typography variant="body1">
          Nollningen sker under tidsperioden från den 21:a augusti till den 15:e
          september och avslutas med den storslagna nollegasquen, en mycket
          speciell finsittning som symboliserar att nollan blir etta. Det kommer
          dock att vara två veckor till av event efter den “officiella”
          nollningen slutar den 15:e september. Dessa veckorna kommer ha lite mer
          utrymme mellan eventen så att nollan ska få lite mer tid till
          studierna. Det sista eventet under nollningstiden sker den 30:e
          september.
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          Vad ska jag ha med mig till ett event? Och när ska jag vara där?
        </Typography>
        <Typography variant="body1">
          All info gällande kommande event kommer att finnas här på hemsidan
          under “Schema”-fliken och på nollningsappen. Du kommer även att få
          infomeddelanden i princip varje dag från de som arrangerat nollningen
          så att ni vet vad som gäller nästkommande dag. Era phaddrar kommer
          även att skriva all viktig information i er gruppchatt. Om du skulle
          ha några frågor kan du alltid fråga en av dina phaddrar!
        </Typography>
      </MasonryCard>

      <MasonryCard sx={{ '& > *:first-child': { height: '100%' } }}>
        <Typography variant="h5" fontWeight={500}>
          Måste jag vara med på allt?
        </Typography>
        <Typography variant="body1">
          Absolut inte! Nollningen är helt frivillig och du är med precis så
          mycket som du vill och känner att du har tid för. Nollningen finns
          till för att du som ny student ska kunna hitta en gemenskap på din nya
          utbildning, bli bekant med vad studentlivet har att erbjuda och ha
          väldigt roligt, men om du märker att nollningen inte är för dig eller
          om du helt enkelt har annat du hellre lägger din tid på är det helt
          okej!
        </Typography>
      </MasonryCard>
    </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

FAQ.getLayout = function getLayout({ children }) {
  return <NollaLayout>{children}</NollaLayout>;
};

FAQ.theme = theme;

export default FAQ;
