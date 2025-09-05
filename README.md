En enkel guide för att köra projektet lokalt.

---

## Förutsättningar

- [Node.js](https://nodejs.org/) version 18 eller senare
- En pakethanterare: **npm**, **pnpm** eller **yarn** (jag kör npm)

---

## Steg 1: Klona repot

git clone https://github.com/amandahulten/weather-app.git

cd weather-app

## Steg 2: Installera beroenden (välj ett av alternativen)

npm install

### eller

pnpm install

### eller

yarn install

## Steg 3: Starta utvecklingsservern (välj ett av alternativen)

npm run dev

### eller

pnpm dev

### eller

yarn dev

## Steg 4: Öppna i webbläsaren

Gå till http://localhost:3000

---

## Antaganden

- API:t returnerar data i celsius, giltiga ISO-datum och väderkoder som matchar ikonerna i WeatherIcons.

- Om man söker på en plats som inte stöds av API:t visas ett felmeddelande.

- Det räcker att visa en plats åt gången (ingen hantering av favoritlistor eller flera parallella sökningar).

- Null-värden från API:t (t.ex. nederbörd = null) kan visas som "—" i gränssnittet.

- Lokal lagring via localStorage fungerar i webbläsaren och används för att spara temperatur­enheten (°C/°F).

- Datum och språk formateras enligt svensk standard (toLocaleDateString("sv-SE")).

- Om man söker på en giltig stad så ger geokodnings-API:t alltid minst en träff, och appen använder den första med namn, land, latitud och longitud.

- Eftersom parametern language=sv skickas med kommer ortnamnen på svenska när det finns, annars visas det namn API:t skickar tillbaka.

## Avvägningar

- Jag prioriterade en enkel felhantering där felmeddelanden visas i UI eller null-värden ersätts med "—", istället för att bygga mer avancerad återhämtningslogik.

- Jag valde att alltid visa temperaturer i Celsius med möjlighet att konvertera till Fahrenheit på klientsidan, istället för att hämta båda enheterna från API:t.

- Jag prioriterade att bygga en prototyp som fungerar i moderna webbläsare, och lade därför ingen tid på att säkerställa stöd för äldre webbläsare.

- Jag valde att använda Open-Meteos fria API direkt utan att bygga en egen databas eller mellanlagring, eftersom det räckte för kodtestets syfte.

- Jag valde att inte bygga en avancerad loader/spinner-komponent, utan istället visa en enkel text med “Laddar…”.

## Tidsåtgång och vad jag skulle göra med mer tid

Caset tog mig ca 3,5-4 timmar att genomföra och med mer tid hade jag:

- Byggt upp projektet mer komponentbaserat för enklare återanvändning.

- Gjort det möjligt att starta en sökning genom att trycka på "enter"-knappen på tangentbordet.

- Fokuserat mer på användarvänlighet genom att lägga till fler labels, då det i dagsläget endast finns aria-labels.

- Gjort det möjligt att konvertera vind-enheten (km/h) till mph och nederbörds-enheten (mm) till inches vid byte till Fahrenheit.

- Lagt till auto-complete eller förslag i sökfältet med debounce för att minska risken för felstavningar och förbättra användarupplevelsen.

- Utökat API:t till att kunna visa historisk data och längre prognoser än fem dagar.
