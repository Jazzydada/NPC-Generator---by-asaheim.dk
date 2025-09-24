"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Globe, Shuffle, Lock, Unlock, Copy, Download, Undo as UndoIcon, Redo as RedoIcon } from "lucide-react";


/** =========================================================
 *  i18n (EN/DA) — FIXED
 * ======================================================= */
const t = {
  en: {
    appTitle: "RPG NPC Generator",
    subtitle: "Weighted races • 100 professions • 700 traits • Made by",
    fields: {
      name: "Name",
      gender: "Gender",
      race: "Race",
      profession: "Profession",
      appearance: "Appearance",
      voice: "Voice",
      movement: "Movement",
      demeanor: "Demeanor",
      persona: "Personality",
      trait: "Trait",
    },
    buttons: {
      roll: "Roll!",
      lockAll: "Lock All",
      unlockAll: "Unlock All",
      copyText: "Copy (text)",
      copyMJ: "Copy to Midjourney (paid)",
      perchance: "Copy to Perchance (free)",
      perchanceEmbedToggle: "Show Perchance in app",
      rollOne: "Reroll",
    },
    outputTitle: "Output",
    genderUnrevealed: "Unrevealed",
    common: { lock: "Lock", locked: "Locked", locksLabel: "Locks:" },
  },

  da: {
    appTitle: "RPG NPC Generator",
    subtitle: "Vægtede racer • 100 professioner • 700 kendetegn • Lavet af",
    fields: {
      name: "Navn",
      gender: "Køn",
      race: "Race",
      profession: "Profession",
      appearance: "Udseende",
      voice: "Stemme",
      movement: "Bevægelse",
      demeanor: "Sindelag",
      persona: "Personlighed",
      trait: "Kendetegn",
    },
    buttons: {
      roll: "Rul!",
      lockAll: "Lås alle",
      unlockAll: "Lås alle op",
      copyText: "Kopiér (tekst)",
      copyMJ: "Kopiér til Midjourney (koster at bruge)",
      perchance: "Kopiér til Perchance (gratis at bruge)",
      perchanceEmbedToggle: "Vis Perchance i appen",
      rollOne: "Omrul",
    },
    outputTitle: "Output",
    genderUnrevealed: "Uoplyst",
    common: { lock: "Lås", locked: "Låst", locksLabel: "Låse:" },
  },
};
/** =========================================================
 *  Data (forkortet – udvid frit)
 * ======================================================= */
// PROFESSIONS
const PROFESSIONS_EN = [
  "Farmer","Fisher","Shepherd","Hunter","Trapper","Forester","Miller","Baker","Butcher","Brewer",
  "Vintner","Cook","Street Vendor","Innkeeper","Tavern Server","Stablehand","Blacksmith","Armorer","Weaponsmith","Jeweler",
  "Lapidary","Carpenter","Wheelwright","Mason","Potter","Glassblower","Tinker","Weaver","Tailor","Cobbler",
  "Chandler (Candlemaker)","Scribe","Bookbinder","Cartographer","Librarian","Alchemist","Apothecary","Herbalist","Physician","Surgeon",
  "Midwife","Barber","Miner","Smelter","Ship Chandler","Sailor","Fisherboat Captain","Dockworker","Shipwright","Navigator",
  "Messenger","Courier","Town Crier","Guard","Watch Sergeant","City Watch Captain","Soldier","Scout","Ranger","Mercenary",
  "Bounty Hunter","Bodyguard","Gladiator","Entertainer","Bard","Minstrel","Juggler","Acrobat","Actor","Fortune Teller",
  "Seer","Astrologer","Priest","Monk","Nun","Acolyte","Paladin","Temple Attendant","Gravedigger","Undertaker",
  "Tanner","Furrier","Dyer","Ropemaker","Sailmaker","Cooper","Farrier","Teamster","Caravan Leader","Trader",
  "Shopkeeper","Moneylender","Tax Collector","Court Scribe","Magistrate’s Clerk","Courtier","Noble’s Steward","Retired Adventurer","Wizard’s Apprentice","Archivist"
];
const PROFESSIONS_DA = [
  "Bonde","Fisker","Hyrde","Jæger","Fældeopsætter","Skovfoged","Møller","Bager","Slagter","Brygger",
  "Vingartner","Kok","Gadesælger","Værtshusholder","Tjener på kro","Staldknægt","Smed","Rustningsmager","Våbensmed","Guldsmed",
  "Stensliber","Tømrer","Hjulmand","Murer","Pottemager","Glaspuster","Kramkar","Væver","Skrædder","Skomager",
  "Lysestøber","Skriver","Bogbinder","Kartograf","Bibliotekar","Alkymist","Apoteker","Urtekender","Læge","Kirurg",
  "Jordemoder","Barber","Minearbejder","Støber","Skibsprovianter","Sømand","Fiskeskipper","Havnearbejder","Skibsbygger","Navigatør",
  "Budbringer","Kurer","Byråber","Vagt","Vagtofficer","Byvagt-kaptajn","Soldat","Spejder","Skovrider","Lejesoldat",
  "Dusørjæger","Livvagt","Gladiator","Underholder","Bard","Spillemand","Jonglør","Akrobat","Skuespiller","Spåkvinde/Spåmand",
  "Seer","Astrolog","Præst","Munk","Nonne","Akolyt","Paladin","Tempeltjener","Gravgraver","Bedemand",
  "Garver","Pelsmager","Farver","Rebslager","Sejlduger","Bødker","Hovslagter","Kusk","Karavanefører","Købmand",
  "Butiksejer","Ågerkarl","Skatteopkræver","Retsskriver","Dommerfuldmægtig","Hofsinde","Adelig forvalter","Pensioneret eventyrer","Troldmandslærling","Arkivar"
];

