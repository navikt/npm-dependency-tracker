<h1 align="center">
    <img src="https://www.nav.no/_/asset/no.nav.navno:1575554845/img/navno/logo.svg" />
    <br/>Pakkebruk i Nav
</h1>

<div align="center">
    <p>
        Generering av data og statistikk for designsystemet.
    </p>
    <p>
      <a href="https://github.com/navikt/package-crawler/projects/1">
          <img src="https://progress-bar.dev/60?title=Completed" />
      </a>
    </p>
</div>

## Funksjon

### Crawler

Går gjennom alle repos i en github org og henter ut alle dependencies og commits der dependencies er endret. Laster ned alle repoene lokalt så trenger ~22GB plass på egen maskin. Generert output vil være på ~400MB

`./server/crawler`

### App

Genererer lesbar data og statistikk som blir servert på en frontend-løsning

`./server/src`
`./frontend`

## Bakgrunn

Vi i designsystemet ønsker mer informasjon om bruken av våre komponenter innenfor NAV, samt hvordan vi kan forbedre bruken og brukeropplevelsen rundt våre komponenter.

## Kjøring av crawler

1. `Konfiguer config.ts for endring av org, blacklists etc`
2. `Lag en .env fil i server og sett variablene for TOKEN, AGENT, ORG og NAME. (https://github.com/motdotla/dotenv)`
3. `yarn install`
4. `yarn run crawler`

    Note: Tar ca 30-40 min første gang man kjører, etter det tar det bare ~3min

### .env eksempel

```
TOKEN=GITHUB_OAUTH_TOKEN
AGENT=NAV-Designsystemet-crawler
ORG=navikt
NAME=GITHUB-USER-NAME
```

## Kjøring av app

1. `yarn install`
2. `yarn run dev`

    Note: Crawler må være kjørt før appen vil fungere

## Kontakt

Henvendelser tas gjerne imot under issues her på Github.

## Lisens

Gå til [LICENSE](https://github.com/navikt/package-crawler/blob/master/LICENSE)
