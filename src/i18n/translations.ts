// Internationalization translations for tempotick
// Currently supports: English (en), Spanish (es), Finnish (fi)

export type Language = "en" | "es" | "fi";

export const BASE_URL = "https://www.tempotick.com";

// Define pages that have translations
export type TranslatedPage = "metronome";

// Hreflang configuration for pages with translations
export const hreflangConfig: Record<
  TranslatedPage,
  { en: string; es: string; fi: string }
> = {
  metronome: {
    en: "/online-metronome",
    es: "/es/metronomo",
    fi: "/fi/metronomi",
  },
};

// Get full URLs for hreflang tags
export const getHreflangUrls = (page: TranslatedPage) => {
  const paths = hreflangConfig[page];
  return {
    en: `${BASE_URL}${paths.en}`,
    es: `${BASE_URL}${paths.es}`,
    fi: `${BASE_URL}${paths.fi}`,
    xDefault: `${BASE_URL}${paths.en}`, // English is the default
  };
};

// Metronome page translations
export const metronomeTranslations = {
  en: {
    title: "Free Online Metronome - Ad-Free | tempotick",
    description:
      "Free online metronome with tap tempo, time signatures, and accent patterns. No ads, no distractions. Practice with perfect timing.",
    faq: [
      {
        question: "What does metronome mean?",
        answer:
          'The word "metronome" comes from the Greek words "metron" (measure) and "nomos" (law or rule). A metronome is a device that produces a steady pulse or click at a consistent tempo, measured in beats per minute (BPM). Musicians use metronomes to practice keeping steady time and to develop their internal sense of rhythm. Modern metronomes can be mechanical, electronic, or software-based like this online metronome.',
      },
      {
        question: "How fast is 120 BPM?",
        answer:
          '120 BPM (beats per minute) means there are exactly 2 beats per second, or one beat every 0.5 seconds. This is considered a moderate, comfortable tempo—roughly the speed of a brisk walk or a typical pop song. It\'s often called "Allegro moderato" in classical music terminology. Many popular songs are written around 120 BPM because it feels energetic but not rushed.',
      },
      {
        question: "How to tell if a song is in 3/4 or 6/8?",
        answer:
          'Both 3/4 and 6/8 have a similar "feel" but differ in how beats are grouped. 3/4 time has 3 beats per measure, each beat divided into 2 (think of a waltz). 6/8 time has 2 main beats per measure, each divided into 3 (think of a jig). The key difference: 3/4 feels like THREE beats, while 6/8 feels like TWO beats with a triplet swing.',
      },
      {
        question: "What are the 4 types of tempo?",
        answer:
          "Tempo is broadly categorized into four main types: Slow (Largo, Adagio) – Below 80 BPM; Moderate (Andante, Moderato) – 80-120 BPM; Fast (Allegro, Vivace) – 120-168 BPM; Very Fast (Presto, Prestissimo) – Above 168 BPM.",
      },
      {
        question: "Did Beethoven invent the metronome?",
        answer:
          "No, Beethoven did not invent the metronome. The modern metronome was invented by Johann Maelzel in 1815, though the concept was developed earlier by Dietrich Nikolaus Winkel. However, Beethoven was one of the first major composers to embrace the metronome, adding metronome markings to his compositions.",
      },
      {
        question: "When were metronomes invented?",
        answer:
          "The mechanical metronome as we know it was patented by Johann Maelzel in 1815, though Dietrich Nikolaus Winkel actually invented the double-weighted pendulum mechanism around 1814. Earlier devices for measuring musical time existed—Étienne Loulié created a simple pendulum device in 1696.",
      },
      {
        question: "What are the main types of metronome?",
        answer:
          "There are several types of metronomes available today: Mechanical metronomes – The classic wind-up pendulum style; Digital/Electronic metronomes – Battery-powered devices with precise timing; Software/App metronomes – Free or paid apps for phones and computers; Online metronomes – Browser-based tools (like this one!) that require no download.",
      },
    ],
  },
  es: {
    title: "Metrónomo Online Gratis - Sin Anuncios | tempotick",
    description:
      "Metrónomo online gratis con tap tempo, compases y patrones de acentos. Sin anuncios, sin distracciones. Practica con un tempo perfecto.",
    faq: [
      {
        question: "¿Qué significa metrónomo?",
        answer:
          'La palabra "metrónomo" proviene de las palabras griegas "metron" (medida) y "nomos" (ley o regla). Un metrónomo es un dispositivo que produce un pulso constante o clic a un tempo consistente, medido en pulsaciones por minuto (BPM). Los músicos usan metrónomos para practicar mantener un tiempo estable y desarrollar su sentido interno del ritmo. Los metrónomos modernos pueden ser mecánicos, electrónicos o basados en software como este metrónomo en línea.',
      },
      {
        question: "¿Qué tan rápido es 120 BPM?",
        answer:
          '120 BPM (pulsaciones por minuto) significa que hay exactamente 2 pulsaciones por segundo, o una pulsación cada 0.5 segundos. Este se considera un tempo moderado y cómodo—aproximadamente la velocidad de una caminata rápida o una canción pop típica. A menudo se llama "Allegro moderato" en terminología de música clásica. Muchas canciones populares están escritas alrededor de 120 BPM porque se siente enérgico pero no apresurado.',
      },
      {
        question: "¿Cómo saber si una canción está en 3/4 o 6/8?",
        answer:
          'Tanto 3/4 como 6/8 tienen una "sensación" similar pero difieren en cómo se agrupan los tiempos. El compás de 3/4 tiene 3 tiempos por compás, cada tiempo dividido en 2 (piensa en un vals). El compás de 6/8 tiene 2 tiempos principales por compás, cada uno dividido en 3 (piensa en una jiga). La diferencia clave: 3/4 se siente como TRES tiempos, mientras que 6/8 se siente como DOS tiempos con un swing de tresillo.',
      },
      {
        question: "¿Cuáles son los 4 tipos de tempo?",
        answer:
          "El tempo se categoriza ampliamente en cuatro tipos principales: Lento (Largo, Adagio) – Menos de 80 BPM; Moderado (Andante, Moderato) – 80-120 BPM; Rápido (Allegro, Vivace) – 120-168 BPM; Muy Rápido (Presto, Prestissimo) – Más de 168 BPM.",
      },
      {
        question: "¿Beethoven inventó el metrónomo?",
        answer:
          "No, Beethoven no inventó el metrónomo. El metrónomo moderno fue inventado por Johann Maelzel en 1815, aunque el concepto fue desarrollado anteriormente por Dietrich Nikolaus Winkel. Sin embargo, Beethoven fue uno de los primeros grandes compositores en adoptar el metrónomo, añadiendo marcas de metrónomo a sus composiciones.",
      },
      {
        question: "¿Cuándo se inventaron los metrónomos?",
        answer:
          "El metrónomo mecánico como lo conocemos fue patentado por Johann Maelzel en 1815, aunque Dietrich Nikolaus Winkel realmente inventó el mecanismo del péndulo de doble peso alrededor de 1814. Existían dispositivos anteriores para medir el tiempo musical—Étienne Loulié creó un dispositivo de péndulo simple en 1696.",
      },
      {
        question: "¿Cuáles son los principales tipos de metrónomo?",
        answer:
          "Hay varios tipos de metrónomos disponibles hoy en día: Metrónomos mecánicos – El clásico estilo de péndulo de cuerda; Metrónomos digitales/electrónicos – Dispositivos con batería con sincronización precisa; Metrónomos de software/aplicación – Aplicaciones gratuitas o de pago para teléfonos y computadoras; Metrónomos en línea – Herramientas basadas en navegador (¡como esta!) que no requieren descarga.",
      },
    ],
  },
  fi: {
    title: "Ilmainen Metronomi Netissä - Mainokseton | tempotick",
    description:
      "Ilmainen metronomi netissä tap tempolla, tahtilajilla ja aksenttikuvioilla. Ei mainoksia, ei häiriöitä. Harjoittele täydellisellä ajoituksella.",
    faq: [
      {
        question: "Mitä metronomi tarkoittaa?",
        answer:
          'Sana "metronomi" tulee kreikan sanoista "metron" (mitta) ja "nomos" (laki tai sääntö). Metronomi on laite, joka tuottaa tasaisen pulssin tai naksautuksen vakiotempoissa, mitattuna iskuina minuutissa (BPM). Muusikot käyttävät metronomeja harjoitellakseen tasaisen ajan pitämistä ja kehittääkseen sisäistä rytmitajuaan. Nykyaikaiset metronomit voivat olla mekaanisia, elektronisia tai ohjelmistopohjaisia, kuten tämä metronomi netissä.',
      },
      {
        question: "Kuinka nopea on 120 BPM?",
        answer:
          '120 BPM (iskua minuutissa) tarkoittaa, että iskuja on täsmälleen 2 sekunnissa eli yksi isku joka 0,5 sekunti. Tätä pidetään kohtuullisena, mukavana tempona – suunnilleen reippaan kävelyn tai tyypillisen pop-kappaleen nopeus. Klassisen musiikin terminologiassa sitä kutsutaan usein "Allegro moderatoksi". Monet suositut kappaleet on kirjoitettu noin 120 BPM:n tempoon, koska se tuntuu energiseltä mutta ei kiireiseltä.',
      },
      {
        question: "Miten erottaa onko kappale 3/4 vai 6/8 tahtilajissa?",
        answer:
          'Sekä 3/4 että 6/8 tuntuvat samankaltaisilta, mutta eroavat iskujen ryhmittelyssä. 3/4-tahtilajissa on 3 iskua tahdissa, jokainen isku jaettu kahteen (ajattele valssia). 6/8-tahtilajissa on 2 pääiskua tahdissa, kumpikin jaettu kolmeen (ajattele jiigiä). Keskeinen ero: 3/4 tuntuu KOLMELTA iskulta, kun taas 6/8 tuntuu KAHDELTA iskulta trioliswingillä.',
      },
      {
        question: "Mitkä ovat 4 tempotyyppiä?",
        answer:
          "Tempo jaetaan yleensä neljään päätyyppiin: Hidas (Largo, Adagio) – Alle 80 BPM; Kohtalainen (Andante, Moderato) – 80-120 BPM; Nopea (Allegro, Vivace) – 120-168 BPM; Erittäin nopea (Presto, Prestissimo) – Yli 168 BPM.",
      },
      {
        question: "Keksikö Beethoven metronomin?",
        answer:
          "Ei, Beethoven ei keksinyt metronomia. Modernin metronomin keksi Johann Maelzel vuonna 1815, vaikka konseptin kehitti aiemmin Dietrich Nikolaus Winkel. Beethoven oli kuitenkin yksi ensimmäisistä suurista säveltäjistä, joka omaksui metronomin ja lisäsi metronomimerkinnät sävellyksiinsä.",
      },
      {
        question: "Milloin metronomit keksittiin?",
        answer:
          "Mekaaninen metronomi sellaisena kuin sen tunnemme patentoitiin Johann Maelzelin toimesta vuonna 1815, vaikka Dietrich Nikolaus Winkel itse asiassa keksi kaksoispainoisen heilurimekanismin noin vuonna 1814. Aiempia laitteita musiikin ajan mittaamiseen oli olemassa – Étienne Loulié loi yksinkertaisen heilurilaitteen vuonna 1696.",
      },
      {
        question: "Mitkä ovat metronomien päätyypit?",
        answer:
          "Nykyään on saatavilla useita metronomityyppejä: Mekaaniset metronomit – Klassinen vedettävä heilurityyli; Digitaaliset/elektroniset metronomit – Paristokäyttöiset laitteet tarkalla ajoituksella; Ohjelmisto-/sovellus-metronomit – Ilmaisia tai maksullisia sovelluksia puhelimille ja tietokoneille; Metronomit netissä – Selainpohjaiset työkalut (kuten tämä!), jotka eivät vaadi latausta.",
      },
    ],
  },
};