// APPEARANCE
// --- APPEARANCE (EN) — 100 items ---
const APPEARANCE_EN = [
  "A long scar across the face",
  "One eye is milky white",
  "Toothless but always smiling",
  "Ragged cloak full of moth holes",
  "Permanently dirty fingers",
  "Six fingers on the right hand",
  "Very long, greasy hair",
  "Bald head tattooed with sigils",
  "A hunched back",
  "One hand always bandaged",
  "Pocked with tiny burn marks",
  "Pronounced high cheekbones",
  "Perpetually rosy cheeks",
  "Keeps a pet (rat/toad/bird) in pocket",
  "Necklace strung with tiny bones",
  "Always sun-kissed skin",
  "Pale, almost translucent skin",
  "A carved wooden prosthetic foot",
  "Crooked, many-times-broken nose",
  "Huge moustache but no head hair",
  "A glass eye of odd color",
  "Wears antlers/horns as jewelry",
  "Missing one ear",
  "Tiny fingertip tattoos",
  "Soot or ash smeared constantly",
  "Very small and wiry",
  "Unnaturally tall and lanky",
  "A rasping, chronic cough",
  "Always smells of fish",
  "Decorative eyepatch",
  "Teeth stained blue by berries",
  "Large wine-stain birthmark",
  "Jagged scar across throat",
  "Hands always in pockets",
  "Hooded cloak that drips even when dry",
  "Heterochromia (two eye colors)",
  "Ear filled with rings",
  "Always wears a wide-brim hat",
  "Grease smudge on cheek that never leaves",
  "Very long nails",
  "Spyglass hanging from neck",
  "Always chewing a root",
  "Large wart on the nose",
  "Shoes far too expensive for outfit",
  "Fresh flower crown every day",
  "Covered in tiny scratches",
  "Metal facial prosthetic",
  "Enormous bushy eyebrows",
  "A wound that never heals",
  "Voice cracks into falsetto",
  "Boots always caked with mud",
  "Checks a pocketwatch constantly",
  "Carries a child’s doll",
  "Clutches a battered book",
  "Arcane symbols drawn on skin",
  "Thick fur coat regardless of season",
  "Wreath of dried herbs",
  "Necklace of teeth",
  "Walking stick carved with runes",
  "Deep hood concealing the face",
  "Scar shaped like an animal",
  "Gold leaf flaking on skin",
  "Hands that bleed in tiny cuts",
  "Odd birthmark on the brow",
  "Belt of clinking vials",
  "A bird that always follows",
  "Tinted glass spectacles",
  "Rings on every finger",
  "Cloak that smells of the sea",
  "Oversized gloves",
  "Belt jangling with keys",
  "Constantly darting eyes",
  "A creaking spine",
  "Eyes that always look wet",
  "Voice like a knife’s edge",
  "Backpack twice their size",
  "A scar that looks very recent",
  "Heavy eyeliner (even on men)",
  "A single gold tooth always flashed",
  "Ear pierced many times",
  "Beard woven into braids",
  "Always blood under fingernails",
  "Carries a worn flute",
  "Hair full of dust",
  "Rusty old hero’s sword",
  "Rune branded into the arm",
  "Clothes of a color no one else wears",
  "Hooked nose",
  "Face-wrapping scarf",
  "Goggles strapped to forehead",
  "Leather half-mask",
  "Poison-green lipstick",
  "Permanent wine blotch on clothes",
  "Skull-shaped buckle",
  "Broken keepsake they guard",
  "A dried hand at the belt",
  "Tiny bells sewn into clothes",
  "Prosthetic leg made the wrong size",
  "Hood edged with animal teeth",
  "Robe that glitters like a starfield",
  "Smudged ink on fingertips",
  "Freshly stitched wound",
  "Missing two front teeth",
  "Burn-scarred ear",
  "Fingerless gloves regardless of weather",
  "Scent of ozone follows them",
  "Faintly glowing tattoo",
  "Hair braided with copper wire",
  "Small constellation tattoos",
  "Old military insignia pinned to cloak"
];
// --- APPEARANCE (DA) — 100 stk. ---
const APPEARANCE_DA = [
  "Et langt ar hen over ansigtet",
  "Det ene øje er mælkehvidt",
  "Tandløs men altid smilende",
  "Laset kappe fyldt med mølhuller",
  "Permanent snavsede fingre",
  "Seks fingre på højre hånd",
  "Meget langt, fedtet hår",
  "Skaldet hoved tatoveret med segl",
  "En pukkelryg",
  "Den ene hånd altid forbundet",
  "Prikket af små brændemærker",
  "Markante høje kindben",
  "Altid rødmossede kinder",
  "Har et kæledyr (rotte/padde/fugl) i lommen",
  "Halskæde snoret med små knogler",
  "Altid solbrun hud",
  "Bleg, næsten gennemsigtig hud",
  "Udskåret træprotese som fod",
  "Krogede, mange gange brækket næse",
  "Kæmpe overskæg men intet hovedhår",
  "Et glasøje i mærkelig farve",
  "Bærer gevir/horn som smykke",
  "Mangler det ene øre",
  "Små tatoveringer på fingerspidserne",
  "Sod eller aske smurt på hele tiden",
  "Meget lille og spinkel",
  "Unaturligt høj og ranglet",
  "Hæs, kronisk hoste",
  "Lugter altid af fisk",
  "Dekorativ klap for øjet",
  "Tænder farvet blå af bær",
  "Stor vinrød modermærkeplet",
  "Takket ar hen over halsen",
  "Hænderne altid i lommerne",
  "Hættekappe der drypper selv når tør",
  "Heterokromi (to øjenfarver)",
  "Øret fuldt af ringe",
  "Bærer altid bredskygget hat",
  "Fedtplam i kinden der aldrig går væk",
  "Meget lange negle",
  "Kikkert hænger i en snor om halsen",
  "Tygger altid på en rod",
  "Stor vorte på næsen",
  "Sko alt for dyre til tøjet",
  "Ny blomsterkrans hver dag",
  "Dækket af små ridser",
  "Metallisk ansigtsprotese",
  "Enorme buskede øjenbryn",
  "Et sår der aldrig heler",
  "Stemme, der knækker i falset",
  "Støvler altid smurt ind i mudder",
  "Tjekker konstant et lommeur",
  "Bærer på en barnedukke",
  "Klynger sig til en medtaget bog",
  "Arkaneruner tegnet på huden",
  "Tykt pelsslag uanset årstid",
  "Krans af tørrede urter",
  "Halskæde af tænder",
  "Stok udskåret med runer",
  "Dyb hætte, der skjuler ansigtet",
  "Ar formet som et dyr",
  "Guldflager skaller af huden",
  "Hænder der bløder i små rifter",
  "Underligt modermærke i panden",
  "Bælte med klirrende hætteglas",
  "En fugl følger dem altid",
  "Tonede brilleglas",
  "Ringe på alle fingre",
  "Kappe der lugter af hav",
  "Alt for store handsker",
  "Bælte der klirrer af nøgler",
  "Øjne der konstant flakker",
  "En rygsøjle der knager",
  "Øjne der altid ser våde ud",
  "Stemme som en knivsæg",
  "Rygsæk dobbelt så stor som dem",
  "Et ar der ser helt friskt ud",
  "Kraftig eyeliner (også på mænd)",
  "En enkelt guldtand vises altid",
  "Øret gennemstukket mange gange",
  "Skæg flettet i fletninger",
  "Altid blod under neglene",
  "Bærer en slidt fløjte",
  "Håret fuldt af støv",
  "Rustet, gammelt heltesværd",
  "Rune brændt ind i armen",
  "Tøj i en farve ingen andre bærer",
  "Kroget næse",
  "Ansigtstørklæde viklet rundt",
  "Beskyttelsesbriller på panden",
  "Læder-halvmaske",
  "Giftgrøn læbestift",
  "Permanent vinplet på tøjet",
  "Bæltespænde formet som kranie",
  "Knækket klenodie de vogter",
  "En tørret hånd i bæltet",
  "Små klokker syet i tøjet",
  "Protese-ben i forkert størrelse",
  "Hættekant med dyretænder",
  "Kåbe der glimter som en stjernehimmel",
  "Snavset blæk på fingerspidser",
  "Friskt syet sår",
  "Mangler de to fortænder",
  "Forbrændt og arret øre",
  "Fingerløse handsker året rundt",
  "Lugt af ozon følger dem",
  "Svagt glødende tatovering",
  "Hår flettet med kobbertråd",
  "Små stjernetegn tatoveret",
  "Gammel militærnål på kappen"
];

// SPEECH + PITCH lister (bruges kun til at SAMMENSÆTTE 'voice')
const SPEECH_EN = [  "Has a hoarse voice",
    "Has a deep, rumbling voice",
    "Has a nasal voice",
    "Has a monotone voice",
    "Has a high, squeaky voice",
    "Has a rough and raspy voice",
    "Has a shrill, hysterical voice",
    "Has a soft and soothing voice",
    "Has a metallic, tinny voice",
    "Has a cracked voice",
    "Has a childlike voice",
    "Has a warm storyteller’s voice",
    "Has a threatening voice",
    "Has a melodic voice",
    "Has a commanding voice",
    "Has a sighing voice",
    "Has a whistling voice",
    "Has a mumbling voice",
    "Has a whispering voice",
    "Has a scratchy voice",
    "Has a booming voice",
    "Has a trembling voice",
    "Has a falsely sweet voice",
    "Has a whining voice",
    "Has a dramatic voice",
    "Has a teasing voice",
    "Has a sing-song voice",
    "Has a fast-talking voice",
    "Has a halting voice",
    "Has a giggling voice",
    "Has a sniffly voice",
    "Has a hissing voice",
    "Has a preaching voice",
    "Has a theatrical voice",
    "Has a breathless voice",
    "Has a gloomy voice",
    "Has a gravelly, grinding voice",
    "Has a complaining voice",
    "Has a rusty-sounding voice",
    "Has a barking voice",
    "Has a biting, sarcastic voice",
    "Has a chuckling voice",
    "Has a thunderous, rolling voice",
    "Has a faint, barely audible voice",
    "Has a sly, mocking voice",
    "Has a sharp, piercing voice",
    "Has a whiny voice",
    "Has a hollow, echoing voice",
    "Has a weary, tired voice",
    "Has an insistent voice",];
const SPEECH_DA = ["Har en hæs stemme",
    "Har en dyb, rumlende stemme",
    "Har en nasal stemme",
    "Har en monoton stemme",
    "Har en lys, pibende stemme",
    "Har en rå og raspende stemme",
    "Har en skinger, hysterisk stemme",
    "Har en blød og beroligende stemme",
    "Har en metallisk, dåseagtig stemme",
    "Har en sprukken stemme",
    "Har en barnlig stemme",
    "Har en varm fortællerstemme",
    "Har en truende stemme",
    "Har en melodisk stemme",
    "Har en kommanderende stemme",
    "Har en sukkende stemme",
    "Har en fløjtende stemme",
    "Har en mumlende stemme",
    "Har en hviskende stemme",
    "Har en skrattende stemme",
    "Har en rungende stemme",
    "Har en vibrerende stemme",
    "Har en falsk sød stemme",
    "Har en jamrende stemme",
    "Har en dramatisk stemme",
    "Har en drillende stemme",
    "Har en syngende stemme",
    "Har en rapkæftet stemme",
    "Har en haltende stemme",
    "Har en fnisende stemme",
    "Har en snøftende stemme",
    "Har en hvislende stemme",
    "Har en prædikende stemme",
    "Har en teatralsk stemme",
    "Har en åndeløs stemme",
    "Har en dyster stemme",
    "Har en grov, knasende stemme",
    "Har en klagende stemme",
    "Har en rusten stemme",
    "Har en bjæffende stemme",
    "Har en syrlig stemme",
    "Har en klukkende stemme",
    "Har en tordenrullende stemme",
    "Har en svag, knap hørbar stemme",
    "Har en drillende, spydig stemme",
    "Har en høj, gennemtrængende stemme",
    "Har en klynkende stemme",
    "Har en hul, ekkoagtig stemme",
    "Har en træt, opgivende stemme",
    "Har en insisterende stemme",];
