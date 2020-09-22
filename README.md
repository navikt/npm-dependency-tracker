<h1 align="center">
    <img src="https://www.nav.no/_/asset/no.nav.navno:1575554845/img/navno/logo.svg" />
    <br/>npm-dependency-tracker
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

`server/crawler`

### App

Genererer lesbar data og statistikk som blir servert på en frontend-løsning

> `yarn run prod` vil generere et prod-build og serveren vil servere react-siden gjennom expressjs. Vil starte en scheduler som oppdaterer dataen ved bruk av en crawler en gang om dagen, samt når appen starter.

Note: Hvis det er første gang du kjører appen vil dette ta 30+ minutter første gang, etter det 3-4 minutter.

## Bakgrunn

Vi i designsystemet ønsker mer informasjon om bruken av våre komponenter innenfor NAV, samt hvordan vi kan forbedre bruken og brukeropplevelsen rundt våre komponenter.

### .env eksempel

```
TOKEN=GITHUB_OAUTH_TOKEN
AGENT=NAV-Designsystemet-crawler
ORG=navikt
NAME=GITHUB-USER-NAME
```

## Kjøring av app

1. `yarn install`
2. `yarn run prod`

## Kontakt

Henvendelser tas gjerne imot under issues her på Github.

## Lisens

Gå til [LICENSE](https://github.com/navikt/package-crawler/blob/master/LICENSE)