// UI translations for metronome controls
export const uiTranslations = {
  en: {
    // BPM Slider
    bpm: "BPM",
    every: "every",
    // Play Button
    start: "Start",
    stop: "Stop",
    // Tap Tempo
    tapTempo: "Tap Tempo",
    pressToTap: "Press 'T' or click to tap",
    tap: "tap",
    taps: "taps",
    pressT: "Press 'T' to tap",
    // Mute Bar Toggle
    play: "Play",
    bar: "bar",
    bars: "bars",
    mute: "Mute",
    mutedBar: "Muted bar",
    playingBar: "Playing bar",
    // Volume
    volume: "Volume",
    // FAQ
    faqTitle: "Frequently Asked Questions",
  },
  es: {
    // BPM Slider
    bpm: "BPM",
    every: "cada",
    // Play Button
    start: "Iniciar",
    stop: "Detener",
    // Tap Tempo
    tapTempo: "Tap Tempo",
    pressToTap: "Presiona 'T' o haz clic",
    tap: "toque",
    taps: "toques",
    pressT: "Presiona 'T'",
    // Mute Bar Toggle
    play: "Tocar",
    bar: "compás",
    bars: "compases",
    mute: "Silenciar",
    mutedBar: "Compás silenciado",
    playingBar: "Tocando",
    // Volume
    volume: "Volumen",
    // FAQ
    faqTitle: "Preguntas Frecuentes",
  },
  fi: {
    // BPM Slider
    bpm: "BPM",
    every: "joka",
    // Play Button
    start: "Käynnistä",
    stop: "Pysäytä",
    // Tap Tempo
    tapTempo: "Napauta Tempo",
    pressToTap: "Paina 'T' tai klikkaa",
    tap: "napautus",
    taps: "napautusta",
    pressT: "Paina 'T'",
    // Mute Bar Toggle
    play: "Soita",
    bar: "tahti",
    bars: "tahtia",
    mute: "Mykistä",
    mutedBar: "Mykistetty tahti",
    playingBar: "Soittaa",
    // Volume
    volume: "Äänenvoimakkuus",
    // FAQ
    faqTitle: "Usein Kysytyt Kysymykset",
  },
};

export type UITranslations = typeof uiTranslations.en;