const PITCH_EN = [ "and always laughs at their own jokes",
    "and always speaks in riddles",
    "and misuses proverbs at odd times",
    "and repeats the last word of every sentence",
    "and constantly interrupts others",
    "but begins every sentence with ‘Well…’",
    "and swears far too much",
    "and speaks in the third person",
    "and gives everyone nicknames",
    "and uses wildly mixed metaphors",
    "and speaks in half-sentences",
    "and says ‘maybe’ in every sentence",
    "and speaks only in exclamations",
    "and adds little whistles between words",
    "and ends every line with a proverb",
    "and overexplains mundane details",
    "and always starts with ‘By the gods…’",
    "and reads aloud as if from a book",
    "and shouts like a marketplace hawker",
    "and calls everyone ‘my friend’",
    "and uses exaggerated dramatic pauses",
    "and adds animal noises between words",
    "and pounds the table for emphasis",
    "and interrupts themselves with curses",
    "but slips religious phrases into every topic",
    "and constantly repeats ‘as I said’",
    "and always speaks in questions",
    "and hands out nicknames instantly",
    "and mixes in animal growls",
    "and recites everything like a recipe",
    "and always speaks in rhyme",
    "and talks painfully slowly",
    "and speaks so quickly it’s hard to follow",
    "and mumbles so much it’s barely audible",
    "and overuses sports metaphors",
    "and says ‘of course’ in every sentence",
    "and says ‘why not?’ in every sentence",
    "and always begins with a short prayer",
    "and adds comic-book sound effects",
    "and misuses long, fancy words",
    "and describes everything in past tense",
    "and predicts everything in future tense",
    "and always sounds drunk",
    "and always sounds angry",
    "and always sounds cheerful",
    "and repeats their own name constantly",
    "and quotes old sayings obsessively",
    "and bursts into tears mid-sentence",
    "and roars with laughter after each line",
    "and ends every statement with ‘right?’"
];
const PITCH_DA = [ "og griner altid af sine egne vittigheder",
    "og taler altid i gåder",
    "og bruger ordsprog på forkerte tidspunkter",
    "og gentager sidste ord i hver sætning",
    "og afbryder konstant andre",
    "men begynder hver sætning med ‘Nå…’",
    "og bander alt for meget",
    "og taler i tredje person",
    "og giver alle øgenavne",
    "og bruger altid vilde metaforer",
    "og taler i halve sætninger",
    "og siger ‘måske’ i hver sætning",
    "og taler kun i udråb",
    "og tilføjer små fløjtelyde mellem ord",
    "og afslutter alt med et ordsprog",
    "og overforklarer små detaljer",
    "og starter altid med ‘ved guderne…’",
    "og læser som om fra en bog",
    "og råber som en markedsråber",
    "og kalder alle for ‘min ven’",
    "og bruger overdrevne pauser",
    "og tilføjer dyrelyde mellem ord",
    "og slår i bordet for at understrege pointer",
    "og afbryder sig selv med bandeord",
    "men bruger religiøse vendinger uanset emne",
    "og gentager hele tiden ‘som jeg sagde’",
    "og taler altid i spørgsmål",
    "og giver folk tilnavne på stedet",
    "og blander hele tiden dyriske brøl ind",
    "og reciterer alt som en opskrift",
    "og taler altid i rim",
    "og taler utrolig langsomt",
    "og taler så hurtigt at man knap forstår det",
    "og mumler så man knap hører ordene",
    "og citerer sport som metafor for alt",
    "og siger ‘selvfølgelig’ i hver sætning",
    "og siger ‘hvorfor ikke?’ i hver sætning",
    "og begynder altid med en kort bøn",
    "og tilføjer tegneserie-lyde",
    "og bruger lange, indviklede ord forkert",
    "og beskriver alt i datid",
    "og forudsiger alt i fremtid",
    "og lyder konstant fuld",
    "og lyder konstant vred",
    "og lyder konstant glad",
    "og gentager sit eget navn hele tiden",
    "og citerer altid gamle ordsprog",
    "og græder midt i en sætning",
    "og ler højt efter hver replik",
    "og afslutter alt med et ‘ikke sandt?’"];

