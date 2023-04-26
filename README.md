# A-psps

Applicazione sulla falsa riga di Tinder, il cui obbiettivo è quello di interfacciare i diversi utenti a una lista di altri animali che possono essere o non essere compatibili al proprio.

## Creazione
Sviluppato con framework svelte e autenticazione gestita con firebase che permetterà di gestire anche il database e lo storage delle foto.

## Descrizione 

L'applicazione presenterà una schermata iniziale di autenticazione e di registrazione, in seguito all'inserimento di tutti i propri dati si verrà reindirizzati a una schermata nella quale si potranno vedere gli account degli altri utenti in una schermata a scorrimento, sottostante ad ogni altro animale si troverà un tasto che ci permetterà di visualizzare i dati dell'altro animale.
La schermata principale avrà implementato anche una navbar dove ci saranno 2 pulsanti che ci permetteranno, uno di effettuare il logout e l'altro di visualizzare le proprie informazioni.

## Database

Il database è un Realtime Database creato con firebase, è formato da un entità *"users"* avente come attributi:
- *animal*, tipo di animale (es. cane, gatto...)
- *animal_age*, età animale
- *animal_describtion*, descrizione dell'animale
- *animal_gender*, sesso del animale
- *animal_image*, url dell'immagine presa dallo storage
- *animal_name*, nome dell'animale
- *email*, email del prorpietario
- *username*, nome del proprietario
Tutti gli attributi sono relativi ad un ID e la struttura del Database è ad albero.

## Installazione

Per installare l'applicazione bisognerà eseguire:
- git clone https://github.com/Outlawdormouse/A-psps.git
- cd A-psps
- npm install
- npm run dev

## Partecipanti

- Pitti Davide
- Lalata Jan Vincent
- Ricci Lorenzo
- Gasparetto Filippo