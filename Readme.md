# Spezifikation REST Webservice


| Ressource        | Methode | Semantik                                                         | content-type (req) | content-type(res)|
|------------------|---------|------------------------------------------------------------------|--------------------|------------------|
| /warenkorb:id    | GET     | Gibt Liste von Artikeln zurück                                   | text/plain         | applicaton/JSON  |
| /user:id         | GET     | Gibt den User mit der entsprechenden Id zurück                   | text/plain         | application/JSON |
| /login           | GET     | Hier kann der User seine Logindaten eingeben                     | text/plain         | text/plain       |
| /login           | POST    | Überprüft dei logindaten des Users und der Cookie gesetzt.       | application/x-www-form-urlencoded         | text/plain       |
| /logout          | GET     | Löscht den Session-Cookie                                        | text/plain         | text/plain       |
| /lagerknapp      | GET     | Gibt alle Artikel aus, welche weniger als 5 mal im Lager sind.   | text/plain         | application/JSON |
| /bewertung:id    | POST    | Bewertung eines bestimmten Artikels (anhand id) abgeben          | application/JSON   | text/plain       |
| /bewertung:id    | GET     | Bewertung eines bestimmten Artikels (anhand id) abfragen         | text/plain         | text/plain       |
| /artikel         | GET     | Alle Artikel anzeigen                                            | text/plain         | application/JSON |
| /artikel:id      | GET     | Einzelner Artikel mit genaueren Informationen+Bewertung anzeigen | text/plain         | application/JSON |
| /artikelnew      | POST    | Neue Artikel einstellen                                          | application/JSON   | text/plain       |
| /lager:id:anzahl | POST    | LAgerbestand zu bestimmten Artiekln updaten                      | application/JSON   | text/plain       |