// MOVEMENT / DEMEANOR / PERSONA / TRAIT
// --- MOVEMENT (EN) — 100 items ---
const MOVEMENT_EN = [
  "Catlike steps",
  "Heavy stomps",
  "Swaggering gait",
  "Nervous fidgeting",
  "Measured pace, back straight",
  "Head down watching the ground",
  "Tiptoes constantly",
  "Shuffles feet",
  "Always skipping a little",
  "Marches in strict rhythm",
  "Hops when excited",
  "Drags left foot slightly",
  "Leans heavily on a cane",
  "Moves in sudden bursts",
  "Walks in zigzags",
  "Leans backward as they walk",
  "Arms swinging wildly",
  "Arms folded tight",
  "Carries self with stiff posture",
  "Keeps head tilted",
  "Rolls shoulders when walking",
  "Moves silently, almost unseen",
  "Kicks stones on the path",
  "Shuffles cards while pacing",
  "Balances on one leg briefly",
  "Constantly stretches arms",
  "Rubs hands while walking",
  "Twists ring while pacing",
  "Trips often but recovers",
  "Turns head rapidly",
  "Body sways like a tree",
  "Steps always in threes",
  "Small, mincing steps",
  "Huge, bounding strides",
  "Always crouched low",
  "Back slightly hunched",
  "Overly upright, rigid",
  "Feet point outward",
  "Feet point inward",
  "Walks on heels",
  "Walks on toes",
  "Limps on right leg",
  "Limps on left leg",
  "Hops over cracks",
  "Spins suddenly while walking",
  "Always checks surroundings",
  "Pauses every ten steps",
  "Moves like in a dance",
  "Steps in rhythm of song",
  "Arms out for balance",
  "Walks backwards at times",
  "Sudden twitches",
  "Stops to kneel often",
  "Runs fingers on walls",
  "Paces in circles",
  "Paces squares carefully",
  "Crosses arms tightly",
  "Hands always behind back",
  "Hands always clasped",
  "Hands stuffed in pockets",
  "Constantly cracking joints",
  "Clicks heels together",
  "Head jerks sideways",
  "Eyes dart while moving",
  "Shoulders twitch",
  "Walks as if drunk",
  "Walks as if floating",
  "Glides noiselessly",
  "Moves like a predator",
  "Moves like a puppet",
  "Always leaning forward",
  "Always leaning back",
  "Hunched as if cold",
  "Shivers as they walk",
  "Gestures widely while pacing",
  "Points finger as they step",
  "Claps with each stride",
  "Taps cane rhythmically",
  "Kicks doorframes lightly",
  "Jumps on stairs",
  "Crawls when unsure",
  "Sways side to side",
  "Runs hands through hair while pacing",
  "Runs hand across mouth often",
  "Moves shoulders first",
  "Neck leads body",
  "Torso twisted oddly",
  "Feet hardly lift",
  "Footsteps strangely loud",
  "Footsteps eerily soft",
  "Breath in rhythm with steps",
  "Always rushing ahead",
  "Always lagging behind",
  "Matches others’ pace deliberately",
  "Ignores others’ pace entirely",
  "Moves like they own the room",
  "Moves like they fear the floor",
  "Never still for a moment",
  "Still until startled"
];
// --- MOVEMENT (DA) — 100 stk. ---
const MOVEMENT_DA = [
  "Kat-agtige skridt",
  "Tunge tramp",
  "Vuggende gang",
  "Nervøs fiplen",
  "Afmålt tempo, rank ryg",
  "Hovedet nede mod jorden",
  "Listende på tæer hele tiden",
  "Slæber fødderne",
  "Springer småt hele tiden",
  "Marcherer i stramt tempo",
  "Hopper når begejstret",
  "Slæber lidt på venstre fod",
  "Støtter tungt på en stok",
  "Bevæger sig i pludselige ryk",
  "Går i zigzag",
  "Læner sig bagud når de går",
  "Arme svinger voldsomt",
  "Arme foldet stramt",
  "Bærer sig selv med stiv holdning",
  "Holder hovedet på skrå",
  "Ruller skuldrene når de går",
  "Bevæger sig lydløst, næsten uset",
  "Sparker små sten på vejen",
  "Blander kort mens de går",
  "Balancerer kort på ét ben",
  "Strækker armene hele tiden",
  "Gnider hænderne mens de går",
  "Drejer ring når de trasker",
  "Snubler tit men retter sig",
  "Drejer hovedet hurtigt",
  "Kroppen svajer som et træ",
  "Trin altid i tre",
  "Små, puslende skridt",
  "Store, springende skridt",
  "Altid foroverbøjet",
  "Let pukkelrygget",
  "Overdrevent rank og stiv",
  "Fødder peger udad",
  "Fødder peger indad",
  "Går på hælene",
  "Går på tæerne",
  "Halter på højre ben",
  "Halter på venstre ben",
  "Springer over revner",
  "Drejer rundt pludseligt",
  "Tjekker altid omgivelserne",
  "Standses hver tiende skridt",
  "Bevæger sig som i en dans",
  "Trin i rytme som en sang",
  "Arme ud for balance",
  "Går baglæns indimellem",
  "Pludselige ryk",
  "Knæler ofte ned",
  "Kører fingrene på vægge",
  "Pacer i cirkler",
  "Pacer i firkanter",
  "Krydser armene stramt",
  "Hænder altid bag ryggen",
  "Hænder altid foldet",
  "Hænder stukket i lommer",
  "Knækker led konstant",
  "Klikker hælene sammen",
  "Hovedet rykker til siden",
  "Øjne flakker mens de går",
  "Skuldre rykker",
  "Går som beruset",
  "Går som svævende",
  "Glider lydløst",
  "Bevæger sig som et rovdyr",
  "Bevæger sig som en marionet",
  "Altid foroverlænet",
  "Altid bagudlænet",
  "Foroverbøjet som om frysende",
  "Ryster mens de går",
  "Gestikulerer voldsomt mens de går",
  "Peger med finger for hvert skridt",
  "Klapper for hvert skridt",
  "Banker stokken rytmisk",
  "Sparker til dørkarme",
  "Hopper på trapper",
  "Kravler når usikker",
  "Svajer fra side til side",
  "Kører hånden gennem håret mens de går",
  "Kører hånden over munden tit",
  "Bevæger skuldrene først",
  "Halsen leder kroppen",
  "Overkroppen snoet mærkeligt",
  "Fødderne løftes næsten ikke",
  "Skridt mærkeligt høje",
  "Skridt uhyggeligt stille",
  "Åndedræt i takt med trin",
  "Altid i hast foran",
  "Altid haltende bagud",
  "Matcher andres tempo bevidst",
  "Ignorerer andres tempo fuldstændigt",
  "Bevæger sig som hen ejer rummet",
  "Bevæger sig som frygter gulvet",
  "Aldrig stille et øjeblik",
  "Står stille indtil hen bliver forskrækket"
];
// --- DEMEANOR (EN) — 100 items ---
const DEMEANOR_EN = [
  "Stoic and unreadable",
  "Cheerfully oblivious",
  "Brooding and distant",
  "Nervously fidgety",
  "Quietly confident",
  "Hopelessly romantic",
  "Perpetually suspicious",
  "Proud to a fault",
  "Genuinely compassionate",
  "Grim but fair",
  "Playfully sarcastic",
  "Deadpan humor",
  "Wide-eyed curious",
  "World-weary cynic",
  "Easily offended",
  "Quick to forgive",
  "Eager to please",
  "Passive-aggressive",
  "Bossy and controlling",
  "Melodramatic storyteller",
  "Absent-minded daydreamer",
  "Calm under pressure",
  "Hotheaded sprinter",
  "Cold and clinical",
  "Chipper morning person",
  "Night owl grumbler",
  "Superstitious about everything",
  "Hero-worshipping adventurers",
  "Greedy but careful",
  "Generous to strangers",
  "Recklessly brave",
  "Conflict-avoidant",
  "Reluctant leader",
  "Natural mediator",
  "Blunt truth-teller",
  "Silver-tongued flatterer",
  "Chronic exaggerator",
  "Pessimistic realist",
  "Optimistic idealist",
  "Snarky but loyal",
  "Grateful survivor",
  "Vengeful grudge-keeper",
  "Shameless gossip",
  "Chivalrous helper",
  "Tactless but honest",
  "Excitable and jumpy",
  "Protective of underdogs",
  "Rule-obsessed stickler",
  "Rule-breaking free spirit",
  "Flirtatious and bold",
  "Prudish and proper",
  "Easily distracted",
  "Methodical planner",
  "Improvises constantly",
  "Schemer two steps ahead",
  "Conspiracy-minded",
  "Overly apologetic",
  "Secretly terrified",
  "Dead-serious mission focus",
  "Play-it-safe cautious",
  "Adrenaline chaser",
  "Spiritual and reflective",
  "Scientific skeptic",
  "Squeamish about blood",
  "Bloodthirsty braggart",
  "Merciful even to foes",
  "Vindictive with rivals",
  "Compulsively tidy",
  "Comfortably messy",
  "Food-obsessed",
  "Perpetually thirsty",
  "Animal lover",
  "Kids’ best friend",
  "Patronizing to nobility",
  "Awed by nobility",
  "Dislikes magic",
  "Fascinated by magic",
  "Clerical about records",
  "Artistic and bohemian",
  "Musically inclined",
  "Poet at heart",
  "Collector of oddities",
  "Hates being touched",
  "Hugger of everyone",
  "Always humming",
  "Whistles when thinking",
  "Laughs at own jokes",
  "Stone-faced listener",
  "Interrupts constantly",
  "Lets others speak first",
  "Overexplains everything",
  "Keeps answers short",
  "Needs last word",
  "Avoids eye contact",
  "Holds intense eye contact",
  "Uncomfortable in crowds",
  "Thrives in crowds",
  "Hates the outdoors",
  "Feels alive outdoors",
  "Existentially anxious",
  "Radiates quiet joy",
  "Chronically jealous",
  "Inspires confidence in others",
  "Calmly intimidating",
  "Brittle but brave",
  "Charming raconteur",
  "Gentle teacher",
  "Relentless interrogator",
  "Soft-spoken diplomat",
  "Gruff but kind"
];
// --- DEMEANOR (DA) — 100 stk. ---
const DEMEANOR_DA = [
  "Stoiskt og uigennemskuelig",
  "Muntert uvidende",
  "Tungsindigt og fjern",
  "Nervøst pilfingret",
  "Stille selvsikker",
  "Håbløst romantisk",
  "Evigt mistænksom",
  "Overdrevent stolt",
  "Oprigtigt medfølende",
  "Barsk men retfærdig",
  "Legende sarkastisk",
  "Tørt deadpan-humor",
  "Storøjet nysgerrig",
  "Verdens-træt kyniker",
  "Let at fornærme",
  "Hurtig til at tilgive",
  "Ivrig efter at behage",
  "Passiv-aggressiv",
  "Dominerende og kontrollerende",
  "Melodramatisk historiefortæller",
  "Fraværende dagdrømmer",
  "Rolig under pres",
  "Hidsig sprinter",
  "Kold og klinisk",
  "Morgenfrisk og kvik",
  "Natteugle der brokker sig",
  "Overtroisk med alt",
  "Heltedyrkende",
  "Grådig men varsom",
  "Generøs mod fremmede",
  "Hensynsløst modig",
  "Konfliktsky",
  "Modvillig leder",
  "Naturlig mægler",
  "Brutal sandhedssiger",
  "Sølv-tung smigrer",
  "Kronisk overdriver",
  "Pessimistisk realist",
  "Optimistisk idealist",
  "Spydig men loyal",
  "Taknemmelig overlever",
  "Hævnlysten og langnæbbet",
  "Skamløs sladdertante",
  "Ridderlig hjælper",
  "Taktløs men ærlig",
  "Letantændelig og springende",
  "Beskytter de svage",
  "Regelrytter til det maniske",
  "Fri sjæl der bryder reglerne",
  "Flirtende og modig",
  "Prippet og korrekt",
  "Let at distrahere",
  "Metodisk planlægger",
  "Improviserer hele tiden",
  "Skakspiller to træk frem",
  "Konspirations-orienteret",
  "Overdrevent undskyldende",
  "Hemmelig rædselsslagen",
  "Dødalvorligt opgavefokus",
  "Sikkerhedsorienteret forsigtig",
  "Jager adrenalin",
  "Åndelig og eftertænksom",
  "Videnskabeligt skeptisk",
  "Sart over for blod",
  "Blodtørstig pralhals",
  "Barmhjertig selv mod fjender",
  "Hævnlysten mod rivaler",
  "Tvangsryddelig",
  "Tilpas rodet",
  "Madfikseret",
  "Evigt tørstig",
  "Dyreven",
  "Børns bedste ven",
  "Patroniserende mod adel",
  "Ærbødig over for adel",
  "Kan ikke lide magi",
  "Fascineret af magi",
  "Kontoragtig med papirarbejde",
  "Kunstnerisk og boheme",
  "Musikalsk anlagt",
  "Digter af hjertet",
  "Samler af kuriositeter",
  "Kan ikke lide berøring",
  "Krammer alle",
  "Nynner hele tiden",
  "Fløjter når der tænkes",
  "Griner af egne vittigheder",
  "Stenansigt-lytter",
  "Afbryder konstant",
  "Lader andre tale først",
  "Overforklarer alting",
  "Holder svarene korte",
  "Skal have det sidste ord",
  "Undgår øjenkontakt",
  "Holder intens øjenkontakt",
  "Utilpas i folkemængder",
  "Trives i folkemængder",
  "Hader udendørs",
  "Lever op udendørs",
  "Eksistentielt ængstelig",
  "Udsender stille glæde",
  "Kronisk jaloux",
  "Indgyder tillid",
  "Roligt intimiderende",
  "Sprød men modig",
  "Charmerende fortæller",
  "Blid underviser",
  "Ubønhørlig udspørger",
  "Mildt-talt diplomat",
  "Brusket men venlig"
];

