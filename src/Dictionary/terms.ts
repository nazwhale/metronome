export interface DictionaryTerm {
  term: string;
  slug: string;
  shortDefinition: string;
  fullDefinition: string;
  tags?: string[];
  relatedTerms?: string[];
  examples?: string[];
  /** Optional external links (e.g. Wikipedia) shown at the end of the definition. */
  externalLinks?: { label: string; url: string }[];
}

export const dictionaryTerms: DictionaryTerm[] = [
  {
    term: "A cappella",
    slug: "a-cappella",
    shortDefinition: "Vocal music performed without instrumental accompaniment.",
    fullDefinition:
      "A cappella (Italian for 'in the manner of the chapel') refers to music performed by singers without instrumental accompaniment. The term originated from church music traditions where voices sang without organ support. Today, a cappella encompasses many genres, from barbershop quartets to contemporary vocal groups that use voices to imitate instruments.",
    tags: ["Vocal", "Performance"],
    relatedTerms: ["Soprano", "Alto", "Tenor", "Bass"],
    examples: [
      "Pentatonix performs contemporary a cappella arrangements",
      "Traditional barbershop quartets sing a cappella",
      "Many Renaissance motets were written for a cappella performance",
    ],
  },
  {
    term: "Accent",
    slug: "accent",
    shortDefinition: "Emphasis placed on a particular note or beat.",
    fullDefinition:
      "An accent is a stress or special emphasis placed on a particular note, chord, or beat. Accents help create rhythmic interest and can be indicated in sheet music with symbols like > (accent mark), ^ (marcato), or sfz (sforzando). Understanding accents is crucial for musical expression and proper interpretation of written music.",
    tags: ["Rhythm", "Notation", "Dynamics"],
    relatedTerms: ["Dynamics", "Beat"],
    examples: [
      "The drummer accents beats 2 and 4 in swing jazz",
      "Classical guitarists use nail attacks to accent melody notes",
    ],
  },
  {
    term: "Adagio",
    slug: "adagio",
    shortDefinition: "A slow tempo, typically 66-76 BPM.",
    fullDefinition:
      "Adagio is a tempo marking indicating a slow, leisurely pace. The term comes from the Italian 'ad agio,' meaning 'at ease.' In classical music, adagio movements are often the slow, expressive heart of a larger work, allowing for emotional depth and lyrical melodies. The typical tempo range is 66-76 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Largo", "Andante", "Moderato", "Allegro", "Bpm"],
    examples: [
      "Samuel Barber's 'Adagio for Strings' is a famous example",
      "Many second movements of symphonies are marked adagio",
    ],
  },
  {
    term: "Allegretto",
    slug: "allegretto",
    shortDefinition: "A moderately fast tempo, typically 98-109 BPM.",
    fullDefinition:
      "Allegretto is a tempo marking indicating a moderately fast pace, slower than allegro but faster than andante. The term is a diminutive of 'allegro,' suggesting a lighter, more relaxed version of that tempo. Allegretto movements often have a graceful, dance-like quality. The typical tempo range is 98-109 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Allegro", "Andante", "Moderato", "Vivace", "Bpm"],
    examples: [
      "Beethoven's Symphony No. 7 features a famous Allegretto movement",
      "Many scherzos are marked allegretto",
    ],
  },
  {
    term: "Allegro",
    slug: "allegro",
    shortDefinition: "A fast, lively tempo, typically 120-156 BPM.",
    fullDefinition:
      "Allegro (Italian for 'cheerful' or 'lively') is one of the most common tempo markings, indicating a fast, bright pace. It is frequently used for opening and closing movements of symphonies, sonatas, and concertos. Allegro suggests not just speed but also a spirited character. The typical tempo range is 120-156 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Allegretto", "Vivace", "Presto", "Moderato", "Bpm"],
    examples: [
      "Most symphony first movements are marked Allegro",
      "Mozart's 'Eine kleine Nachtmusik' opens with Allegro",
    ],
  },
  {
    term: "Andante",
    slug: "andante",
    shortDefinition: "A walking tempo, typically 76-108 BPM.",
    fullDefinition:
      "Andante (from Italian 'andare,' meaning 'to walk') indicates a moderate, walking pace. It suggests music that flows steadily and unhurriedly, like a comfortable stroll. Andante is often used for lyrical, song-like movements that balance between slow expressiveness and forward momentum. The typical tempo range is 76-108 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Adagio", "Moderato", "Allegretto", "Largo", "Bpm"],
    examples: [
      "Many classical second movements are marked Andante",
      "Andante cantabile means 'at a walking pace, in a singing style'",
    ],
  },
  {
    term: "Alto",
    slug: "alto",
    shortDefinition: "The second-highest vocal range, typically sung by women or boys.",
    fullDefinition:
      "Alto refers to the second-highest vocal range in choral music, positioned between soprano and tenor. The typical alto range spans from F3 to F5. In mixed choirs, alto parts are usually sung by women with lower voices. The term also applies to instruments in the alto range, such as the alto saxophone or viola (sometimes called the alto of the string family).",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Soprano", "Mezzo-soprano", "Tenor", "Bass"],
    examples: [
      "The alto section carries the harmony in many hymns",
      "The alto saxophone has a warm, mellow tone",
    ],
  },
  {
    term: "Arpeggio",
    slug: "arpeggio",
    shortDefinition: "The notes of a chord played in succession rather than simultaneously.",
    fullDefinition:
      "An arpeggio (from Italian 'arpeggiare,' meaning 'to play on a harp') is a technique where the notes of a chord are played one after another in sequence, rather than simultaneously. Arpeggios are fundamental to many styles of music, from classical guitar fingerpicking to piano accompaniment patterns. They create a flowing, harp-like effect and are essential for developing instrumental technique.",
    tags: ["Harmony", "Technique"],
    relatedTerms: ["Chord"],
    examples: [
      "The opening of Beethoven's 'Moonlight Sonata' features arpeggios",
      "Guitarists practice arpeggios to improve finger independence",
    ],
  },
  {
    term: "Bar",
    slug: "bar",
    shortDefinition: "A segment of music containing a set number of beats; also called a measure.",
    fullDefinition:
      "A bar (also called a measure) is a segment of time in music defined by a given number of beats, as indicated by the time signature. Bars are separated by vertical bar lines in written music. For example, in 4/4 time, each bar contains four quarter-note beats. Bars help organize music into manageable units and provide a framework for rhythm and structure.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Beat", "Measure", "Time signature"],
    examples: [
      "A 12-bar blues follows a specific chord progression",
      "The piece is 32 bars long",
    ],
  },
  {
    term: "Baritone",
    slug: "baritone",
    shortDefinition: "A male voice range between tenor and bass.",
    fullDefinition:
      "Baritone is a male voice type that lies between the higher tenor and lower bass ranges. The typical baritone range spans from A2 to A4. Baritones have a rich, warm quality and are the most common male voice type. In opera, baritone roles often portray villains, father figures, or comic characters. Many popular music singers, from Frank Sinatra to Elvis Presley, were baritones.",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Tenor", "Bass", "Alto", "Soprano"],
    examples: [
      "Frank Sinatra was a famous baritone singer",
      "The role of Figaro in 'The Barber of Seville' is written for baritone",
    ],
  },
  {
    term: "Bass",
    slug: "bass",
    shortDefinition: "The lowest vocal range, typically sung by men.",
    fullDefinition:
      "Bass is the lowest vocal range in choral music, typically spanning from E2 to E4. Bass singers provide the harmonic foundation in choral and ensemble music. The term also refers to low-pitched instruments like the double bass, bass guitar, and bass drum. In music theory, the bass line refers to the lowest part of the harmony.",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Baritone", "Tenor", "Alto", "Soprano"],
    examples: [
      "Barry White was known for his deep bass voice",
      "The bass section anchors the choir's sound",
    ],
  },
  {
    term: "Beat",
    slug: "beat",
    shortDefinition: "The basic unit of time in music; the pulse.",
    fullDefinition:
      "The beat is the basic unit of time in music, representing the steady pulse that underlies rhythmic patterns. Musicians often tap their feet or nod their heads to the beat. In notation, the beat is typically represented by a specific note value determined by the time signature. The number of beats per minute (BPM) determines the tempo of a piece.",
    tags: ["Rhythm", "Tempo"],
    relatedTerms: ["Bpm", "Bar", "Accent"],
    examples: [
      "The drummer keeps the beat steady throughout the song",
      "Dance music typically has a strong, emphasized beat",
    ],
  },
  {
    term: "Bpm",
    slug: "bpm",
    shortDefinition: "Beats per minute; a measure of tempo.",
    fullDefinition:
      "BPM (beats per minute) is the standard measurement for tempo in music. It indicates how many beats occur in one minute of time. A higher BPM means faster music, while a lower BPM indicates slower music. For reference, a resting heart rate (60-80 BPM) is similar to common ballad tempos, while dance music often ranges from 120-140 BPM.",
    tags: ["Tempo", "Rhythm"],
    relatedTerms: ["Beat", "Largo", "Adagio", "Andante", "Moderato", "Allegro", "Presto"],
    examples: [
      "Most pop songs are around 100-130 BPM",
      "Set the metronome to 60 BPM for practice",
    ],
  },
  {
    term: "Cadence",
    slug: "cadence",
    shortDefinition: "A sequence of chords that brings a phrase or piece to a close.",
    fullDefinition:
      "A cadence is a harmonic progression that creates a sense of resolution or pause in music, typically occurring at the end of a phrase, section, or piece. Common types include the perfect cadence (V-I), which sounds final and resolved; the plagal cadence (IV-I), often heard as 'Amen'; the imperfect cadence (ending on V), which sounds incomplete; and the deceptive cadence, which surprises the listener with an unexpected resolution.",
    tags: ["Harmony", "Theory"],
    relatedTerms: ["Chord"],
    examples: [
      "The piece ends with a perfect cadence in C major",
      "Gospel music often uses plagal cadences",
    ],
  },
  {
    term: "Canon",
    slug: "canon",
    shortDefinition: "A compositional technique where a melody is imitated by one or more voices.",
    fullDefinition:
      "A canon is a contrapuntal compositional technique where a melody introduced by one voice is imitated strictly by one or more other voices, entering at staggered intervals. The imitating voices may enter at the same pitch (canon at the unison) or at different intervals. 'Row, Row, Row Your Boat' is a simple example of a canon, also known as a round. More complex canons include inversions, retrogrades, and augmentations of the original melody.",
    tags: ["Form", "Theory"],
    relatedTerms: ["Fugue", "Counterpoint"],
    examples: [
      "Pachelbel's Canon in D is one of the most famous examples",
      "'Frère Jacques' is a well-known round (simple canon)",
    ],
  },
  {
    term: "Chord",
    slug: "chord",
    shortDefinition: "Three or more notes sounded together.",
    fullDefinition:
      "A chord is a group of three or more notes played simultaneously, forming the basis of harmony in Western music. The most basic chord is a triad, consisting of a root, third, and fifth. Chords are classified by their quality (major, minor, diminished, augmented) and can be extended with additional notes (7ths, 9ths, etc.). Understanding chords is fundamental to composition, arrangement, and improvisation.",
    tags: ["Harmony", "Theory"],
    relatedTerms: ["Arpeggio", "Cadence", "Triad"],
    examples: [
      "A C major chord contains the notes C, E, and G",
      "Jazz musicians often use extended chords with 9ths and 13ths",
    ],
  },
  {
    term: "Contralto",
    slug: "contralto",
    shortDefinition: "The lowest female voice type, rare and rich in tone.",
    fullDefinition:
      "Contralto is the lowest female voice type, with a range typically spanning from E3 to E5. True contraltos are rare and possess a distinctively rich, dark timbre. The term is often used interchangeably with 'alto' in choral music, though technically contralto refers to a specific voice type while alto refers to a vocal part. Famous contraltos include Marian Anderson and Kathleen Ferrier.",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Alto", "Mezzo-soprano", "Soprano", "Tenor"],
    examples: [
      "Marian Anderson was one of the most celebrated contraltos",
      "The contralto voice has an unusually dark, rich quality",
    ],
  },
  {
    term: "Concerto",
    slug: "concerto",
    shortDefinition: "A composition featuring a solo instrument accompanied by an orchestra.",
    fullDefinition:
      "A concerto is a musical composition, typically in three movements, that showcases a solo instrument (or small group of instruments) against an orchestral accompaniment. The form developed during the Baroque period with composers like Vivaldi and Bach, and reached its height in the Classical and Romantic eras with Mozart, Beethoven, and Brahms. Concertos often feature virtuosic passages called cadenzas where the soloist plays alone.",
    tags: ["Form"],
    relatedTerms: ["Symphony", "Sonata", "Cadence"],
    examples: [
      "Beethoven's Piano Concerto No. 5 'Emperor' is a beloved example",
      "Vivaldi wrote over 500 concertos, including 'The Four Seasons'",
    ],
  },
  {
    term: "Counterpoint",
    slug: "counterpoint",
    shortDefinition: "The art of combining independent melodic lines.",
    fullDefinition:
      "Counterpoint is the technique of combining two or more independent melodic lines that sound simultaneously. Each line maintains its own rhythm and contour while harmonizing with the others. Counterpoint was highly developed during the Renaissance and Baroque periods, with J.S. Bach considered its greatest master. The study of counterpoint remains fundamental to music composition education.",
    tags: ["Theory", "Technique"],
    relatedTerms: ["Fugue", "Canon", "Harmony"],
    examples: [
      "Bach's 'Art of Fugue' demonstrates masterful counterpoint",
      "Renaissance motets feature intricate contrapuntal writing",
    ],
  },
  {
    term: "Crescendo",
    slug: "crescendo",
    shortDefinition: "A gradual increase in volume.",
    fullDefinition:
      "Crescendo (Italian for 'growing') is a dynamic marking indicating a gradual increase in loudness. It is represented in notation by an elongated hairpin opening to the right (<) or by the abbreviation 'cresc.' Crescendos are essential for creating musical tension, drama, and emotional impact. The opposite of crescendo is diminuendo or decrescendo.",
    tags: ["Dynamics", "Notation"],
    relatedTerms: ["Dynamics"],
    examples: [
      "Ravel's 'Bolero' features one long crescendo throughout the piece",
      "The orchestra builds to a crescendo before the final chord",
    ],
  },
  {
    term: "Dynamics",
    slug: "dynamics",
    shortDefinition: "The variation in loudness in music.",
    fullDefinition:
      "Dynamics refers to the varying levels of loudness in music and the way musicians express these variations. Common dynamic markings include pianissimo (pp, very soft), piano (p, soft), mezzo-piano (mp, moderately soft), mezzo-forte (mf, moderately loud), forte (f, loud), and fortissimo (ff, very loud). Dynamics add expression and emotional depth to musical performance.",
    tags: ["Dynamics", "Notation", "Performance"],
    relatedTerms: ["Crescendo", "Accent"],
    examples: [
      "The piece begins pianissimo and ends fortissimo",
      "Good dynamics make a performance more expressive",
    ],
  },
  {
    term: "Downbeat",
    slug: "downbeat",
    shortDefinition: "The first beat of a bar; the strongest pulse in the measure.",
    fullDefinition:
      "The downbeat is the first beat of a bar or measure—the moment when a conductor's hand moves downward. It carries the strongest accent in most time signatures and is the natural point of resolution in a rhythmic cycle. Musicians often count \"one\" on the downbeat. In 4/4 time, the downbeat is beat 1; the other beats (2, 3, 4) are upbeats relative to the next downbeat. Feeling the downbeat clearly is essential for staying in time and playing with others.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Beat", "Upbeat", "Bar", "Accent"],
    examples: [
      "The bass drum hits on the downbeat in most rock and pop songs",
      "Dancers often step on the downbeat to feel the start of each bar",
    ],
  },
  {
    term: "Eighth note",
    slug: "eighth-note",
    shortDefinition: "A note lasting half a beat in common time; two per quarter note.",
    fullDefinition:
      "An eighth note (or quaver) is a note value that lasts half the duration of a quarter note. In 4/4 time, two eighth notes fit into one beat. They are written with a filled-in oval, a stem, and a single flag (or a beam connecting multiple eighths). Eighth notes are the building blocks of many rhythmic patterns, from simple \"and\" subdivisions to fast runs. Counting \"1-and-2-and\" helps place eighth notes evenly within the beat.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Beat", "Quarter note", "Note value", "Subdivision"],
    examples: [
      "Eighth-note grooves drive much of funk and R&B",
      "Practice scales in eighth notes at 60 BPM to build even timing",
    ],
  },
  {
    term: "Etude",
    slug: "etude",
    shortDefinition: "A study piece designed to develop a specific technical skill.",
    fullDefinition:
      "An etude (French for 'study') is a short musical composition designed to develop and showcase a particular technical skill. While originally intended as practice exercises, many etudes—particularly those by Chopin, Liszt, and Debussy—transcend their pedagogical purpose to become concert pieces of great artistic merit. Etudes typically focus on challenges like rapid scales, arpeggios, octaves, or complex rhythms.",
    tags: ["Form"],
    relatedTerms: ["Prelude", "Nocturne"],
    examples: [
      "Chopin's 'Revolutionary Etude' develops left-hand technique",
      "Liszt's Transcendental Etudes are among the most difficult piano works",
    ],
  },
  {
    term: "Fugue",
    slug: "fugue",
    shortDefinition: "A contrapuntal composition built on a theme developed through imitative voices.",
    fullDefinition:
      "A fugue is a contrapuntal composition in which a short melody (the subject) is introduced by one voice and successively taken up by others, developed through various keys and techniques. Fugues typically begin with an exposition where each voice enters with the subject, followed by episodes and further entries. J.S. Bach's 'Well-Tempered Clavier' contains 48 preludes and fugues and represents the pinnacle of fugal writing.",
    tags: ["Form", "Theory"],
    relatedTerms: ["Canon", "Counterpoint", "Prelude"],
    examples: [
      "Bach's 'Toccata and Fugue in D minor' is widely recognized",
      "The finale of Mozart's 'Jupiter Symphony' incorporates fugal techniques",
    ],
  },
  {
    term: "Inversion",
    slug: "inversion",
    shortDefinition: "A chord or interval with a note other than the root in the bass.",
    fullDefinition:
      "An inversion is a chord (or triad) played with a note other than the root in the bass. In root position the root is the lowest note; in first inversion the third is in the bass; in second inversion the fifth is in the bass.\n\n" +
      "The same three notes are present—only the order changes—so the harmonic quality stays the same but the voicing and colour shift. Inversions are used for smoother voice leading, clearer bass lines, and variety when comping or arranging.\n\n" +
      "On guitar, learning triad inversions on a single string set (e.g. G–B–e) helps you see the same chord in different shapes across the neck.",
    tags: ["Harmony", "Theory"],
    relatedTerms: ["Chord", "Triad", "Arpeggio"],
    examples: [
      "A C major triad in first inversion has E in the bass (E–G–C)",
      "Second inversion often appears in cadences (e.g. I6/4–V–I)",
    ],
    externalLinks: [
      { label: "Inversion (music) on Wikipedia", url: "https://en.wikipedia.org/wiki/Inversion_(music)" },
    ],
  },
  {
    term: "Grave",
    slug: "grave",
    shortDefinition: "A very slow, solemn tempo, typically 20-40 BPM.",
    fullDefinition:
      "Grave (Italian for 'heavy' or 'serious') is one of the slowest tempo markings, indicating a very slow, solemn pace with a weighty, serious character. It is often used for funeral marches, dramatic introductions, or passages requiring great gravity and dignity. The typical tempo range is 20-40 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Largo", "Lento", "Adagio", "Andante", "Bpm"],
    examples: [
      "Chopin's Piano Sonata No. 2 includes the famous Marche funèbre marked Grave",
      "Many Baroque slow introductions are marked Grave",
    ],
  },
  {
    term: "Largo",
    slug: "largo",
    shortDefinition: "A very slow, broad tempo, typically 40-60 BPM.",
    fullDefinition:
      "Largo (Italian for 'broad' or 'wide') indicates a very slow tempo with a stately, dignified character. It suggests music that is expansive and unhurried, with space for each note to resonate. Largo is slightly faster than Grave but slower than Adagio. The typical tempo range is 40-60 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Grave", "Lento", "Adagio", "Andante", "Bpm"],
    examples: [
      "Handel's 'Largo' from Xerxes is one of the most famous examples",
      "Dvořák's 'New World Symphony' features a beautiful Largo movement",
    ],
  },
  {
    term: "Lento",
    slug: "lento",
    shortDefinition: "A slow tempo, typically 45-60 BPM.",
    fullDefinition:
      "Lento (Italian for 'slow') indicates a slow tempo, similar to Largo but sometimes interpreted as slightly more flowing. It conveys a sense of unhurried movement without the extreme solemnity of Grave. Lento is often used for reflective, contemplative passages. The typical tempo range is 45-60 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Largo", "Grave", "Adagio", "Andante", "Bpm"],
    examples: [
      "Chopin's Nocturnes often include Lento passages",
      "Barber marked his famous Adagio for Strings as 'Molto adagio (Lento)'",
    ],
  },
  {
    term: "Measure",
    slug: "measure",
    shortDefinition: "A segment of music containing a set number of beats; also called a bar.",
    fullDefinition:
      "A measure (also called a bar) is one unit of musical time as defined by the time signature. It contains a fixed number of beats—for example, four quarter-note beats in 4/4, or three in 3/4. Vertical bar lines separate measures in notation and help musicians read and count. The term \"measure\" is common in American English, while \"bar\" is used in British English and in casual speech. Both mean the same thing.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Bar", "Beat", "Time signature"],
    examples: [
      "The chorus is eight measures long",
      "In 3/4 time, each measure has three beats",
    ],
  },
  {
    term: "Meter",
    slug: "meter",
    shortDefinition: "The recurring pattern of strong and weak beats that organizes music in time.",
    fullDefinition:
      "Meter (or metre) is the underlying structure that organizes beats into recurring groups. It is indicated by the time signature and felt as a pattern of strong and weak beats—for example, strong-weak-weak-weak in 4/4, or strong-weak-weak in 3/4. Meter can be simple (each beat divides in two, as in 2/4 or 3/4) or compound (each beat divides in three, as in 6/8). Understanding meter helps you count, read rhythm, and stay in time.",
    tags: ["Rhythm", "Theory"],
    relatedTerms: ["Time signature", "Beat", "Bar"],
    examples: [
      "A waltz is in triple meter (three beats per measure)",
      "Most pop songs are in duple or quadruple meter",
    ],
  },
  {
    term: "Metronome",
    slug: "metronome",
    shortDefinition: "A device that produces a steady pulse at a set tempo to help musicians practice timing.",
    fullDefinition:
      "A metronome is a tool that produces a regular click, beep, or flash at a chosen tempo, measured in beats per minute (BPM). It helps musicians develop a steady sense of time, practice difficult passages at slow speeds, and gradually increase speed. The mechanical metronome was patented by Johann Maelzel in 1815; today metronomes are also digital, in apps, or built into software. Practicing with a metronome improves rhythm, consistency, and the ability to play with other musicians.",
    tags: ["Tempo", "Performance"],
    relatedTerms: ["Bpm", "Beat", "Tempo", "Tap tempo"],
    examples: [
      "Set the metronome to 60 BPM when learning a new piece slowly",
      "Many online metronomes offer tap tempo to match an existing beat",
    ],
  },
  {
    term: "Mezzo-soprano",
    slug: "mezzo-soprano",
    shortDefinition: "A female voice range between soprano and alto.",
    fullDefinition:
      "Mezzo-soprano (Italian for 'half-soprano') is a female voice type that lies between the higher soprano and lower contralto ranges. The typical range spans from A3 to A5. Mezzo-sopranos have a warm, full tone and are often cast in opera as mothers, witches, seductresses, or trouser roles (women playing male characters). Many popular music singers are mezzo-sopranos.",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Soprano", "Alto", "Contralto", "Tenor"],
    examples: [
      "Adele is a contemporary mezzo-soprano",
      "Carmen is one of opera's most famous mezzo-soprano roles",
    ],
  },
  {
    term: "Minuet",
    slug: "minuet",
    shortDefinition: "A stately dance in triple meter, common in Baroque and Classical music.",
    fullDefinition:
      "A minuet (or menuet) is a social dance of French origin in moderate triple meter (3/4 time). It became a standard movement in Baroque suites and Classical symphonies, typically as the third movement. The minuet is usually paired with a contrasting trio section, after which the minuet returns (minuet-trio-minuet structure). Beethoven later transformed the minuet into the faster, more vigorous scherzo.",
    tags: ["Form", "Rhythm"],
    relatedTerms: ["Scherzo", "Suite", "Symphony"],
    examples: [
      "Mozart's Symphony No. 40 includes a minuet movement",
      "Bach's orchestral suites contain elegant minuets",
    ],
  },
  {
    term: "Moderato",
    slug: "moderato",
    shortDefinition: "A moderate tempo, typically 108-120 BPM.",
    fullDefinition:
      "Moderato (Italian for 'moderate') indicates a medium tempo, neither fast nor slow. It sits comfortably between Andante and Allegro, providing a balanced, comfortable pace. Moderato is often combined with other terms, such as 'Allegro moderato' (moderately fast) or 'Andante moderato' (a slightly brisker walking pace). The typical tempo range is 108-120 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Andante", "Allegretto", "Allegro", "Adagio", "Bpm"],
    examples: [
      "A piece marked 'Moderato' should feel comfortable and unhurried",
      "Beethoven often used 'Allegro moderato' for balanced first movements",
    ],
  },
  {
    term: "Nocturne",
    slug: "nocturne",
    shortDefinition: "A dreamy, romantic composition inspired by the night.",
    fullDefinition:
      "A nocturne is a musical composition inspired by or evocative of the night, characterized by a dreamy, contemplative mood. The form was developed for piano by Irish composer John Field and brought to its highest expression by Frédéric Chopin, who composed 21 nocturnes. Nocturnes typically feature a lyrical, singing melody over a flowing accompaniment pattern.",
    tags: ["Form"],
    relatedTerms: ["Prelude", "Etude", "Sonata"],
    examples: [
      "Chopin's Nocturne in E-flat major, Op. 9 No. 2 is one of the most beloved",
      "Debussy's 'Nocturnes' for orchestra paint impressionistic night scenes",
    ],
  },
  {
    term: "Note value",
    slug: "note-value",
    shortDefinition: "The duration of a note—how long it is held—in relation to the beat.",
    fullDefinition:
      "Note values are the building blocks of rhythm. They define how long each note lasts. Common values include the whole note (four beats in 4/4), half note (two beats), quarter note (one beat), eighth note (half a beat), and sixteenth note (quarter of a beat). Each value can be doubled or halved: two eighth notes equal one quarter note. Rests use the same durations but indicate silence. Time signatures specify which note value gets the beat.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Beat", "Quarter note", "Eighth note", "Rest", "Time signature"],
    examples: [
      "In 4/4 time, a quarter note gets one beat",
      "A dotted half note lasts three beats in common time",
    ],
  },
  {
    term: "Opera",
    slug: "opera",
    shortDefinition: "A dramatic work combining music, singing, and theatrical elements.",
    fullDefinition:
      "Opera is a form of theatre in which music is the primary artistic element, combining vocal and orchestral music with drama, acting, scenery, and costumes. Originating in Italy around 1600, opera encompasses recitatives (speech-like singing), arias (expressive solo songs), choruses, and orchestral passages. Major operatic traditions include Italian (Verdi, Puccini), German (Wagner, Strauss), and French (Bizet, Debussy).",
    tags: ["Form", "Vocal"],
    relatedTerms: ["Soprano", "Tenor", "Baritone", "Bass", "A cappella"],
    examples: [
      "Mozart's 'The Marriage of Figaro' is a masterpiece of comic opera",
      "Wagner's 'Ring Cycle' spans four evenings of music drama",
    ],
  },
  {
    term: "Presto",
    slug: "presto",
    shortDefinition: "A very fast tempo, typically 168-200 BPM.",
    fullDefinition:
      "Presto (Italian for 'quickly' or 'ready') indicates a very fast tempo, faster than Allegro and Vivace. It demands technical virtuosity and creates excitement and energy. Presto movements often appear as finales or in pieces designed to showcase a performer's skill. The typical tempo range is 168-200 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Prestissimo", "Vivace", "Allegro", "Allegretto", "Bpm"],
    examples: [
      "The final movement of Beethoven's 'Moonlight Sonata' is marked Presto agitato",
      "Rimsky-Korsakov's 'Flight of the Bumblebee' is often played at Presto",
    ],
  },
  {
    term: "Prestissimo",
    slug: "prestissimo",
    shortDefinition: "The fastest tempo marking, typically 200+ BPM.",
    fullDefinition:
      "Prestissimo is the superlative form of Presto, indicating the fastest possible tempo. It represents the extreme upper limit of speed and is reserved for passages requiring extraordinary virtuosity. Prestissimo creates an effect of breathless excitement and technical brilliance. The typical tempo is 200 beats per minute or faster.",
    tags: ["Tempo"],
    relatedTerms: ["Presto", "Vivace", "Allegro", "Bpm"],
    examples: [
      "Some virtuoso piano pieces reach Prestissimo in their climactic passages",
      "Prestissimo sections test the limits of a performer's technique",
    ],
  },
  {
    term: "Prelude",
    slug: "prelude",
    shortDefinition: "An introductory piece, often free in form.",
    fullDefinition:
      "A prelude is a short piece of music, often serving as an introduction to a larger work or standing alone as an independent composition. In the Baroque era, preludes typically preceded fugues (as in Bach's 'Well-Tempered Clavier'). Later composers like Chopin and Debussy wrote collections of independent preludes exploring various moods and techniques. Preludes often have an improvisatory character.",
    tags: ["Form"],
    relatedTerms: ["Fugue", "Etude", "Nocturne"],
    examples: [
      "Bach paired each of his 48 preludes with a fugue",
      "Chopin's 24 Preludes explore every major and minor key",
    ],
  },
  {
    term: "Quarter note",
    slug: "quarter-note",
    shortDefinition: "A note lasting one beat in 4/4 time; the most common unit of the beat.",
    fullDefinition:
      "A quarter note (or crotchet) is a note value that typically receives one beat in 4/4 time—the time signature used in most popular and classical music. It is written as a filled-in oval with a stem. Four quarter notes fill one bar in 4/4. The quarter note is the default \"one beat\" reference: tempo is often described in quarter notes per minute (e.g. \"quarter = 120\" means 120 quarter notes per minute). Subdividing the quarter into two eighth notes or four sixteenth notes is the basis of most rhythmic practice.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Beat", "Eighth note", "Note value", "Bpm"],
    examples: [
      "In 4/4, each bar has four quarter-note beats",
      "Set your metronome to quarter-note clicks when learning a piece",
    ],
  },
  {
    term: "Rondo",
    slug: "rondo",
    shortDefinition: "A musical form with a recurring main theme alternating with contrasting sections.",
    fullDefinition:
      "A rondo is a musical form characterized by the return of a principal theme (the refrain) alternating with contrasting sections (episodes). The typical structure is ABACA or ABACABA, where A represents the recurring refrain. Rondos are often lively and spirited, commonly used as final movements of sonatas, concertos, and symphonies. The form creates a satisfying sense of return and resolution.",
    tags: ["Form", "Theory"],
    relatedTerms: ["Sonata", "Symphony", "Concerto"],
    examples: [
      "Beethoven's 'Für Elise' is a rondo (ABACA form)",
      "Mozart frequently used rondo form for concerto final movements",
    ],
  },
  {
    term: "Rest",
    slug: "rest",
    shortDefinition: "A symbol indicating silence for a specific duration.",
    fullDefinition:
      "A rest is a notation symbol that indicates silence for a given length of time. Rests use the same duration system as notes: whole rest, half rest, quarter rest, eighth rest, and so on. A quarter rest in 4/4 time means one beat of silence. Rests are essential for rhythm—they create space, phrasing, and emphasis. Counting rests accurately is as important as counting notes when reading and performing music.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Note value", "Beat", "Bar"],
    examples: [
      "The rest on beat 1 creates a dramatic pause before the entrance",
      "Eighth-note rests add punch to syncopated rhythms",
    ],
  },
  {
    term: "Rhythm",
    slug: "rhythm",
    shortDefinition: "The pattern of sounds and silences in time; how notes and rests are arranged.",
    fullDefinition:
      "Rhythm is the way music is organized in time—the pattern of note lengths, accents, and silences over a steady pulse. It is distinct from tempo (speed) and meter (grouping of beats): rhythm is the specific sequence of short and long sounds. Good rhythm means playing notes at the right time relative to the beat. Musicians develop rhythm through counting, subdividing, and practicing with a metronome. Rhythm is one of the core elements of music, alongside melody and harmony.",
    tags: ["Rhythm", "Theory"],
    relatedTerms: ["Beat", "Tempo", "Meter", "Syncopation", "Subdivision"],
    examples: [
      "The rhythm of the bass line drives the song forward",
      "Clapping the rhythm before playing helps internalize difficult passages",
    ],
  },
  {
    term: "Scherzo",
    slug: "scherzo",
    shortDefinition: "A lively, often playful movement, typically in triple meter.",
    fullDefinition:
      "A scherzo (Italian for 'joke') is a vigorous, light, or playful musical movement, usually in quick triple meter (3/4). Beethoven established the scherzo as a replacement for the minuet in symphonies and sonatas, making it faster and more dynamic. Scherzos typically follow a scherzo-trio-scherzo structure. Chopin also wrote four independent scherzos that are dramatic and virtuosic rather than playful.",
    tags: ["Form", "Rhythm"],
    relatedTerms: ["Minuet", "Symphony", "Sonata"],
    examples: [
      "Beethoven's symphonies feature powerful scherzo movements",
      "Chopin's Scherzo No. 2 in B-flat minor is intensely dramatic",
    ],
  },
  {
    term: "Sonata",
    slug: "sonata",
    shortDefinition: "A multi-movement composition for one or two instruments.",
    fullDefinition:
      "A sonata is a composition for one or two instruments, typically in three or four movements with contrasting tempos and characters. The Classical sonata usually includes a fast opening movement in sonata form, a slow lyrical movement, and a lively finale (often a rondo). Sonata form itself—with its exposition, development, and recapitulation—became the most important structural principle in Classical music.",
    tags: ["Form"],
    relatedTerms: ["Symphony", "Concerto", "Rondo", "Scherzo"],
    examples: [
      "Beethoven's 32 piano sonatas are central to the repertoire",
      "Mozart's violin sonatas feature equal partnership between instruments",
    ],
  },
  {
    term: "Soprano",
    slug: "soprano",
    shortDefinition: "The highest vocal range, typically sung by women or children.",
    fullDefinition:
      "Soprano is the highest vocal range in choral music, typically spanning from C4 (middle C) to C6. Sopranos often carry the melody in choral works and are featured prominently in opera. The term comes from the Italian 'sopra,' meaning 'above.' Sub-categories include coloratura soprano (specializing in agile, decorated passages), lyric soprano, and dramatic soprano.",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Mezzo-soprano", "Alto", "Tenor", "Bass"],
    examples: [
      "The Queen of the Night aria requires a skilled soprano",
      "Children's choirs typically feature soprano voices",
    ],
  },
  {
    term: "Suite",
    slug: "suite",
    shortDefinition: "A collection of dance movements or pieces grouped together.",
    fullDefinition:
      "A suite is an ordered set of instrumental pieces, traditionally based on dance forms. Baroque suites typically included an allemande, courante, sarabande, and gigue, with optional additional dances. Later composers used the term more loosely for any collection of related pieces, such as orchestral suites drawn from ballets or operas (like Tchaikovsky's 'Nutcracker Suite') or programmatic suites depicting scenes or stories.",
    tags: ["Form"],
    relatedTerms: ["Minuet", "Sonata", "Symphony"],
    examples: [
      "Bach's Cello Suites are pinnacles of Baroque instrumental music",
      "Holst's 'The Planets' is a famous orchestral suite",
    ],
  },
  {
    term: "Subdivision",
    slug: "subdivision",
    shortDefinition: "Dividing the beat into smaller parts (e.g. two eighths or four sixteenths per beat).",
    fullDefinition:
      "Subdivision is the act of dividing each beat into smaller, equal parts. The most common subdivisions are two parts per beat (eighth notes: \"1-and-2-and\") and four parts per beat (sixteenth notes: \"1-e-and-a-2-e-and-a\"). Feeling subdivision helps you place notes precisely and play complex rhythms accurately. Metronomes can be set to click on every beat or on subdivisions; practicing with subdivision clicks is especially useful for fast or syncopated music.",
    tags: ["Rhythm", "Tempo"],
    relatedTerms: ["Beat", "Eighth note", "Quarter note", "Rhythm", "Metronome"],
    examples: [
      "Subdivide the beat in your head when the tempo is very slow",
      "Many metronomes allow subdivision clicks (e.g. eighth-note clicks)",
    ],
  },
  {
    term: "Symphony",
    slug: "symphony",
    shortDefinition: "A large-scale orchestral composition, typically in four movements.",
    fullDefinition:
      "A symphony is an extended musical composition for orchestra, typically in four movements: a fast opening movement (often in sonata form), a slow movement, a minuet or scherzo, and a fast finale. Developed in the Classical period by Haydn and Mozart, the symphony reached its grandest expression with Beethoven, Brahms, Mahler, and Shostakovich. Symphonies remain central to the orchestral repertoire.",
    tags: ["Form"],
    relatedTerms: ["Concerto", "Sonata", "Scherzo", "Minuet", "Rondo"],
    examples: [
      "Beethoven's Symphony No. 9 'Choral' is one of the greatest works",
      "Haydn composed 104 symphonies and is called 'Father of the Symphony'",
    ],
  },
  {
    term: "Syncopation",
    slug: "syncopation",
    shortDefinition: "Emphasis on beats or subdivisions that are normally weak; off-beat accentuation.",
    fullDefinition:
      "Syncopation is the deliberate shifting of accent onto normally weak beats or the \"and\" of the beat. It creates tension and groove by contradicting the expected pulse. In notation, syncopation often appears as notes tied across the beat or accents on upbeats. Jazz, funk, Latin music, and much pop music rely heavily on syncopation. Feeling the underlying steady beat while playing syncopated rhythms is a key skill for rhythm section players and soloists alike.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Accent", "Beat", "Upbeat", "Rhythm"],
    examples: [
      "The syncopated bass line gives the song its bounce",
      "Clave patterns in Latin music are built on syncopation",
    ],
  },
  {
    term: "Tap tempo",
    slug: "tap-tempo",
    shortDefinition: "A feature that sets tempo by tapping a button in time with the desired beat.",
    fullDefinition:
      "Tap tempo is a function on metronomes, drum machines, and audio software that lets you set the tempo by tapping a button or key in time with the beat you want. The device measures the time between your taps and calculates the BPM. It is useful for matching a metronome to a song you're learning, finding the tempo of a recording, or quickly dialing in a feel without scrolling through numbers. Many online and app metronomes offer tap tempo.",
    tags: ["Tempo", "Performance"],
    relatedTerms: ["Metronome", "Bpm", "Tempo", "Beat"],
    examples: [
      "Use tap tempo to find the BPM of a track before practicing along",
      "Tap four beats and the metronome will lock to your tempo",
    ],
  },
  {
    term: "Tempo",
    slug: "tempo",
    shortDefinition: "The speed of the music, usually measured in beats per minute (BPM).",
    fullDefinition:
      "Tempo is the speed at which a piece of music is played—how fast or slow the beat goes. It is usually given in beats per minute (BPM) or with Italian terms such as Allegro (fast), Andante (walking pace), or Adagio (slow). A conductor or metronome sets and maintains the tempo. Choosing the right tempo is essential for the character of a piece; many composers specify tempo precisely with BPM or descriptive markings. Practicing at a slow tempo and gradually increasing speed is a standard approach for learning difficult passages.",
    tags: ["Tempo", "Performance"],
    relatedTerms: ["Bpm", "Metronome", "Beat", "Allegro", "Andante", "Adagio"],
    examples: [
      "The tempo marking at the top of the score says quarter = 120",
      "Start at 60 BPM and increase by 5 once you can play cleanly",
    ],
  },
  {
    term: "Time signature",
    slug: "time-signature",
    shortDefinition: "A notation at the start of a piece that shows how many beats per bar and which note gets the beat.",
    fullDefinition:
      "The time signature (or meter signature) appears at the beginning of a piece as two numbers, one above the other. The top number tells you how many beats are in each bar; the bottom number indicates which note value counts as one beat (4 = quarter note, 8 = eighth note). For example, 4/4 means four quarter-note beats per bar; 3/4 means three quarter-note beats per bar (common in waltzes); 6/8 means six eighth notes per bar, often felt as two beats of three. The time signature defines the meter and how you count the music.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Meter", "Bar", "Measure", "Beat", "Note value"],
    examples: [
      "4/4 is also called common time and is the most common time signature",
      "In 6/8 time, you often count \"1-2-3-4-5-6\" or feel two big beats per bar",
    ],
  },
  {
    term: "Triad",
    slug: "triad",
    shortDefinition: "A three-note chord built from a root, third, and fifth.",
    fullDefinition:
      "A triad is the most basic type of chord in Western music: three notes stacked in thirds, named the root, third, and fifth. Triads come in four qualities—major, minor, diminished, and augmented—depending on the intervals between these notes. Major and minor triads are the building blocks of most harmony; diminished and augmented triads add color and tension. Triads can be played in root position (root on the bottom) or inverted (third or fifth on the bottom).",
    tags: ["Harmony", "Theory"],
    relatedTerms: ["Chord", "Arpeggio", "Cadence"],
    examples: [
      "A C major triad contains the notes C, E, and G",
      "The 1/3/5 rule for building chords refers to forming triads from scale degrees",
    ],
  },
  {
    term: "Tenor",
    slug: "tenor",
    shortDefinition: "The highest common male voice range.",
    fullDefinition:
      "Tenor is the highest male voice type commonly found in choral and operatic music, with a typical range from C3 to C5. The name comes from the Latin 'tenere' (to hold), as tenors historically held the main melody in early polyphonic music. Tenors are often cast as romantic heroes in opera. Sub-types include lyric tenor, dramatic tenor, and heldentenor (heroic tenor).",
    tags: ["Vocal", "Voice Type"],
    relatedTerms: ["Baritone", "Bass", "Alto", "Soprano"],
    examples: [
      "Luciano Pavarotti was one of the most famous operatic tenors",
      "The tenor section often sings the melody in barbershop quartets",
    ],
  },
  {
    term: "Upbeat",
    slug: "upbeat",
    shortDefinition: "The last beat of a bar, or any beat that leads into the next downbeat.",
    fullDefinition:
      "The upbeat is the beat that leads into the next downbeat—often the last beat of a bar, or the \"and\" between beats. In 4/4 time, beats 2, 3, and 4 are upbeats in relation to the following downbeat (beat 1 of the next bar). Conductors often give an upbeat to prepare an entrance. Many phrases begin on an upbeat (pickup or anacrusis) so that the downbeat lands on a strong word or note. Feeling the difference between downbeat and upbeat helps with timing and ensemble playing.",
    tags: ["Rhythm", "Notation"],
    relatedTerms: ["Downbeat", "Beat", "Bar", "Syncopation"],
    examples: [
      "The singer enters on the upbeat before beat 1 of the chorus",
      "A conductor's preparatory gesture is often on the upbeat",
    ],
  },
  {
    term: "Vivace",
    slug: "vivace",
    shortDefinition: "A lively, fast tempo, typically 156-176 BPM.",
    fullDefinition:
      "Vivace (Italian for 'lively' or 'vivid') indicates a brisk, lively tempo faster than Allegro but not as fast as Presto. It suggests not just speed but also a vibrant, energetic character full of life and spirit. Vivace is often used for dance movements and energetic finales. The typical tempo range is 156-176 beats per minute.",
    tags: ["Tempo"],
    relatedTerms: ["Allegro", "Presto", "Allegretto", "Moderato", "Bpm"],
    examples: [
      "Many Baroque gigues are marked Vivace",
      "Vivace movements often have a dance-like, energetic quality",
    ],
  },
];

