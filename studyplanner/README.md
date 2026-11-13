# StudyPlanner

Mokymosi planavimo ir užduočių valdymo sistema, skirta mokiniams ir studentams. Programa leidžia kurti, redaguoti, šalinti ir rūšiuoti užduotis, nustatyti jų terminus bei prioritetus, keisti būsenas ir stebėti mokymosi pažangą.

## Naudojamos technologijos

- React ir TypeScript – naudotojo sąsajai ir programos logikai.
- Vite 8.3.8 – projekto kūrimui ir paleidimui.
- LocalStorage – užduočių saugojimui naršyklėje.
- Vitest 5.1.0 – automatiniams testams.
- Node.js ir npm – projekto priklausomybėms ir paleidimui.
- Node.js v22.22.3 – JavaScript vykdymo aplinka.
- npm 10.9.8 – priklausomybių valdymui.

## Pagrindinės funkcijos

- Užduočių kūrimas, redagavimas ir šalinimas.
- Užduočių terminų ir prioritetų valdymas.
- Užduočių būsenos keitimas.
- Vėluojančių užduočių nustatymas.
- Mokymosi pažangos skaičiavimas procentais.
- Užduočių rūšiavimas pagal terminą ir prioritetą.
- Duomenų išsaugojimas naršyklėje.
- Dviejų pavyzdinių klientų duomenų atskyrimas.

## Projekto paleidimas

Reikalinga suderinama Node.js versija ir npm. Naudotą Node.js ir npm versiją galima patikrinti komandomis:

```bash
node -v
npm -v
```

Projektas kurtas naudojant:
- Node.js v22.22.3
- npm 10.9.8

Atsisiuntus projektą, pirmą kartą reikia įdiegti priklausomybes:

```bash
npm install
```

Tada programa paleidžiama viena komanda:

```bash
npm run dev
```

Naršyklėje atidaromas terminale nurodytas adresas, įprastai:

http://localhost:5173/

## Automatiniai testai

Testams naudojama Vitest biblioteka.

Testų paleidimo komanda:

```bash
npx vitest run
```

Realizuoti 5 automatiniai testai:

1. Užduoties sukūrimas su teisingais duomenimis.
2. Mokymosi pažangos apskaičiavimas.
3. Užduoties be pavadinimo atmetimas.
4. Vėluojančios užduoties nustatymas.
5. Klientų duomenų izoliavimo patikrinimas.

Visi 5 testai sėkmingai atlikti.

## Pavyzdiniai duomenys

Prototipe naudojami du iš anksto paruošti klientai:

**Studentų grupė A**
- Parengti Java laboratorinį darbą.
- Pakartoti duomenų struktūras.
- Užbaigti projektą.

**Studentų grupė B**
- Parengti matematikos pristatymą.
- Atlikti duomenų bazės užduotį.

Kiekviena užduotis turi klientui priklausantį `clientId`. Užduočių valdymo metodai tikrina šią priklausomybę ir neleidžia vieno kliento kontekste pakeisti ar pašalinti kito kliento užduočių.

Klientai pasirenkami demonstravimo tikslais. Prisijungimo ir autentifikavimo sistema šiame prototipe nerealizuota.

## Demonstravimo scenarijus

1. Paleisti programą.
2. Pasirinkti „Studentų grupė A“.
3. Sukurti naują užduotį, nurodant pavadinimą, terminą ir prioritetą.
4. Pakeisti užduoties būseną į „Atlikta“ ir parodyti pasikeitusį pažangos procentą.
5. Pabandyti sukurti užduotį be pavadinimo ir parodyti klaidos pranešimą.
6. Pasirinkti „Studentų grupė B“ ir parodyti kitą užduočių sąrašą.
7. Paleisti automatinius testus ir parodyti klientų duomenų izoliavimo testą.
8. Perkrauti puslapį ir parodyti, kad pakeitimai išliko.

## Projekto struktūra

- `src/models` – duomenų modeliai.
- `src/services` – užduočių valdymo ir saugojimo funkcijos.
- `src/utils` – validavimo, terminų ir pažangos skaičiavimo logika.
- `src/data` – pavyzdiniai klientai ir užduotys.
- `src/tests` – automatiniai testai.
- `src/App.tsx` – pagrindinė naudotojo sąsaja.

## Apribojimai

Duomenys saugomi naršyklės LocalStorage saugykloje, todėl išvalius naršyklės duomenis jie gali būti prarasti. Prototipas skirtas vietiniam demonstravimui ir neturi naudotojų autentifikavimo.

Pasirenkama DI funkcija šiame etape nerealizuota.