// --- PERSONA (EN) — 100 items ---
const PERSONA_EN = [
  "Nervous","Excited","Curious","Intellectual","Friendly",
  "Nervous","Excited","Curious","Intellectual","Friendly",
  "Honest","Proud","Creepy","Cheerful","Cruel",
  "Shy","Snobbish","Barbaric","Careless","Sly",
  "Kind","Arrogant","Cautious","Hot-headed","Lazy",
  "Grumpy","Polite","Generous","Suspicious","Dreamy",
  "Bitter","Confident","Naive","Melancholic","Ambitious",
  "Sarcastic","Jovial","Obsessive","Stoic","Cowardly",
  "Charming","Irritable","Greedy","Loyal","Vindictive",
  "Paranoid","Optimistic","Pessimistic","Impulsive","Thoughtful",
  "Secretive","Talkative","Jealous","Innocent","Reckless",
  "Playful","Protective","Adventurous","Clumsy","Strict",
  "Mysterious","Helpful","Imaginative","Realistic","Pompous",
  "Romantic","Stubborn","Humble","Calculating","Impatient",
  "Patient","Trustworthy","Untrustworthy","Hopeful","Hopeless",
  "Vain","Insecure","Spiritual","Skeptical","Rebellious",
  "Traditional","Inquisitive","Quiet","Loud","Boastful",
  "Selfish","Selfless","Determined","Aimless","Cynical",
  "Idealistic","Flirtatious","Cold","Warm-hearted","Detached",
  "Passionate","Lazy dreamer","Hardworking","Bohemian","Methodical",
  "Chaotic","Organized","Fearful","Brave","Detached Joker",
  "Melodramatic","Down-to-earth","Overconfident","Gullible","Wise"
];
// --- PERSONA (DA) — 100 items ---
const PERSONA_DA = [
  "Nervøs","Ophidset","Nysgerrig","Intellektuel","Venlig",
  "Ærlig","Stolt","Uhyggelig","Munter","Grusom",
  "Genert","Snobbet","Barbarisk","Skødesløs","Snu",
  "Venligsindet","Arrogant","Forsigtig","Hidsig","Doven",
  "Gnavpot","Høflig","Generøs","Mistænksom","Drømmende",
  "Bitter","Selvsikker","Naiv","Melankolsk","Ambitiøs",
  "Sarkastisk","Lunefuld","Manisk","Stoisk","Feg",
  "Charmerende","Irritabel","Grådig","Loyal","Hævnlysten",
  "Paranoid","Optimistisk","Pessimistisk","Impulsiv","Eftertænksom",
  "Hemmelighedsfuld","Snakkesalig","Jaloux","Uskyldig","Hensynsløs",
  "Legesyg","Beskyttende","Eventyrlysten","Klodset","Striks",
  "Mystisk","Hjælpsom","Fantaserende","Realistisk","Selvhøjtidelig",
  "Romantisk","Stædig","Ydmyg","Beregnende","Utålmodig",
  "Tålmodig","Tillidsfuld","Upålidelig","Håbefuld","Håbløs",
  "Forfængelig","Usikker","Spirituel","Skeptisk","Rebellisk",
  "Traditionel","Spørgende","Stille","Larmende","Pralende",
  "Egoistisk","Uselvisk","Beslutsom","Måløs","Kynisk",
  "Idealistisk","Flirtende","Kold","Varmehjeret","Fraværende",
  "Passioneret","Doven drømmer","Arbejdssom","Bohemeagtig","Metodisk",
  "Kaotisk","Organiseret","Frygtsom","Modig","Fjern spasmager",
  "Melodramatisk","Jordnær","Overmodig","Godtroende","Vis"
];

// --- TRAIT (EN) — 100 items ---
const TRAIT_EN = [
    "Always carries a lucky charm","Keeps a meticulous journal","Collects shiny stones",
    "Afraid of thunder","Laughs at odd moments","Never breaks eye contact",
    "Whistles often","Hums between sentences","Talks to plants",
    "Names their weapons","Overpolishes boots","Smells faintly of smoke",
    "Smells of sea salt","Smells of ink and parchment","Smells of herbs",
    "Wears too many rings","Wears mismatched socks","Wears gloves in all seasons",
    "Hates wearing hats","Always wears a scarf","Wears a single black glove",
    "Fidgets with a coin","Flips a dagger expertly","Plays with lockpicks",
    "Clicks tongue before speaking","Cracks knuckles often","Bites lip when thinking",
    "Squints as if nearsighted","Tilts head when listening","Stares into middle distance",
    "Taps foot impatiently","Counts steps aloud","Mouths other people’s words",
    "Mutters notes to self","Repeats last word quietly","Ends sentences with a proverb",
    "Sucks teeth when annoyed","Rolls shoulders in circles","Rubs temples frequently",
    "Paces in perfect squares","Arranges items by size","Keeps strict personal schedule",
    "Asks too many questions","Answers with more questions","Overexplains everything",
    "Gives everyone nicknames","Forgets names instantly","Remembers birthdays",
    "Hates loud noises","Jumps at sudden sounds","Sleeps lightly",
    "Sleeps like a stone","Snores like a bear","Talks in sleep",
    "Insists on morning stretches","Brews their own tea blend","Carries homemade trail mix",
    "Won’t eat food that touches","Eats only after others","Licks finger to test wind",
    "Saves every receipt","Polishes coins before paying","Haggles over everything",
    "Collects rumors like trophies","Keeps a tally of favors","Notches staff for victories",
    "Never sits with back to door","Always sits by a window","Avoids stepping on cracks",
    "Greets animals first","Feeds stray cats and dogs","Talks baby-talk to beasts",
    "Refuses to kill insects","Presses flowers in a book","Wears a dried flower in hat",
    "Braids hair with twine","Keeps a feather behind ear","Wears a charm against curses",
    "Draws maps of everywhere","Sketches people absentmindedly","Writes poetry on scraps",
    "Carves little runes into wood","Knots rope when anxious","Practices knots for fun",
    "Collects keys of unknown locks","Carries a bundle of ribbons","Ties reminders on fingers",
    "Clicks heels together when glad","Snaps fingers to focus","Claps once to decide",
    "Spins a ring when lying","Winks before bad ideas","Covers smile with hand",
    "Hides laughter behind cough","Giggles at wrong moment","Sighs theatrically",
    "Rolls eyes but apologizes","Says sorry for everything","Thanks people excessively",
    "Blesses sneezes in three languages","Swears in dead tongues","Prays before meals",
    "Makes a wish at sundown","Salutes the moon","Counts stars to fall asleep",
    "Never turns down a dare","Always volunteers first","Hates being second",
    "Keeps promises to a fault","Holds grudges too long","Forgives too quickly",
    "Collects buttons","Collects bottle corks","Collects lost notes",
    "Keeps letters tied with ribbon","Carries a child’s marble","Wears a friend’s locket"
  ];
// --- TRAIT (DA) — 100 stk. ---
const TRAIT_DA = [
    "Bærer altid en lykketing","Fører en omhyggelig dagbog","Samler på skinnende sten",
    "Er bange for torden","Griner på mærkelige tidspunkter","Bryder aldrig øjenkontakt",
    "Fløjter ofte","Nynner mellem sætninger","Taler til planter",
    "Giver sine våben navne","Overpudser støvler","Lugter svagt af røg",
    "Lugter af havsalt","Lugter af blæk og pergament","Lugter af urter",
    "Bærer alt for mange ringe","Har umage sokker på","Bærer handsker i al slags vejr",
    "Hader at gå med hat","Bærer altid et tørklæde","Har en enkelt sort handske",
    "Piller ved en mønt","Vender en dolk rutineret","Leget med dirke",
    "Klikker med tungen før tale","Knækker knoer tit","Bider sig i læben når de tænker",
    "Knirker øjnene sammen som nærsynet","Hælder hovedet når de lytter","Ser ud i det fjerne",
    "Trommer utålmodigt med foden","Tæller skridt højt","Mimer andres ord",
    "Mumler noter til sig selv","Gentager sidste ord sagte","Slutter sætninger med et ordsprog",
    "Sutter tænder når irriteret","Ruller skuldre i cirkler","Gnider ofte sine tindinger",
    "Pacer i perfekte kvadrater","Arrangerer ting efter størrelse","Holder streng privat tidsplan",
    "Stiller for mange spørgsmål","Svar med flere spørgsmål","Overforklarer alting",
    "Giver alle øgenavne","Glemmer navne straks","Husker fødselsdage",
    "Hader høje lyde","Farer sammen ved pludselige lyde","Sover let",
    "Sover som en sten","Snorker som en bjørn","Taler i søvne",
    "Insisterer på morgenstræk","Brygger sin egen te-blanding","Bærer hjemmelavet trail-mix",
    "Vil ikke have mad der rører","Spiser først efter andre","Likker på fingeren for vind",
    "Gemmer alle kvitteringer","Pudser mønter før betaling","Prutter om prisen på alt",
    "Samler på rygter som trofæer","Fører regnskab over tjenester","Rider hak i staven for sejre",
    "Sætter sig aldrig med ryggen mod døren","Sætter sig altid ved et vindue","Undgår at træde på revner",
    "Hilser dyr først","Fodrer herreløse katte og hunde","Taler babysprog til dyr",
    "Nægter at slå insekter ihjel","Presser blomster i en bog","Bærer en tørret blomst i hatten",
    "Fletter hår med sejlgarn","Har en fjer bag øret","Bærer en amulet mod forbandelser",
    "Tegner kort over alle steder","Skitserer folk uden at tænke","Skriver poesi på lapper",
    "Skærer små runer i træ","Binder knuder når nervøs","Øver knob for sjov",
    "Samler på nøgler uden låse","Bærer på et bundt bånd","Binder huskebånd om fingre",
    "Klikker hælene sammen, når glad","Smækker med fingrene for fokus","Klapper én gang for at beslutte",
    "Drejer en ring, når de lyver","Blinker før dårlige idéer","Skjuler smil bag hånden",
    "Skjuler latter bag et host","Fniser på forkerte tidspunkter","Sukker teatralsk",
    "Himler med øjnene og undskylder","Siger undskyld for alt","Takker folk overdrevent",
    "Velsigner nys på tre sprog","Bander på døde tungemål","Beder før måltider",
    "Ønsker ved solnedgang","Hilsner månen","Tæller stjerner for at falde i søvn",
    "Siger aldrig nej til en udfordring","Meldes altid først","Hader at være nummer to",
    "Holder løfter til det ekstreme","Bærer nag alt for længe","Tilgiver alt for hurtigt",
    "Samler på knapper","Samler på korkpropper","Samler på tabte sedler",
    "Gemmer breve bundet med bånd","Bærer et barns glaskugle","Går med en vens medaljon"
  ];


/** =========================================================
 *  Gender (weighted) + hidden-gender races
 * ======================================================= */
