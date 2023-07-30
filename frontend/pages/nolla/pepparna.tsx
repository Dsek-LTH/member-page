import { Box, Typography } from '@mui/material';
import React from 'react';
import MasonryCard from '~/components/Nolla/Card';
import ProfileCard from '~/components/Nolla/ProfileCard';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

function Row({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        flexWrap: 'wrap',
        gap: 4,
      }}
    >
      {children}
    </Box>
  );
}

function Pepparna() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <MasonryCard>
          <Typography variant="h4">Pepparna</Typography>
          <Typography variant="body1">
            En peppare är en person som bistår de som har planerat nollningen i
            deras arbete med att planera och utföra nollningen. De springer allt
            som oftast runt i rosa frackar och ser till så att både nollor och
            phaddrar är peppade. De vet allt om hur nollningen fungerar – om du
            har missat att köpa biljett till en sittning eller känner dig osäker
            på var och när du ska infinna dig till olika event så kan du alltid
            prata med en peppare!
          </Typography>
        </MasonryCard>
      </Box>

      <Row>
        <ProfileCard
          name="Emma"
          desc="Halli hallå! Jag heter Emma och är Øverpeppare tillsammans med fina fina Linnea! Jag är 21 år gammal och går tredje året på data. Mitt bästa tips för en förtrollande hemmakväll är att dra tag i en kompis eller två och kolla på Pitch Perfect-filmerna! Det finns inget bättre än att äta lite chips och skriksjunga tillsammans med folk man tycker om."
          image="/images/pepparna/emma.jpg"
        />
        <ProfileCard
          name="Linnea"
          desc="Hejj!! Jag heter Linnea och är Øverpeppare tillsammans med härliga Emma! Jag är 22 år gammal och går andra året på infocom. För att förtrolla sin dag är att säga ja till allt!! (nästan, inga dumma grejer bara ;-)). Man vet aldrig vart man hamnar eller med vilka, men det kommer bli kul! Bada? En kopp te i iDet? Dansa? Ta en falafel? Vill du hänga med? JA! Jag kommer alltid säga ja om du vill snacka skidor, surf eller andra äventyr :))"
          image="/images/pepparna/linnea.jpg"
        />
      </Row>

      <Row>
        <ProfileCard
          name="Loke"
          desc="Yo, jag heter Loke och är 20 år gammal. Jag går just nu andra året på infocom #infokompisarstandup. Mitt bästa tips för en förtrollande nollning är att ta några vilodagar ibland. Det absolut bästa sättet att göra det på är att ta med några polare och spela frisbeegolf på St Hans backar! Billig och banger aktivitet som laddar upp din energi igen inför nästa nolleevent!!"
          image="/images/pepparna/loke.jpg"
        />
        <ProfileCard
          name="Alicia"
          desc="Heeejsan svejsan! Det är jag som är Alicia, jag fyller 23 i höst och jag pluggar nu mitt tredje år på infocom. Jag är född och uppvuxen i Sveriges finaste sommarstad Västervik! (Nej, det ligger inte på västkusten). Mitt magiska tips för att hinna med både nollning och skola är att laga dubbla stooooorkok, jag snackar två dussin portioner på en kväll. Då slipper man spendera alla pengar på GoG-sallader."
          image="/images/pepparna/alicia.jpg"
        />
        <ProfileCard
          name="Rilde"
          desc="Hej hopp!! Jag heter William men kallas i princip alltid Rilde. Jag är 24 år gammal och går nu mitt fjärde år på infocom. Mitt tips för förtrollande chili con/sin carne är att smaksätta med spiskummin och apelsinzest. För att göra den extra förtrollande bör den serveras med ris och en klick creme fraiche (inte gräddfil!!)"
          image="/images/pepparna/rilde.jpg"
        />
        <ProfileCard
          name="Thilda"
          desc="Hallå i stugan! Thilda heter jag och är förutom peppets ovanför-Stockholm-representant även likabehandlingsombud på sektionen. Jag är 26 år ung och läser tredje året på InfoCom. För att få en förtrollande nollning från början till slut är mitt bästa tips att gå på eventen som känns roligast för just dig och passa på att vila på andra. Skaffa bäst koll av alla på kommande event genom att läsa i kalendern, fråga en phadder eller haffa närmsta peppare! Puss och kram!"
          image="/images/pepparna/thilda.jpg"
        />
        <ProfileCard
          name="Axel"
          desc="Tjena tjena! Axel heter jag, även känd som Nice (fråga så kanske ni får veta varför). Jag har flugit 23 varv runt solen och går in på mitt femte år på Data. Mig hittar ni troligtvis på ett dansgolv nära dig eller i gamingstolen! För att få en magisk nollning så rekommenderar jag att ni försöker hinna med lite träning emellan roligheterna så orkar man både plugg och fest mycket bättre!"
          image="/images/pepparna/axel.jpg"
        />
        <ProfileCard
          name="Stina"
          desc={(
            <>
              <p>
                Mitt smeknamn är Stina, denna gäri är 21 år gammal och går helt
                plötsligt i trean på data. Min hemstad är fina fina Halmstad,
                känd för sin goda ‘Crush’ cider och mindre känd för bandet
                Gyllene Tider!
              </p>
              <p>
                Mitt allra mest magiska tips är att alltid dubbelchecka
                tvättmaskinen innan man går från tvättstugan, de kanske inte är
                på!
              </p>
              <p>
                Mitt allra magiska tips är att alltid duscha fötterna när man
                kommer hem från en fest, man blir förvånad över hur stanky de
                kan vara!
              </p>
              <p>
                Mitt allra mest magiska nollningstips är att ha solglasögon av
                ALLLA former och färger så att man ALLTID har snyggast glajjor
                på dansgolvet som dessutom matchar ens quirky lilla
                outfiiiiiiit!! Ses på dansgolvet! 3
              </p>
            </>
          )}
          image="/images/pepparna/stina.jpg"
        />
        <ProfileCard
          name="Sebastian"
          desc="Hallå där! Jag heter Sebastian, men kallas ofta Sebbe. Jag går nu mitt femte år på data och är 26 år gammal. Ett bra tips från mig är att se om ni kan hitta kurslitteraturen begagnad, till exempel om någon phadder har kvar sina gamla matteböcker! (Det är roligare att spendera dom pengarna i till exempel baren, där ni ofta hittar mig!)"
          image="/images/pepparna/sebastian.jpg"
        />
        <ProfileCard
          name="Nora"
          desc="Hejsan!! Jag heter Nora, är 22 år och pluggar tredje året InfoCom. Mitt bästa tips för en förtrollande morgonstund är att förbereda kaffe och frulle kvällen innan så man vaknar med ZEN och kan ta sig till morgonföreläsningen som ett academic weapon! Frukost är enligt mig det bästa målet på dagen, stay frukost stay flawless!!! Kramisar"
          image="/images/pepparna/nora.jpg"
        />
        <ProfileCard
          name="Felix"
          desc="Hola hola, namnet är Felix, åldern 21. Jag går just nu tredje året ish på data. Mitt bästa tips för en förtrollande nollning är att käka grönt och gott sallad och dunka hov22, men lyssna inte på mig jag är partisk. P.s snälla gog höj inte priserna på salladen!!"
          image="/images/pepparna/felix.jpg"
        />
      </Row>
    </Box>
  );
}

export const getStaticProps = genGetProps(['nolla']);

Pepparna.getLayout = function getLayout({ children }) {
  return <NollaLayout maxWidth="lg">{children}</NollaLayout>;
};

Pepparna.theme = theme;

export default Pepparna;
