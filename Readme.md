# Spezifikation REST Webservice


| Ressource        | Methode | Semantik                                                         | content-type (req) | content-type(res)|
|------------------|---------|------------------------------------------------------------------|--------------------|------------------|
| /warenkorb:id    | GET     | Gibt Liste von Artikeln zurück                                   | text/plain         | applicaton/JSON  |
| /user:id         | GET     | Gibt den User mit der entsprechenden Id zurück                   | text/plain         | application/JSON |
| /users           | POST    | Gibt nur den User aus dem gepostetetn Jsondokument zurück.       | application/json   | text/plain       |
| /lagerknapp      | GET     | Gibt alle Artikel aus, welche weniger als 5 mal im Lager sind.   | text/plain         | application/JSON |
| /bewertung:id    | POST    | Bewertung eines bestimmten Artikels (anhand id) abgeben          | application/JSON   | text/plain       |
| /bewertung:id    | GET     | Bewertung eines bestimmten Artikels (anhand id) abfragen         | text/plain         | text/plain       |
| /artikel         | GET     | Alle Artikel anzeigen                                            | text/plain         | application/JSON |
| /artikel:id      | GET     | Einzelner Artikel mit genaueren Informationen+Bewertung anzeigen | text/plain         | application/JSON |
| /artikelnew      | POST    | Neue Artikel einstellen                                          | application/JSON   | text/plain       |
| /lager:id:anzahl | POST    | LAgerbestand zu bestimmten Artiekln updaten                      | application/JSON   | text/plain       |
