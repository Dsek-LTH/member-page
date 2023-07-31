import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import MasonryCard from '~/components/Nolla/Card';
import ProfileCard from '~/components/Nolla/ProfileCard';
import { DESKTOP_MQ } from '~/components/Nolla/constants';
import GUILD_COPY from '~/components/Nolla/copy/guild';
import NollaLayout from '~/components/Nolla/layout';
import theme from '~/components/Nolla/theme';
import genGetProps from '~/functions/genGetServerSideProps';

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Logos = styled('div')`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const Logo = styled('img')`
  width: 90px;
  height: 120px;
  ${DESKTOP_MQ} {
    width: 190px;
    height: 256px;
  }
`;

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

export const getStaticProps = genGetProps(['nolla']);

function GuildNollaPage() {
  const { i18n } = useTranslation();
  const copy = i18n.language === 'en' ? GUILD_COPY.en : GUILD_COPY.sv;
  return (
    <Main>
      <Box sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <MasonryCard>
          <Typography variant="h4">{copy.d_guild}</Typography>
          <Typography variant="body1">{copy.guild_description}</Typography>
        </MasonryCard>
      </Box>

      <Logos>
        <Logo src="/images/nolla/d_logo_new.png" alt="Logotyp D-sektionen" />
      </Logos>

      <Typography
        variant="h5"
        fontWeight={500}
        textAlign="center"
        sx={{
          my: 5,
          textDecoration: 'underline solid hsl(317, 82%, 56%)',
          textUnderlineOffset: 16,
        }}
      >
        Styrelsen
      </Typography>

      <Box>
        <Row>
          <ProfileCard
            name="Sofia Tatidis"
            desc={(
              <>
                <Typography variant="body1" color="primary">
                  Ordförande
                </Typography>
                <Typography variant="body1">
                  Hejsan n0llan, jag heter Sofia och är en 22-årig tjej från
                  Blekinge! Tiden går fort när man har kul sägs det, och kanske
                  är det därför jag känner mig ung trots att jag går 4:e året på
                  data. Som ordförande leder jag styrelsen och sektionen och
                  representerar sektionen utåt. I våras gick jag på inte mindre
                  än 5 (!) baler för att representera D-sek. När jag inte
                  glassar runt i balklänning så tycker jag om att laga mat och
                  snacka skit. Jag snackar väldigt gärna om the Witcher
                  (speciellt böckerna), min hemort i Blekinge (kan du gissa
                  vilken stad??) och “dagens ekonomi”, så var inte rädd för att
                  komma fram till mig och säga “Hello World!”.
                </Typography>
              </>
            )}
            image="/images/styrelsen/ordforande.jpg"
            offset={['50%', '100%']}
          />
        </Row>
      </Box>

      <Row>
        <ProfileCard
          name="Hampus Serneke"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Vice Ordförande
              </Typography>
              <Typography variant="body1">
                Tja! Jag heter Hampus Serneke och jag är Vice Ordförande här på
                D-sektionen. Jag är 21 år gammal och läser just nu mitt andra år
                på Datateknik. Jag är en sjukt stor mattenörd, men när jag inte
                sitter inne och räknar så älskar jag även att cykla och springa
                (helst med kompisar). Carpe diem är mitt livsmotto (har läst
                30hp filosofi) så är det onsdag hittar ni mig på VGs.
                <br />
                Som Vice Ordförande hjälper jag Sofia och resten av styrelsen
                med allt möjligt, men ett av mina ansvarsområden är att
                protokollföra våra styrelse- och sektionsmöten samt att hålla
                våra styrdokument uppdaterade. Jag sökte till den här posten
                precis efter att nollningen var klar, och jag rekomenderar er
                starkt till att göra samma! Tveka inte med att komma och prata
                med mig om ni har några frågor. Med det sagt så hoppas jag att
                ni får en fantastisk nollning!
              </Typography>
            </>
          )}
          image="/images/styrelsen/vordforande.jpg"
        />
        <ProfileCard
          name="Rafael Holgersson"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Aktivitetsansvarig
              </Typography>
              <Typography variant="body1">
                Tjenixten blixten! Rafael här, D21a, är Aktivitetsansvarig
                (AktA) och därmed leder Aktivitetsutskottet (AktU). AktU är ett
                utskott med lika många möjligheter som medlemmar på sektionen
                och vi arrangerar det mesta studentsociala som sektionen har att
                erbjuda på. Vi hittar på allt roligt från vårt egna fotbollslag
                till LAN helger till att sälja sektions merch till... ah du
                fattar, vad som helst mellan himmel och jord. Vi brukar ha cirka
                4 event varje vecka, men oftast blir det fler. Information om
                vad vi gör hittar du på hemsidan (dsek.se), Dappen och vår
                instagram @aktivitetsutskottet_dsek. Är det något du skulle
                vilja göra, försök fånga mig eller skriv till akta@dsek.se så
                löser vi det!
                <br />
                Vem är Rafael då? Jag växte upp i Blekinges skogar men har bott
                i Nortälje, Australien och tillslut landade jag här i Lund. Jag
                älskar att hitta på saker och mina intressen inkluderar träning,
                växter, spel, volleyboll, svampar, hår, resor och musikaler. Om
                vi delar några intressen blir jag jätteglad om du fångar mig så
                vi kan nörda ner oss tillsammans.
              </Typography>
            </>
          )}
          image="/images/styrelsen/aktivitetsansvarig.jpg"
          offset="50%"
        />
        <ProfileCard
          name="Oliver Levay"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Informationsansvarig
              </Typography>
              <Typography variant="body1">
                Halloj! Jag heter Oliver och som ni kan se är jag
                informationsansvarig. Det innebär att jag är ansvarig för
                informationsutskottet och sitter i styrelsen och kingar loss. I
                informatkonsutskottet gör vi en massa saker. Vi fotar, filmar,
                skapar grafik, skriver tidning och kodar kodar kodar både appen
                och hemsidan. Kom gärna till mig om ni har frågor om sektionen,
                informationsutskottet, eller kod : - ) på spotify heter jag
                &quot;olivoljan&quot;
              </Typography>
            </>
          )}
          image="/images/styrelsen/informationsansvarig.jpg"
        />
        <ProfileCard
          name="Axel Svensson"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Skattmästare
              </Typography>
              <Typography variant="body1">
                Hejsan! Mitt namn är Axel, är 23 år gammal och pluggar mitt 6:e
                år på data. Som skattmästare är det min och mitt utskotts
                uppgift att se efter sektionens pengar och hur vi använder dem.
                Det betyder att vi har hand om sektionens bokföring och ser
                efter budgeten. Om ni har frågor om pengar, alkohollagen eller
                annat kul hittar ni mig förmodligen i styrelserummet, annars på
                skattm@dsek.se.
              </Typography>
            </>
          )}
          image="/images/styrelsen/skattm.jpg"
        />
        <ProfileCard
          name="Julia Karlsson"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Källarmästare
              </Typography>
              <Typography variant="body1">
                Heyo, jag heter Julia och är en ålänning på 23 år som går 4e
                året på Data! Jag är Källarmästare i år, vilket innebär att jag
                tar hand om sektionens lokaler, inventarier och såklart
                Källarmästeriet och underutskottet Rootmästeriet.
                Källarmästeriet brukar syssla med att bygga, måla och pyssla,
                allt som behövs för att förbättra och underhålla iDét som är vår
                fina sektionslokal. Vi fixar även med ljud- och ljus och
                sektionsbilen ÿalle. Rootmästeriet tar hand om sektionens
                servrar och hårdvara, och gör lite roliga projekt här och var,
                kolla till exempel in Boss [bu:s] eller vår fina binärklocka i
                iDét. Om något av detta låter kul, kom och snacka med mig, eller
                kom med på en Fixarkväll eller Snickerboa! Man kan också nå mig
                via: kallarm@dsek.se
              </Typography>
            </>
          )}
          image="/images/styrelsen/kallarm.jpg"
        />
        <ProfileCard
          name="Ludvig Svedberg"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Sexmästare
              </Typography>
              <Typography variant="body1">
                Ludde är namnet och sexmästare är posten. Jag är snart 21 år,
                pluggar mitt 4e år på data (shit va tiden går snabbt!), och
                kommer från södra Sveriges bästa stad Ystad. På sektionen leder
                jag sexmästeriet, det är vi som håller i alla pubar, sittningar
                och eftersläpp. Ni kommer se oss springa runt i våra
                collegejackor hela nollningen. Utöver sexet är jag även väldigt
                engagerad i DWWW och har bl.a. ansvarat för att bygga och släppa
                vår alldeles egna app i år! Om du har några frågor om
                sexmästeriet, eller bara är sugen på att snacka kod, tveka inte
                att skicka till mig på Messenger eller maila sexm@dsek.se!
              </Typography>
            </>
          )}
          image="/images/styrelsen/sexm.jpg"
          offset={['55%', '90%']}
        />
        <ProfileCard
          name="Arvid Carp"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Cafémästare
              </Typography>
              <Typography variant="body1">Tjolahoppsan n0llan!</Typography>
              <Typography variant="body1">
                Tycker du om att inte svälta? Tycker du om att ha kul? Tycker du
                om att knyta kroken till linan vid gryningens utbrott inför en
                rafflande dag av torskfiske? Då är cafémästeriet utskottet för
                dig! Nere i iDét driver vi sektionens café. Där kan man köpa
                mättande mackor, kokhett kaffe och fin fika. Eller så kan man
                bara dyka upp för lite härligt häng. Ibland anordnar vi bruncher
                och frukostar för när du är för bakis eller trött för att laga
                mat själv (wow vilket wholesome utskott).Jag är cafémästare
                Arvid Carp, 23 år, från Kullabergs vindpiskade klippor. Jag
                älskar verkligen att hänga med nollor, så var inte rädd för att
                komma fram till mig och snacka om ni ser mig i iDét eller på
                någon fest. Ha det fint och kom ihåg att #PantaiiDet!
              </Typography>
            </>
          )}
          image="/images/styrelsen/cafem.jpg"
        />
        <ProfileCard
          name="Adam Coleman"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Näringslivsansvarig
              </Typography>
              <Typography variant="body1">Nämen tjena!</Typography>
              <Typography variant="body1">
                Jag heter Adam och pluggar mitt andra år på InfoCom här i Lund!
                Jag kommer från Stockholm och njuter av att här i Lund ha allt
                man kan tänka sig behöva inom en radie mindre än va avståndet
                till min närmsta tunnelbanestation var. Som näringslivsansvarig
                är mitt ansvarsområde att jonglera alla våra företagssamarbeten
                och att genom dem få in pengar till sektionen. Tillsammans med
                företagen anordnar vi bl.a. lunchföreläsningar, pubar och
                hjälper även dem att synas hos oss på andra sätt. Vi gör allt
                för att ni ska få massa nya kontakter och era drömjobb på sikt.
                Med pengarna som vi drar in finansierar vi våra egna evenemang,
                bl.a. allt som händer under nollningen, underhåll av iDét och
                mycket mer. Om du har någon fråga eller kul idé är det bara att
                grabba tag i mig på skolan, skicka ett meddelande till mig på
                messenger eller maila mig på industrim@dsek.se!
              </Typography>
            </>
          )}
          image="/images/styrelsen/industrim.jpg"
        />
        <ProfileCard
          name="Mikolaj Sinicka"
          desc={(
            <>
              <Typography variant="body1" color="primary">
                Studierådsordförande
              </Typography>
              <Typography variant="body1">Halloj!</Typography>
              <Typography variant="body1">
                Mikolaj heter jag och är ordförande för sektionens viktigaste
                utskott, studierådet! SRD - som det ofta kallas - har i uppgift
                att genomföra studiebevakning, och se till att våra åsikter om
                vår utbildning kommer fram. Vi har lunchmöten (nästan) varje
                onsdag lunch i E:1426, där vi diskuterar de pågående kurserna
                och andra studierelaterade frågor. Alla är välkomna på dessa
                möten, så sväng förbi om du har funderingar, frågor eller du
                vill klaga om dina kurser! Är det något du funderar på så är det
                bara att ta tag i mig i IDét eller skicka mail till
                srdordforande@dsek.se.
              </Typography>
            </>
          )}
          image="/images/styrelsen/srdordforande.jpg"
        />
      </Row>

      <Box sx={{ maxWidth: '65ch', margin: 'auto' }}>
        <MasonryCard>
          <Typography variant="h4">D-Chip</Typography>
          <>
            <Typography variant="body1">
              Varmt välkommen till D-sektionen här på LTH! D-Chip är en
              organisation som arbetar för att främja gemenskapen och trivseln
              bland kvinnor och icke-binära på sektionen. Vi är glada över att se
              så många nya ansikten (eller &quot;Micro-chips&quot;, som vi kallar våra nya
              medlemmar) i år!
            </Typography>
            <Typography variant="body1">
              Vi vill att du ska känna dig välkommen och trygg
              hos oss, därför finns D-Chip här för att ge stöd och skapa en
              inkluderande miljö där du kan vara dig själv. Vi arrangerar en mängd
              olika roliga evenemang under året, såsom välkomstlunchen,
              cykelphesten och event med inspirerande företag. På dessa evenemang
              har du möjlighet att träffa andra medlemmar samt få hjälp under
              studiernas gång. Vi är övertygade om att du kommer att hitta många
              nya vänner hos oss. Vi kommer även anordna ett mentorskapssprogram
              för er nya medlemmar under hösten, där en D-Chipare från en äldre
              årskurs paras ihop med er för att ge stöd, tips och tricks inför
              studierna! Vi vill också uppmuntra kvinnor och icke-binära att ta en
              aktiv roll på sektionen. Genom att engagera dig i D-Chip kan du vara
              med och påverka och skapa förändring för att främja jämställdhet och
              inkludering på sektionen. Tveka inte att kontakta oss om du har
              frågor eller behöver stöd. Vi finns här för dig! Du kan prata med
              oss i styrelsen eller följa oss på sociala medier @dchip för att
              hålla dig uppdaterad om allt kul som vi planerar tillsammans. Vi ser
              fram emot att träffa just dig på våra kommande evenemang. Tills
              dess, ta hand om dig själv och varandra!
            </Typography>
            <Typography variant="body1">
              Varmt välkomna till D-sektionen och D-Chip!
            </Typography>
            <br />
            <Typography variant="body1" fontStyle="italic">
              Hälsningar,
            </Typography>
            <Typography variant="h6" fontStyle="italic">Styrelsen för D-Chip</Typography>
          </>
          <Image
            src="/images/nolla/d_chip.jpg"
            alt="Glada d-sekare"
            width={4096}
            height={2731}
            layout="intrinsic"
            objectFit="cover"
          />
        </MasonryCard>
      </Box>
    </Main>
  );
}

GuildNollaPage.getLayout = function getLayout({ children }) {
  return <NollaLayout maxWidth="lg">{children}</NollaLayout>;
};

GuildNollaPage.theme = theme;

export default GuildNollaPage;
