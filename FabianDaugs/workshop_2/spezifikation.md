

# Spezifikation REST Webservice


| Ressource      | Methode | Semantik                                                    | content-type (req) | content-type (res) |
|----------------|---------|-------------------------------------------------------------|--------------------|--------------------|
| /warenkorb     | GET     | Gibt "Dies ist der Warenkorb" zurück                        | text/plain         | text/plain         |
| /warenkorb/:id | GET     | Gibt den User mit der entsprechenden Id zurück              | text/plain         | text/plain         |
| /users         | POST    | Gibt nur den User aus dem gepostetetn Jsondokument zurück.  | application/json   | text/plain         |
| /lager         | GET     | Filtert nach Artikeln mit bestimmter Anzahl im Lager.       | application/json   | text/plain         |