// ===================== START: GENDER LABELS (EN/DA) =====================
const GENDER_LABELS = {
  en: {
    Male: "Male",
    Female: "Female",
    "Non-binary": "Non-binary",
    Hermaphrodite: "Hermaphrodite",
  },
  da: {
    Male: "Mand",
    Female: "Kvinde",
    "Non-binary": "non-binær",
    Hermaphrodite: "hermafrodit",
  },
};
// ===================== SLUT: GENDER LABELS (EN/DA) =====================
const GENDERS = ["Male", "Female", "Non-binary", "Hermaphrodite"];
function weightedGender() {
  const r = Math.random() * 100;
  if (r < 48) return "Male";
  if (r < 96) return "Female";
  if (r < 98) return "Non-binary";
  return "Hermaphrodite";
}
const genderHiddenRaces = new Set(["Dragonborn", "Lizardfolk", "Kobold"]);
// ===================== START: displayGenderFor (med sprog) =====================
function displayGenderFor(race, gender, tr, lang = "en") {
  // Skjult køn for visse racer = "Uoplyst"/"Unrevealed"
  if (genderHiddenRaces.has(race)) return tr.genderUnrevealed;

  // Mappet visningslabel per sprog
  const dict = GENDER_LABELS[lang] || GENDER_LABELS.en;
  return dict[gender] ?? gender; // fallback til rå værdi hvis ukendt
}
// ===================== SLUT: displayGenderFor (med sprog) =====================

/** =========================================================
 *  Races (weighted)
 * ======================================================= */
const races = [
  "Human","Half-Elf","High Elf","Wood Elf","Dark Elf (Drow)","Mountain Dwarf","Hill Dwarf",
  "Lightfoot Halfling","Stout Halfling","Forest Gnome","Rock Gnome","Half-Orc","Orc","Tiefling",
  "Dragonborn","Aasimar","Tabaxi","Tortle","Kenku","Kobold","Goliath","Firbolg",
  "Genasi (Air)","Genasi (Earth)","Genasi (Fire)","Genasi (Water)","Loxodon","Leonin","Minotaur",
  "Changeling","Shifter","Warforged","Vedalken","Owlin","Harengon","Satyr","Triton",
  "Yuan-ti Pureblood","Lizardfolk","Bugbear","Goblin","Hobgoblin","Kalashtar",
];
const raceWeights = {
  Human: 40,
  "Half-Elf": 6, "High Elf": 6, "Wood Elf": 6, "Dark Elf (Drow)": 4,
  "Mountain Dwarf": 6, "Hill Dwarf": 6, "Lightfoot Halfling": 4, "Stout Halfling": 4,
  "Forest Gnome": 4, "Rock Gnome": 4, "Half-Orc": 4, Orc: 3, Tiefling: 3, Dragonborn: 3, Aasimar: 3,
};

/** =========================================================
 *  Helpers
 * ======================================================= */


const roll = (arr, fallback = "") => {
  if (!Array.isArray(arr) || arr.length === 0) return fallback;
  return arr[Math.floor(Math.random() * arr.length)];
};

const FIRST_MALE = ["Alric","Tomas","Cedric","Willem","Marcus","Victor","Joran","Edric","Rowan","Gareth"];
const FIRST_FEMALE = ["Elira","Selene","Mara","Fiona","Katarina","Isolde","Lydia","Clara","Helena","Amelia"];
const SURNAMES = ["Blackwood","Fairweather","Ravenshadow","Ashford","Thorne","Hawke","Kingsley","Storme","Flint","Hartwell"];

function generateName(race, gender) {
  const firstPool =
    gender === "Female" ? FIRST_FEMALE
    : gender === "Male"   ? FIRST_MALE
    : [...FIRST_MALE, ...FIRST_FEMALE];
  const first = roll(firstPool);
  const last = roll(SURNAMES);
  return `${first} ${last}`;
}

function seedFromString(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 99999) + 1;
}

function raceDescriptor(race) {
  const map = {
    "Human": "ordinary human, medieval fantasy clothing",
    "Half-Elf": "half elf half human, subtle pointed ears, graceful features",
    "High Elf": "tall, slender elf, long pointed ears, elegant noble clothing, glowing presence",
    "Wood Elf": "forest elf, green and brown clothing, natural camouflage, agile build",
    "Dark Elf (Drow)": "dark-skinned elf, white hair, glowing red eyes, underdark attire",
    "Mountain Dwarf": "short and stocky dwarf, thick beard, heavy armor, miner’s build",
    "Hill Dwarf": "stout dwarf, ruddy complexion, braided beard, earthy clothing",
    "Lightfoot Halfling": "small halfling, cheerful expression, curly hair, travel clothes",
    "Stout Halfling": "short and sturdy halfling, round features, simple rustic attire",
    "Forest Gnome": "tiny gnome, mischievous, bright eyes, woodland clothing",
    "Rock Gnome": "small gnome, tinkerer, tools and gadgets, soot-stained clothes",
    "Half-Orc": "tall and muscular, grey-green skin, tusks, tribal scars",
    "Orc": "large brutish orc, green skin, tusks, muscular body, crude armor",
    "Tiefling": "humanoid with horns, tail, unusual skin colors, glowing eyes",
    "Dragonborn": "reptilian humanoid, dragon head, scales, muscular build, clawed hands",
    "Aasimar": "radiant humanoid, glowing eyes, faint halo, angelic presence",
    "Tabaxi": "humanoid feline, fur-covered body, cat head with whiskers, agile build",
    "Tortle": "humanoid turtle, large shell, scaled skin, beak-like mouth",
    "Kenku": "humanoid crow, black feathers, beak, cloaked in rags",
    "Kobold": "small reptilian humanoid, scaly skin, sharp teeth, mischievous",
    "Goliath": "giant humanoid, grey mottled skin, tribal tattoos, towering build",
    "Firbolg": "tall giantkin, blue-grey skin, long ears, bovine nose, druidic clothing",
    "Genasi (Air)": "humanoid infused with air, swirling hair like wind, glowing blue eyes",
    "Genasi (Earth)": "stone-skinned humanoid, rocky features, moss or crystals growing on skin",
    "Genasi (Fire)": "flame-haired humanoid, glowing eyes, skin like cooling lava",
    "Genasi (Water)": "aquatic humanoid, flowing hair like water, blue-green skin",
    "Loxodon": "elephant-headed humanoid, tusks, trunk, decorated robes",
    "Leonin": "lion-headed humanoid, furred body, feline features, muscular warrior",
    "Minotaur": "bull-headed humanoid, massive horns, muscular frame, tribal attire",
    "Changeling": "pale shapeshifter, featureless face, shifting expressions",
    "Shifter": "bestial humanoid, wolf-like or feline traits, glowing eyes, wild features",
    "Warforged": "living construct, armored body, mechanical limbs, glowing core",
    "Vedalken": "blue-skinned humanoid, hairless, intelligent and calm expression",
    "Owlin": "owl-headed humanoid, feathered body, wings, large expressive eyes",
    "Harengon": "rabbitfolk humanoid, long ears, fur-covered body, springy legs",
    "Satyr": "goat-legged humanoid, horns, mischievous grin, pipes or lute",
    "Triton": "amphibious humanoid, blue-green skin, webbed hands, finned head crest",
    "Yuan-ti Pureblood": "serpentine humanoid, reptilian eyes, faint scales, sinister aura",
    "Lizardfolk": "reptilian humanoid, scaled skin, crocodile-like features, primitive weapons",
    "Bugbear": "large goblinoid, shaggy fur, long arms, menacing expression",
    "Goblin": "small goblinoid, green skin, sharp teeth, mischievous grin",
    "Hobgoblin": "taller goblinoid, orange skin, martial armor, disciplined stance",
    "Kalashtar": "mystical humanoid, glowing eyes, ethereal aura, psychic presence",
  };
  return map[race] || race;
}

function buildMidjourneyPromptWeb(npc) {
  const genderOut = displayGenderFor(npc.race, npc.gender, t.en);
  const parts = [
    "fantasy character portrait, head & shoulders, D&D style",
   `${raceDescriptor(npc.race)}, ${genderOut} ${npc.profession}`,
    `${npc.demeanor}`,
    ` ${npc.appearance}`,
    
    ` ${npc.movement}`,
    "rich lighting, photorealistic, painterly detail, sharp focus, neutral background, subtle costume matching the role, color harmony, (no modern items), (no text)"
  ];
  const seed = seedFromString(npc.name || `${npc.race}-${npc.profession}`);
  return `${parts.join(", ")} --ar 2:3 --v 6 --style raw --s 250 --seed ${seed}`;
}


const weightedRoll = (items, weightMap = {}) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  const weights = items.map(it => (Number.isFinite(weightMap[it]) ? weightMap[it] : 1));
  const total = weights.reduce((a, b) => a + b, 0) || items.length;
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}
function buildPerchancePrompt(npc) {
  const {
    name = "",
    gender = "",
    race = "",
    profession = "",
    appearance = "",
    voice = "",
    movement = "",
    demeanor = "",
    persona = "",
    trait = "",
  } = npc || {};

  const lines = [
    // Garanterer portrait/fantasy-portrait vibe
    "fantasy portrait, portrait orientation, head-and-shoulders, highly detailed, sharp focus",
    race && `race: ${race}`,
    gender && `gender: ${gender}`,
    profession && `profession: ${profession}`,
    appearance && `appearance: ${appearance}`,
    voice && `voice/personality hint: ${voice}`,
    movement && `movement/posture: ${movement}`,
    demeanor && `demeanor: ${demeanor}`,
    persona && `persona: ${persona}`,
    trait && `distinct trait: ${trait}`,
    "studio lighting, soft rim light, subtle depth of field, natural skin texture",
  ].filter(Boolean);

  return lines.join(", ");
}