// Helper function to get terms grouped by first letter
export function getTermsByLetter(): Map<string, DictionaryTerm[]> {
  const grouped = new Map<string, DictionaryTerm[]>();

  dictionaryTerms.forEach((term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!grouped.has(firstLetter)) {
      grouped.set(firstLetter, []);
    }
    grouped.get(firstLetter)!.push(term);
  });

  // Sort terms within each letter group
  grouped.forEach((terms, letter) => {
    terms.sort((a, b) => a.term.localeCompare(b.term));
    grouped.set(letter, terms);
  });

  return grouped;
}

// Helper function to get a term by slug
export function getTermBySlug(slug: string): DictionaryTerm | undefined {
  return dictionaryTerms.find((term) => term.slug === slug);
}

// Get all unique first letters for navigation
export function getAvailableLetters(): string[] {
  const letters = new Set<string>();
  dictionaryTerms.forEach((term) => {
    letters.add(term.term[0].toUpperCase());
  });
  return Array.from(letters).sort();
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  dictionaryTerms.forEach((term) => {
    term.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Get terms by tag
export function getTermsByTag(tag: string): DictionaryTerm[] {
  return dictionaryTerms
    .filter((term) => term.tags?.includes(tag))
    .sort((a, b) => a.term.localeCompare(b.term));
}
