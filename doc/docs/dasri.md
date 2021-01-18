---
id: dasri
title: Cycle de vie du bordereau dasri
sidebar_label: Cycle de vie du Dasri
---
*Avertissement: l'implémentation Dasri et cette documentation constituent une version Beta et sont destinées à l'évaluation des intégrateurs* 

*Les Dasri sont à ce jour uniquement disponibles sur https://api.dasris.trackdechets.beta.gouv.fr/*

## Numéro de DASRI

Chaque DASRI est associé à un identifiant opaque unique. Cet identifiant correspond au champ `id` et doit être utilisé lors des différentes requêtes. En plus de l'identifiant opaque, un identifiant "lisible" est généré (champ `readableId`). Cet identifiant apparait sur le bordereau dans la case "Bordereau n°". L'identifiant est sous la forme `DASRY-{YYYYMMDD}-{identifiant aléatoire}` (Ex: `"DASRI-20210118-RTAQRJA6P"`). Il peut être utiliser pour récupérer l'identifiant opaque unique via la query `dasri`.

Vous pouvez également ajouter un identifiant qui vous est propre pour faire le lien avec votre SI. Il vous faut pour cela utiliser le champ `customId`.

## Concepts

Le mode opératoire est sensiblement différents de celui des BSDD.

Pour donner plus de flexibilité et limiter les mutations, les principes suivants sont adoptés:
- le nombre de mutation est reduit à 4: dasriCreate, dasriUpdate, dasriMarkAsReady, dasriSign
- la mutation dasriUpdate permet de mettre à jour les dasri pendant leur cycle de vie
- la mutation dasriSign (EMISSION, TRANSPORT, RECPTION, OPERATION) appose une signature ssur le cadre correspondant
- une fois qu'une signature est apposée, champs du cadre correspondant ne sont plus modifiables
- dasriSign (EMISSION) verrouille tous les champs emitter/emission
- dasriSign (TRANSPORT) verrouille tous les champs transporter/transport, sauf la date de remise à l'installation destinataire ({transport { handedOverAt}}
)
- dasriSign (RECEPTION) verrouille tous les champs recipient, et les champ reception
- dasriSign (OPERATION) les champ operation
- si le champ wasteAcceptation ({transport {wasteAcceptation}}) est REFUSED dasriSign (TRANSPORT) passe le dasri à l'état REFUSED
- si le champ wasteAcceptation ({reception {wasteAcceptation}}) est REFUSED dasriSign (RECEPTION) passe le dasri à l'état REFUSED
 

## États du DASRI

L'ensemble des champs du BSD numérique est décrit dans la [référence de l'API](api-reference.md#form). Au cours de son cycle de vie, un BSD numérique peut passer par différents états décrits [ici](api-reference.md#formstatus).

- `DRAFT` (brouillon): État initial à la création d'un DASRI.
- `SEALED` (finalisé): DASRI scellé (publié). Les données sont validées et un numéro de BSD `readableId` est affecté.
- `READY_FOR_TAKEOVER` (prêt à être emporté) : Dasri signé par l'émetteur
- `SENT` (envoyé): DASRI en transit vers l'installation de destination, d'entreposage ou de reconditionnement
- `RECEIVED` (reçu): DASRI reçu sur l'installation de destination, d'entreposage ou de reconditionnement
- `ACCEPTED` (accepté): DASRI accepté sur l'installation de destination, d'entreposage ou de reconditionnement
- `PROCESSED` (traité): DASRI dont l'opération de traitement a été effectué
- `REFUSED` (refusé): DASRI refusé, par le tranporteur ou le destinataire

<script src="https://unpkg.com/mermaid@8.1.0/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>

Le diagramme ci dessous retrace le cycle de vie d'un DASRI dans Trackdéchets:

<div class="mermaid">
graph TD
AO(NO STATE) -->|dasriCreate| A
A -->|"dasriUpdate (tous les champs)"| A
B -->|"dasriUpdate (tous les champs)"| B
C-->|"dasriUpdate (sauf champs signés)"| C
D-->|"dasriUpdate (sauf champs signés)"| D
E-->|"dasriUpdate (sauf champs signés)"| E
A[DRAFT] -->|dasriMarkAsReady| B(SEALED)
B -->|"dasriSign (EMISSION)"| C(READY_FOR_TAKEOVER)
B -->|"dasriSign (TRANSPORT) - si autorisé par émetteur" | D(SENT)
C -->|"dasriSign (TRANSPORT)"| D(SENT)
D -->|"dasriSign (RECEPTION)"| E(RECEIVED)
E -->|"dasriSign (OPERATION)"| F(PROCESSED)
D -->|"dasriSign (TRANSPORT *)"| G(REFUSED)
C -->|"dasriSign (RECEPTION *)"| G(REFUSED)

</div>

 \* si champ wasteAcceptation correspondant  est REFUSED
## Exemples

Vous pouvez consulter [ce test d'intégration](https://github.com/MTES-MCT/trackdechets/blob/master/back/src/forms/workflow/__tests__/workflow.integration.ts) écrit en Node.js pour voir des exemples concrets d'utilisation de l'API pour différents cas d'usage (acheminement direct du producteur à l'installation de traitement, entreposage provisoire, multi-modal, etc)

## DASRI au format pdf

A venir

## Flux de modifications de BSD

A venir