async function tryCopyToClipboard(text) {
  // 1) Moderne API
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // fortsæt til fallback
  }

  // 2) Fallback (Safari/ældre)
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (ok) return true;
  } catch (e) {
    // fortsæt til sidste fallback
  }

  // 3) Sidste udvej
  alert("Kunne ikke kopiere automatisk.\nMarker og kopier prompten manuelt.");
  return false;
}


/** =========================================================
 *  getTables (vi bevarer SPEECH/PITCH til at bygge 'voice')
 * ======================================================= */
function getTables(lang) {
  if (lang === "da") {
    return {
      professions: PROFESSIONS_DA,
      appearances: APPEARANCE_DA,
      movement:    MOVEMENT_DA,
      demeanor:    DEMEANOR_DA,
      persona:     PERSONA_DA,   // <-- vigtigt: arrays hedder PERSONA_DA/EN
      trait:       TRAIT_DA,     // <-- vigtigt: arrays hedder TRAIT_DA/EN
      speech:      SPEECH_DA,    // <-- nødvendig til Voice
      pitch:       PITCH_DA,     // <-- nødvendig til Voice
    };
  }
  return {
    professions: PROFESSIONS_EN,
    appearances: APPEARANCE_EN,
    movement:    MOVEMENT_EN,
    demeanor:    DEMEANOR_EN,
    persona:     PERSONA_EN,
    trait:       TRAIT_EN,
    speech:      SPEECH_EN,
    pitch:       PITCH_EN,
  };
}

// Oversæt "voice" ved sprogskift (format tidligere "<speech> • <pitch>", nu "<speech> <pitch>")
function translateVoice(voice, fromPitch, toPitch, fromSpeech, toSpeech) {
  if (!voice) return voice;

  // 1) Prøv legacy-delimiter først for bagudkompatibilitet
  if (voice.includes(" • ")) {
    const [speechPart, pitchPart] = voice.split(" • ");
    return [
      translateValue(speechPart, fromSpeech, toSpeech),
      translateValue(pitchPart,  fromPitch,  toPitch),
    ].filter(Boolean).join(" ");
  }

  // 2) Robust uden delimiter:
  // Find den længste pitch i fromPitch der matcher som SUFFIX
  let matchedPitch = "";
  for (const p of [...fromPitch].sort((a,b) => b.length - a.length)) {
    if (voice.endsWith(p)) { matchedPitch = p; break; }
  }

  let speechPart = voice;
  let pitchPart  = "";
  if (matchedPitch) {
    pitchPart  = matchedPitch;
    speechPart = voice.slice(0, voice.length - matchedPitch.length).trim();
    // Fjern evt. ekstra mellemrum før pitch
    if (speechPart.endsWith(",") || speechPart.endsWith(";")) {
      speechPart = speechPart.slice(0, -1).trim();
    }
  }

  const newSpeech = translateValue(speechPart, fromSpeech, toSpeech);
  const newPitch  = translateValue(pitchPart,  fromPitch,  toPitch);

  return [newSpeech, newPitch].filter(Boolean).join(" ");
}
function translateValue(val, fromArr, toArr) {
  if (!val) return val;
  const i = fromArr.indexOf(val);
  if (i !== -1 && i < toArr.length) return toArr[i];
  if (toArr.includes(val)) return val;
  return val;
}

/** =========================================================
 *  State hooks
 * ======================================================= */
function useNPC() {
  const [history, setHistory] = useState([]);
const [currentIndex, setCurrentIndex] = useState(-1);

useEffect(() => {
  if (history.length === 0) {
    const tables = getTables("da");
    const buildVoiceInit = () => {
      const s = roll(tables.speech);
      const p = roll(tables.pitch);
      return `${s} ${p}`;
    };
    const seed = {
      name:       generateName("Human", "Male"),
      gender:     weightedGender(),
      race:       weightedRoll(races, raceWeights),
      profession: roll(tables.professions),
      appearance: roll(tables.appearances),
      voice:      buildVoiceInit(),
      movement:   roll(tables.movement),
      demeanor:   roll(tables.demeanor),
      persona:    roll(tables.persona),
      trait:      roll(tables.trait),
    };
    setHistory([seed]);
    setCurrentIndex(0);
  }
}, [history.length]);

  const npc = history[currentIndex] || null;
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const push = (next) => {
    setHistory((h) => {
      const trimmed = h.slice(0, currentIndex + 1);
      return [...trimmed, next];
    });
    setCurrentIndex((i) => i + 1);
  };

  const buildVoice = (tables) => {
    const s = roll(tables.speech);
    const p = roll(tables.pitch);
    return `${s} ${p}`;
  };

  const generateAll = (locks, tables, prev) => {
    const gender = locks?.gender && prev ? prev.gender : weightedGender();
    const race   = locks?.race   && prev ? prev.race   : weightedRoll(races, raceWeights);
    return {
      name:       locks?.name       && prev ? prev.name       : generateName(race, gender),
      gender,
      race,
      profession: locks?.profession && prev ? prev.profession : roll(tables.professions),
      appearance: locks?.appearance && prev ? prev.appearance : roll(tables.appearances),
      voice:      locks?.voice      && prev ? prev.voice      : buildVoice(tables),
      movement:   locks?.movement   && prev ? prev.movement   : roll(tables.movement),
      demeanor:   locks?.demeanor   && prev ? prev.demeanor   : roll(tables.demeanor),
      persona:    locks?.persona    && prev ? prev.persona    : roll(tables.persona),
      trait:      locks?.trait      && prev ? prev.trait      : roll(tables.trait),
    };
  };

  const rerollAll = (locks, tables) => {
    const next = generateAll(locks, tables, npc);
    push(next);
  };

  const rerollField = (fieldKey, locks, tables) => {
    const prev = npc;
    if (!prev) return;
    if (locks?.[fieldKey]) return;

    const next = { ...prev };
    if (fieldKey === "gender") {
      next.gender = weightedGender();
      if (!locks?.name) next.name = generateName(next.race, next.gender);
    } else if (fieldKey === "race") {
      next.race = weightedRoll(races, raceWeights);
      if (!locks?.name) next.name = generateName(next.race, next.gender);
    } else if (fieldKey === "name") {
      next.name = generateName(prev.race, prev.gender);
    } else if (fieldKey === "voice") {
      next.voice = buildVoice(tables);
    } else {
      const source = {
        profession: tables.professions,
        appearance: tables.appearances,
        movement:   tables.movement,
        demeanor:   tables.demeanor,
        persona:    tables.persona,
        trait:      tables.trait,
      }[fieldKey];
      if (Array.isArray(source)) next[fieldKey] = roll(source);
    }
    push(next);
  };

  const undo = () => { if (canUndo) setCurrentIndex((i) => i - 1); };
  const redo = () => { if (canRedo) setCurrentIndex((i) => i + 1); };

  const replaceCurrent = useCallback((updater) => {
  setHistory((h) => {
    if (h.length === 0 || currentIndex < 0) return h;
    const curr = h[currentIndex];
    const next = typeof updater === "function" ? updater(curr) : updater;
    const copy = h.slice();
    copy[currentIndex] = next;
    return copy;
  });
}, [currentIndex]);

  // Første NPC


 return { npc, rerollAll, rerollField, undo, redo, canUndo, canRedo, replaceCurrent };
}

/** =========================================================
 *  Component
 * ======================================================= */
