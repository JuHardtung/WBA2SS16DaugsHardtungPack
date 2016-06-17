#Datenbankstruktur


##User
###Einzelne User
`HMSET user:1000 name musteruser passwd P1pp0`

Der Key ist "user:id"

`HGETALL user:1000`

Gibt alle Parameter eines Users aus.

`HGET user:1000 name`

Gibt nur den Benutzernamen eines Users aus.
###Userliste

`HSET users musteruser 1000 `

Hier lässt sich die ID eines Users über den Namen auslesen.

`HGETALL users`

Gibt die Liste aller User aus mit username und ID

###Authentifizierung

`HSET auths token 1000`

Enthält alle Sessions mit den jeweiligen Usern. "token" ist dabei die SessionID

`HSET user:1000 auth token`

Schreibt die SessionID zusätzlich zum User.

###UserID vergabe
`GET next_user_id`

Gibt die nächste freie UserID an. Wird bei Erstellung eines neuen Users inkrementiert.
