
<h1 align="center">
    <img src="https://www.nav.no/_/asset/no.nav.navno:1575554845/img/navno/logo.svg" />
    <br/>package-crawler
</h1>

<div align="center">
    <p>
        Crawler for generering av data og statistikk for designsystemet. Vil lete etter komponentbruk i `package.json`
    </p>
    <p>
      <a href="https://github.com/navikt/package-crawler/pulls">
          <img src="https://img.shields.io/badge/PRs-welcome-green.svg" />
      </a>
    </p>
</div>

## Funksjon

Går gjennom alle repos i en github org og genererer data basert på dependencies som de bruker.

For Designsystemet sitt bruk går den gjennom alle repoene i `navikt` organisasjonen og sjekker om de bruker designsystemet sine komponenter 
samt om de holder dem oppdatert. 

## Bakgrunn
Vi i designsystemet ønsker mer informasjon om bruken av våre komponenter innenfor NAV, samt hvordan vi kan forbedre bruken og brukeropplevelsen rundt våre komponenter. For å gjøre dette trengs det statistikk og data.

## Bruk

1. `Installer Node.js and npm lokalt om ikke allerede gjort.`
2. `npm install`
3. `export token=DIN_GITHUB_TOKEN`
4. `npm start`

## Kontakt

Henvendelser tas gjerne imot under issues her på Github.

## Lisens

Gå til [LICENSE](https://github.com/navikt/package-crawler/blob/master/LICENSE)