export default function DnDNpcGenerator() {
  const [lang, setLang] = useState("da");
  const tr = t[lang];
  const tables = useMemo(() => getTables(lang), [lang]);

  const [locks, setLocks] = useState({
    name: false, gender: false, race: false, profession: false,
    appearance: false, voice: false, movement: false, demeanor: false,
    persona: false, trait: false,
  });

  const { npc, rerollAll, rerollField, undo, redo, canUndo, canRedo, replaceCurrent } = useNPC();

  // ----------------- SPROGSKIFT (oversættelse af værdier) -----------------
  const prevLangRef = useRef(lang);
  useEffect(() => {
    if (!npc) return;
    if (prevLangRef.current === lang) return;

    const fromTables = prevLangRef.current === "da"
      ? {
          professions: PROFESSIONS_DA, appearances: APPEARANCE_DA, movement: MOVEMENT_DA,
          demeanor: DEMEANOR_DA, persona: PERSONA_DA, trait: TRAIT_DA,
          speech: SPEECH_DA, pitch: PITCH_DA,
        }
      : {
          professions: PROFESSIONS_EN, appearances: APPEARANCE_EN, movement: MOVEMENT_EN,
          demeanor: DEMEANOR_EN, persona: PERSONA_EN, trait: TRAIT_EN,
          speech: SPEECH_EN, pitch: PITCH_EN,
        };

    const updated = {
      ...npc,
      profession: locks.profession ? npc.profession : translateValue(npc.profession, fromTables.professions, tables.professions),
      appearance: locks.appearance ? npc.appearance : translateValue(npc.appearance, fromTables.appearances, tables.appearances),
      movement:   locks.movement   ? npc.movement   : translateValue(npc.movement,   fromTables.movement,   tables.movement),
      demeanor:   locks.demeanor   ? npc.demeanor   : translateValue(npc.demeanor,   fromTables.demeanor,   tables.demeanor),
      persona:    locks.persona    ? npc.persona    : translateValue(npc.persona,    fromTables.persona,    tables.persona),
      trait:      locks.trait      ? npc.trait      : translateValue(npc.trait,      fromTables.trait,      tables.trait),
      voice:      locks.voice      ? npc.voice      : translateVoice(npc.voice, fromTables.pitch, tables.pitch, fromTables.speech, tables.speech),
    };

    replaceCurrent(updated);
    prevLangRef.current = lang;
  }, [lang, npc, replaceCurrent, locks, tables]);

  // ----------------- OUTPUTS -----------------
  const textOut = useMemo(() => {
    if (!npc) return "";
    return `${tr.fields.name}: ${npc.name}
${tr.fields.gender}: ${displayGenderFor(npc.race, npc.gender, tr, lang)}
${tr.fields.race}: ${npc.race}
${tr.fields.profession}: ${npc.profession}
${tr.fields.appearance}: ${npc.appearance}
${tr.fields.voice}: ${npc.voice}
${tr.fields.movement}: ${npc.movement}
${tr.fields.demeanor}: ${npc.demeanor}
${tr.fields.persona}: ${npc.persona}
${tr.fields.trait}: ${npc.trait}`;
  }, [npc, tr]);

 // ----------------- HANDLERS (kopi + låse) -----------------

// Links – ret dem gerne til dine foretrukne destinationssider
const MIDJOURNEY_URL = "https://www.midjourney.com/";
const PERCHANCE_URL  = "https://perchance.org/ai";

const openAndCopy = (url, prompt) => {
  tryCopyToClipboard(prompt);
  // Åbn i ny fane uden at lække referrer
  window.open(url, "_blank", "noopener,noreferrer");
};

const handleOpenMidjourney = () => {
  if (!npc) return;
  const mj = buildMidjourneyPromptWeb(npc);
  openAndCopy(MIDJOURNEY_URL, mj);
};

const handleOpenPerchance = () => {
  if (!npc) return;
  // Som ønsket: også Perchance kopierer *Midjourney*-prompten
  const mj = buildMidjourneyPromptWeb(npc);
  openAndCopy(PERCHANCE_URL, mj);
};

 // Global lock/unlock
const lockAll = () => {
  setLocks({
    name: true, gender: true, race: true, profession: true,
    appearance: true, voice: true, movement: true, demeanor: true,
    persona: true, trait: true,
  });
};

const unlockAll = () => {
  setLocks({
    name: false, gender: false, race: false, profession: false,
    appearance: false, voice: false, movement: false, demeanor: false,
    persona: false, trait: false,
  });
};

// Reroll alle felter (respekterer locks)
const handleRollAll = () => {
  rerollAll(locks, tables);
};

// Kopiér-helpers
const handleCopyText = () => {
  if (!npc) return;
  tryCopyToClipboard(textOut);
};

const handleCopyMJ = () => {
  if (!npc) return;
  const mj = buildMidjourneyPromptWeb(npc);
  tryCopyToClipboard(mj);
};

const handleCopyPerchance = () => {
  if (!npc) return;
  const base = buildPerchancePrompt(npc);
  // Tilføj "(perchance)" til sidst så det er tydeligt hvad prompten er til
  tryCopyToClipboard(`${base} (perchance)`);
};

// Toggle et enkelt lock
const toggleLock = (key) => {
  setLocks((l) => ({ ...l, [key]: !l[key] }));
};

// ----------------- SLUT: HANDLERS -----------------

// ---------------------------------------------------------------
// START på TIDLIG RETURN-BLOK (loading/ingen npc endnu)
// ---------------------------------------------------------------
if (!npc) {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-900 text-slate-300">
      <div className="text-center space-y-2">
        <div className="animate-pulse text-lg">Loading NPC…</div>
        <div className="text-xs opacity-70">Generatoren initialiseres</div>
      </div>
    </div>
  );
}
// ---------------------------------------------------------------
// SLUT på TIDLIG RETURN-BLOK
// ---------------------------------------------------------------

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* Top bar med sprog */}
      <div className="flex justify-center gap-2">
        <button
          className={`px-3 py-1.5 rounded-lg ${lang === "en" ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-200"} `}
          onClick={() => setLang("en")}
        >
          EN
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg ${lang === "da" ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-200"} `}
          onClick={() => setLang("da")}
        >
          DA
        </button>
      </div>

      {/* Header med centreret tekst */}
<header className="text-center">
  {/* Titel */}
  <h1 className="text-5xl font-bold text-indigo-400 drop-shadow-lg tracking-wide">
    {tr.appTitle}
  </h1>

  {/* Undertitel */}
  <p className="text-lg text-slate-400 mt-2">
    {tr.subtitle}{" "}
    <a
      href="https://asaheim.dk"
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-400 hover:text-emerald-300 font-semibold"
    >
      asaheim.dk
    </a>
  </p>
</header>

      {/* Grid med NPC-felter */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldCard label={tr.fields.name} value={npc.name} locked={locks.name} onLock={() => toggleLock("name")} onReroll={() => rerollField("name", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.gender} value={displayGenderFor(npc.race, npc.gender, tr, lang)} locked={locks.gender} onLock={() => toggleLock("gender")} onReroll={() => rerollField("gender", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.race} value={npc.race} locked={locks.race} onLock={() => toggleLock("race")} onReroll={() => rerollField("race", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.profession} value={npc.profession} locked={locks.profession} onLock={() => toggleLock("profession")} onReroll={() => rerollField("profession", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.appearance} value={npc.appearance} locked={locks.appearance} onLock={() => toggleLock("appearance")} onReroll={() => rerollField("appearance", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.voice} value={npc.voice} locked={locks.voice} onLock={() => toggleLock("voice")} onReroll={() => rerollField("voice", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.movement} value={npc.movement} locked={locks.movement} onLock={() => toggleLock("movement")} onReroll={() => rerollField("movement", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.demeanor} value={npc.demeanor} locked={locks.demeanor} onLock={() => toggleLock("demeanor")} onReroll={() => rerollField("demeanor", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.persona} value={npc.persona} locked={locks.persona} onLock={() => toggleLock("persona")} onReroll={() => rerollField("persona", locks, tables)} tr={tr} />
        <FieldCard label={tr.fields.trait} value={npc.trait} locked={locks.trait} onLock={() => toggleLock("trait")} onReroll={() => rerollField("trait", locks, tables)} tr={tr} />
      </section>

      {/* Actions */}
      <section className="space-y-4 text-center">

        {/* Rul! */}
        <div>
          <button
            className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold"
            onClick={() => rerollAll(locks, tables)}
          >
            {tr.buttons.roll}
          </button>
        </div>

        {/* Fortryd / Gendan */}
        <div className="flex justify-center gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50"
            onClick={undo}
            disabled={!canUndo}
          >
            <UndoIcon className="w-4 h-4 inline mr-1" />
            Fortryd
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50"
            onClick={redo}
            disabled={!canRedo}
          >
            <RedoIcon className="w-4 h-4 inline mr-1" />
            Gendan
          </button>
        </div>

        {/* Lås alle / Lås alle op */}
        <div className="flex justify-center gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            onClick={lockAll}
          >
            <Lock className="w-4 h-4 inline mr-1" />
            {tr.buttons.lockAll}
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
            onClick={unlockAll}
          >
            <Unlock className="w-4 h-4 inline mr-1" />
            {tr.buttons.unlockAll}
          </button>
        </div>

        {/* Kopier-knapper */}
        <div className="flex justify-center gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
            onClick={handleCopyText}
          >
            <Copy className="w-4 h-4 inline mr-1" />
            {tr.buttons.copyText}
          </button>

          {/* Midjourney */}
          <button
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={() => {
              if (!npc) return;
              const mj = buildMidjourneyPromptWeb(npc);
              tryCopyToClipboard(mj);
              window.open("https://www.midjourney.com/imagine", "_blank");
            }}
          >
            <Copy className="w-4 h-4 inline mr-1" />
            {tr.buttons.copyMJ}
          </button>

          {/* Perchance */}
          <button
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={() => {
              if (!npc) return;
              const mj = buildMidjourneyPromptWeb(npc); // samme prompt som MJ
              tryCopyToClipboard(mj);
              window.open("https://perchance.org/ai-text-to-image-generator", "_blank");
            }}
          >
            <Copy className="w-4 h-4 inline mr-1" />
            {tr.buttons.perchance}
          </button>
        </div>
      </section>

      {/* Output */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">{tr.outputTitle}</h2>
        <pre className="whitespace-pre-wrap text-slate-200 text-sm">{textOut}</pre>
      </section>
    </div>
  </div>
);}
// ---------------------------------------------------------------
// SLUT på return-blokken
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// SLUT på HOVED-return-blokken
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// SLUT på hele funktionen DnDNpcGenerator
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// FieldCard komponent starter herunder
// ---------------------------------------------------------------
function FieldCard({ label, value, locked, onLock, onReroll, tr }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wide">{label}</h3>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              locked ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-slate-600 text-slate-200 hover:bg-slate-500"
            }`}
            onClick={onReroll}
            disabled={locked}
            title={tr.buttons.rollOne}
          >
            <Shuffle className="w-3 h-3 inline mr-1" />
            {tr.buttons.rollOne}
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              locked ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-600 text-slate-300 hover:bg-slate-500"
            }`}
            onClick={onLock}
          >
            {locked ? (
              <>
                <Lock className="w-3 h-3 inline mr-1" />
                {tr.common.locked}
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 inline mr-1" />
                {tr.common.lock}
              </>
            )}
          </button>
        </div>
      </div>
      <p className="text-slate-200 leading-relaxed">{value}</p>
    </div>
  );
}
