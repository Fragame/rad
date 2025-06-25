---
sidebar_position: 100
---

import { Epigraph, Dialogue, Thought, SceneBreak, Letter, MarginNote, Annotation, DropCap, AuthorNote } from '@site/src/components/BookComponents';
import ReadingMode from '@site/src/components/ReadingMode';

# Capitolo di Esempio

<ReadingMode />

<Epigraph 
  text="Il viaggio di mille miglia inizia con un singolo passo." 
  author="Lao Tzu" 
/>

<DropCap>
Era una notte buia e tempestosa quando Maria finalmente arrivò al monastero. Il vento ululava tra le rovine, e la pioggia batteva incessante sulle pietre secolari.
</DropCap>



## Dialogo formattato

<Dialogue speaker="Maria">
Non pensavo che sarebbe stato così difficile arrivarci.
</Dialogue>

<Dialogue speaker="Giovanni">
Le cose più preziose richiedono sempre un sacrificio, cara bambina.
</Dialogue>

<Thought>
Perché mi ha chiamato "bambina"? Sa qualcosa che io non so?
</Thought>

<SceneBreak />

## Una lettera misteriosa

Maria aprì la busta con mani tremanti. All'interno, trovò:

<Letter date="15 Marzo 1958" from="Elena" to="La mia futura nipote">
Se stai leggendo queste parole, significa che hai avuto il coraggio di seguire il sentiero che ho tracciato per te.

Non tutto quello che troverai sarà facile da accettare. Ma ricorda: <Annotation note="Questa frase era sottolineata tre volte nell'originale">la verità ci rende liberi, anche quando fa male</Annotation>.

Nel cassetto sotto l'altare troverai quello che cerchi.
</Letter>

<AuthorNote>
Questo capitolo è stato ispirato da una vera lettera trovata negli archivi della Biblioteca Nazionale di Firenze. Ho modificato alcuni dettagli per proteggere la privacy delle persone coinvolte.
</AuthorNote>

---

## Formattazione automatica

Questo testo usa la formattazione automatica:

"Questo dialogo sarà convertito in virgolette caporali"

- Questo dialogo inizia con un trattino e sarà formattato automaticamente

*Questi sono i pensieri di Maria, in corsivo*

***

(Il triplo asterisco crea un scene break automatico)