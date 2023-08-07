const ACCOMODATION_COPY = {
  sv: {
    boende: 'Boende',
    main: () => (
      <>
        I Lund kan det vara lite knepigt att hitta boende - som tur är har
        novischer (förstaårsstudenter) förtur. Kontakta AF-Bostäder, Bopoolen
        eller en nation direkt! Studentlund har några bra tips som gäller alla
        dessa alternativ, samt några andra sätt att få tag i boende. Klicka dig
        in där och läs på!
        <br />
        Stiftelsen Michael Hansens Kollegium står utanför AFB och här kan du
        därför bo i studentbostäder utan att vara medlem i en nation. Enda
        kravet för att få bo här är att du är student vid Lunds Universitet. Är
        det så att du inte hittar någonstans att bo eller är i behov av
        tillfällig sovplats kan du kontakta din phadder :)
      </>
    ),
    listTitle: 'Bostäder i Lund',
    list: () => (
      <>
        <p>Rangordnade utefter möjlighet för boende</p>
        <ul>
          <li>AF-Bostäder</li>
          <li>Studentlund - Nationer</li>
          <li>Michael Hansens Kollegium</li>
          <li>Privat hyresvärd</li>
          <li>Bopoolen</li>
        </ul>
        Facebook-grupper. Exempelvis:
        <ul>
          <li>Kollektiv i Lund</li>
          <li>Lägenheter i Lund</li>
        </ul>
      </>
    ),
    typeTitle: 'Typer av boende',
    types: () => (
      <ul>
        <li>
          <b>Korridor</b>
          {' '}
          - Ett boende med gemensamt allrum och kök, eget rum
          och (oftast) eget badrum. Många blir bra kompisar med sina
          korre-kompisar!
        </li>
        <li>
          <b>Lägenhet</b>
          {' '}
          - Helt eget boende. Man har eget kök och eget
          vardagsrum. Lägenheter kallas ofta på AF-bostäder för “X rum och kök”
          för att beskriva storleken. Större lägenheter kan delas med kompisar
          för lägre hyra!
        </li>
        <li>
          <b>Inneboende</b>
          {' '}
          - Du hyr ett rum eller en yta av en privatperson,
          detta sker alltså oftast inte via en organisation utan är vanligare
          via kontakter eller Facebook-grupper.
        </li>
      </ul>
    ),
    tipsTitle: 'Allmäna tips',
    tips: () => (
      <ul>
        <li>
          Ställ dig i bostadskö på AF-bostäder så fort du kan. Om du inte skulle
          få en bostad trots novischförtur brukar det inte ta lång tid att få
          ihop tillräckligt med kötid för att hitta boende snart.
        </li>
        <li>
          De nationer med flest rum och lägenheter är Lunds nation, Helsingkrona
          nation och Malmö nation.
        </li>
        <li>
          Många nationer har ett poängsystem för att få boende. Detta innebär
          att ju mer aktiv du är inom nationen (ex. jobba luncher, pubar,
          sittningar etc.) desto större chans har du att få boende.
        </li>
        <li>
          Om du får ett erbjudande för boende på AF-bostäder så försvinner dina
          poäng, så sök inte något boende du faktiskt inte vill ha.
        </li>
        <li>
          Många nationer ber dig att skriva ett personligt brev när du ansöker
          om boende, så skriv något extra charmigt för att öka dina chanser!
        </li>
      </ul>
    ),
  },
  en: {
    boende: 'Housing',
    main: () =>
      "In Lund, it can be a bit tricky to find accommodation - luckily, first-year students have priority. Contact AF-Bostäder, Bopoolen, or a nation directly! Studentlund has some great tips that apply to all these options, as well as some other ways to find housing. Check out their website and read up on it! Stiftelsen Michael Hansens Kollegium is independent of AF Bostäder, and here you can live in student housing without being a member of a nation. The only requirement to live here is that you are a student at Lund University. If you can't find a place to stay or need temporary accommodation, you can contact your mentor for assistance!",
    listTitle: 'Housing in Lund',
    list: () => (
      <>
        <p>Ranked according to possibility for housing</p>
        <ul>
          <li>AF-Bostäder</li>
          <li>Nations</li>
          <li>Michael Hansens Kollegium</li>
          <li>Private renting</li>
          <li>Bopoolen</li>
        </ul>
        Facebook-groups, such as:
        <ul>
          <li>Kollektiv i Lund</li>
          <li>Lägenheter i Lund</li>
        </ul>
      </>
    ),
    typeTitle: 'Types of housing',
    types: () => (
      <ul>
        <li>
          <b>Corridor room</b>
          {' '}
          - A type of accommodation with a shared common
          room and kitchen, private room, and (usually) a private bathroom. Many
          people become good friends with their corridor mates!
        </li>
        <li>
          <b>Apartment</b>
          {' '}
          - A completely independent living space. You have your own
          kitchen and living room. Apartments are often called “X rooms and
          kitchen” by AF-bostäder to describe the size. Larger apartments can be
          shared with friends for lower rent!
        </li>
        <li>
          <b>Subletting</b>
          {' '}
          - You rent a room or an area from a private person,
          this usually does not happen through an organization but is more
          common through contacts or Facebook groups.
        </li>
      </ul>
    ),
    tipsTitle: 'General tips',
    tips: () => (
      <ul>
        <li>
          Get in the housing queue at AF-bostäder as soon as you can. If you do
          not get a home despite the novice priority, it usually does not take
          long to get enough queue time to find accommodation soon.
        </li>
        <li>
          The nations with the most rooms and apartments are Lunds nation,
          Helsingkrona nation and Malmö nation.
        </li>
        <li>
          Many nations have a point system for getting accommodation. This means
          that the more active you are within the nation (eg. work lunches,
          pubs, sittings etc.) the greater your chances of getting
          accommodation.
        </li>
        <li>
          If you receive an offer for accommodation at AF-bostäder, your points
          will disappear, so do not apply for any accommodation you do not
          actually want.
        </li>
        <li>
          Many nations ask you to write a personal letter when applying for
          accommodation, so write something extra charming to increase your
          chances!
        </li>
      </ul>
    ),
  },
};

export default ACCOMODATION_COPY;
