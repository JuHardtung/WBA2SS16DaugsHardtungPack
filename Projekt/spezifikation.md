

# Spezifikation REST Webservice


| Ressource        | Methode | Semantik                                                         | content-type (req) | content-type(res)|
|------------------|---------|------------------------------------------------------------------|--------------------|------------------|
| /warenkorb:id    | GET     | Gibt Liste von Artikeln zurück                                   | text/plain         | applicaton/JSON  |
| /user/:id        | GET     | Gibt den User mit der entsprechenden Id zurück                   | text/plain         | application/JSON |
| /users           | POST    | Gibt nur den User aus dem gepostetetn Jsondokument zurück.       | application/json   | text/plain       |
| /lagerknapp      | GET     | Gibt alle Artikel aus, welche weniger als 5 mal im Lager sind.   | text/plain         | application/JSON |
| /bewertung:id    | POST    | Bewertung eines bestimmten Artikels (anhand id) abgeben          | application/JSON   | text/plain       |
| /bewertung:id    | GET     | Bewertung eines bestimmten Artikels (anhand id) abfragen         | text/plain         | text/plain       |
| /cart{id}        | GET     | Gib den Warenkorb eines Benutzers aus                            | text/plain         | application/JSON |
| /cart{id}/add    | POST    | Artikel dem Warenkorb hinzufügen                                 | application/JSON   | application/JSON |
| /cart{id}/delete | GET     | Artikel aus dem Warenkorb entfernen                              | text/plain         | text/plain       |
| /article         | GET     | Alle Artikel anzeigen                                            | text/plain         | application/JSON |
| /article/:id     | GET     | Einzelner Artikel mit genaueren Informationen+Bewertung anzeigen | text/plain         | application/JSON |
| /article/add     | POST    | Neue Artikel einstellen                                          | application/JSON   | text/plain       |
| /article/delete  | GET     | Bestimmten Artikel löschen                                       | text/plain         | text/plain       |
| /user/all        | GET     | Alle User anzeigen                                               | text/plain         | application/JSON |
| /user/:id        | GET     | Einzelner User mit genaueren Informationen anzeigen              | text/plain         | application/JSON |
| /user/add        | POST    | Neue User einstellen                                             | application/JSON   | text/plain       |
| /user/delete     | GET     | Bestimmten User löschen                                          | text/plain         | text/plain       |
