<h1 align="center">
    <img src="https://www.nav.no/_/asset/no.nav.navno:1575554845/img/navno/logo.svg" />
    <br/>package-crawler
</h1>

<div align="center">
    <p>
        Crawler for generering av data og statistikk for designsystemet. Vil i første omgang finne alle dependencies brukt i NAV sine repos og skrive dataen til en outputfil for videre prosessering.
    </p>
    <p>
      <a href="https://github.com/navikt/package-crawler/projects/1">
          <img src="https://progress-bar.dev/20?title=Completed" />
      </a>
    </p>
</div>

## Funksjon

Går gjennom alle repos i en github org og henter ut alle dependencies de bruker. Løser dette ved å laste ned alle repoene og gjennomgå dem lokalt.
For Designsystemet sitt bruk går den gjennom alle repoene i `navikt` organisasjonen og henter ut dependencies som blir brukt.

## Bakgrunn

Vi i designsystemet ønsker mer informasjon om bruken av våre komponenter innenfor NAV, samt hvordan vi kan forbedre bruken og brukeropplevelsen rundt våre komponenter. For å gjøre dette trengs det statistikk og data.

## Kjøring av crawler

1. `Installer Node.js, yarn og typescript lokalt om ikke allerede gjort.`
2. `Konfiguer config.ts for endring av org, blacklists etc`
3. `Lag en .env fil i root og sett variablene for TOKEN, AGENT og ORG. (https://github.com/motdotla/dotenv)`
4. `yarn install`
5. `tsc`
6. `yarn run crawler`


### .env eksempel
```
TOKEN=GITHUB_OAUTH_TOKEN
AGENT=NAV-Designsystemet-crawler
ORG=navikt
```

## Kjøring av webside

1. yarn install
2. yarn run website

## Kontakt

Henvendelser tas gjerne imot under issues her på Github.

## Lisens

Gå til [LICENSE](https://github.com/navikt/package-crawler/blob/master/LICENSE)
