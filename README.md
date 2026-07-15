# JxCell

> **Componente table per Angular** — v6.9.7
>
> Un foglio di calcolo completo e personalizzabile per Angular 17–19.  
> API TypeScript tipizzata · Temi via CSS custom properties · Icone personalizzabili (`JX_ICONS`) · Event bus RxJS · Celle Angular personalizzate · Footer collassabili · Formule nei titoli.

---

## Indice

1. [Installazione](#installazione)
2. [Avvio rapido](#avvio-rapido)
3. [Configurazione del modulo](#configurazione-del-modulo)
4. [API del componente `jx-table`](#api-del-componente-jx-table)
   - [Input](#input)
   - [Output](#output)
   - [Metodi pubblici del componente](#metodi-pubblici-del-componente)
5. [Opzioni di configurazione (`JxCellOptions`)](#opzioni-di-configurazione-jxcelloptions)
   - [Dati](#dati)
   - [Colonne (columns)](#colonne-columns)
   - [Modifica e interazione](#modifica-e-interazione)
   - [Layout e visualizzazione](#layout-e-visualizzazione)
   - [Virtualizzazione righe (Virtual Scroll)](#virtualizzazione-righe-virtual-scroll)
   - [Header e footer fissi — colonne congelate](#header-e-footer-fissi--colonne-congelate)
   - [Ordinamento](#ordinamento)
   - [Ricerca e filtri](#ricerca-e-filtri)
   - [Paginazione](#paginazione)
   - [Unione celle (Merge)](#unione-celle-merge)
   - [Intestazioni annidate (Nested Headers)](#intestazioni-annidate-nested-headers)
   - [Footer](#footer)
   - [Barra strumenti (Toolbar)](#barra-strumenti-toolbar)
   - [Menu contestuale (Context Menu)](#menu-contestuale-context-menu)
   - [Persistenza](#persistenza)
   - [Localizzazione (i18n)](#localizzazione-i18n)
   - [Callback legacy (on*)](#callback-legacy-on)
6. [Definizione colonna (`JxCellColumn`)](#definizione-colonna-jxcellcolumn)
   - [Tipi di colonna](#tipi-di-colonna)
   - [Colonna autocomplete](#colonna-autocomplete)
   - [Dropdown a cascata (filterFn)](#dropdown-a-cascata-filterfn)
7. [Servizio Workbook (`JxWorkbookService`)](#servizio-workbook-jxworkbookservice)
   - [Dati: lettura e scrittura](#dati-lettura-e-scrittura)
   - [Righe e colonne](#righe-e-colonne)
   - [Celle: stile, sola lettura, classi, commenti, metadati](#celle-stile-sola-lettura-classi-commenti-metadati)
   - [Selezione e navigazione](#selezione-e-navigazione)
   - [Ordinamento e ricerca](#ordinamento-e-ricerca-1)
   - [Paginazione](#paginazione-1)
   - [Unione celle](#unione-celle-1)
   - [Undo / Redo](#undo--redo)
   - [Visibilità righe e colonne](#visibilità-righe-e-colonne)
   - [Footer: dati e visibilità](#footer-dati-e-visibilità)
   - [Persistenza](#persistenza-1)
   - [Configurazione reattiva](#configurazione-reattiva)
   - [Operazioni remote e CSV](#operazioni-remote-e-csv)
   - [Utility, i18n, hash](#utility-i18n-hash)
   - [Stream reattivi (events)](#stream-reattivi-events)
   - [BehaviorSubject interni](#behaviorsubject-interni)
8. [Barra strumenti: sistema plugin](#barra-strumenti-sistema-plugin)
9. [Celle personalizzate — guida completa](#celle-personalizzate--guida-completa)
   - [Cella corpo (Body Cell)](#cella-corpo-body-cell)
   - [Cella intestazione (Header Cell)](#cella-intestazione-header-cell)
   - [Cella footer (Footer Cell)](#cella-footer-footer-cell)
   - [Footer collassabile (JxCustomFooterBase)](#footer-collassabile-jxcustomfooterbase)
   - [Cella sub-header (Nested Header Cell)](#cella-sub-header-nested-header-cell)
10. [Context menu personalizzato](#context-menu-personalizzato)
11. [Temi e stili](#temi-e-stili)
12. [Icone personalizzate](#icone-personalizzate)
13. [Indirizzi e formule](#indirizzi-e-formule)
14. [Esempio completo](#esempio-completo)
14. [Componente `jx-grid` — data-grid nativo Angular](#componente-jx-grid--data-grid-nativo-angular)
    - [Quando usare `jx-grid` vs `jx-table`](#quando-usare-jx-grid-vs-jx-table)
    - [Setup e utilizzo base](#setup-e-utilizzo-base)
    - [Opzioni (`JxGridOptions`)](#opzioni-jxgridoptions)
    - [Colonne (`JxColumn<T>`)](#colonne-jxcolumnt)
    - [Tipi di cella built-in](#tipi-di-cella-built-in-jx-grid)
    - [Output](#output-jx-grid)
    - [Virtual scroll](#virtual-scroll)
    - [Celle personalizzate in `jx-grid`](#celle-personalizzate-in-jx-grid)
    - [Personalizzazione SCSS di `jx-grid`](#personalizzazione-scss-di-jx-grid)

> Documentazione aggiornata al 2026-06-26

---

## Installazione

```bash
npm install jx-cell
```

Se usi la toolbar con le icone Material Icons, aggiungi a `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

Importa il tema nel tuo `styles.scss` globale:

```scss
// Opzione A — sorgenti SCSS (personalizzazione compile-time con @use ... with)
@use 'jx-cell/theme';

// Opzione B — CSS precompilato (più semplice, nessun tool SCSS richiesto)
// @import 'jx-cell/jx-cell.expanded.css';
// oppure minificato:
// @import 'jx-cell/jx-cell.css';
```

> **📌 Isolamento multi-istanza** — Tutti gli stili della libreria sono automaticamente
> scopati sotto il selettore `jx-table`. Due o più istanze `<jx-table>` sulla stessa
> pagina non interferiscono tra loro e non confliggono con la libreria jExcel originale
> o qualsiasi altro CSS che usa nomi di classe simili.

---

## Avvio rapido

```html
<!-- app.component.html -->
<jx-table
  [options]="gridOptions"
  (ready)="onReady($event)">
</jx-table>
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { JxCellOptions, JxWorkbookService } from 'jx-cell';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent {
  gridOptions: JxCellOptions = {
    data: [
      { nome: 'Alice', eta: 30, attivo: true },
      { nome: 'Bob',   eta: 25, attivo: false },
    ],
    columns: [
      { title: 'Nome',   name: 'nome',   type: 'text',     width: 160 },
      { title: 'Età',    name: 'eta',    type: 'numeric',  width: 80 },
      { title: 'Attivo', name: 'attivo', type: 'checkbox', width: 80 },
    ],
    stickyHeader: true,
    tableHeight: '400px',
  };

  wb!: JxWorkbookService;

  onReady(wb: JxWorkbookService) {
    this.wb = wb;
    console.log('Griglia pronta. Righe:', wb.getRowCount());
  }
}
```

---

## Configurazione del modulo

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { JxCellModule } from 'jx-cell';

@NgModule({
  imports: [JxCellModule],
  // Componenti custom (celle, header, footer, nested-header) devono essere dichiarati qui
  declarations: [
    MiaCellaComponent,
    MioHeaderComponent,
    MioFooterComponent,
    MioNestedHeaderComponent,
  ],
})
export class AppModule {}
```

---

## API del componente `jx-table`

### Input

| Input | Tipo | Descrizione |
|---|---|---|
| `options` | `JxCellOptions` | Configurazione completa. Ogni volta che il **riferimento** cambia, la griglia viene **completamente re-inizializzata**. Usa `workbook.setConfig()` per aggiornamenti a caldo. |

### Output

| Output | Tipo | Descrizione |
|---|---|---|
| `ready` | `EventEmitter<JxWorkbookService>` | Emesso **una sola volta** all'inizializzazione. Ricevi il workbook service. |
| `selectionChange` | `EventEmitter<JxSelection | null>` | Emesso ad ogni cambio di selezione. |

### Metodi pubblici del componente

Accessibili tramite `@ViewChild(JxTableComponent)`.

| Metodo | Firma | Descrizione |
|---|---|---|
| `startEdit(x, y)` | `(x: number, y: number) => void` | Apre l'editor sulla cella `(x, y)` (coordinate 0-based). |
| `commitEdit()` | `() => void` | Salva il valore digitato e chiude l'editor. |
| `cancelEdit()` | `() => void` | Scarta le modifiche e chiude l'editor. |
| `copy(cut?)` | `(cut?: boolean) => void` | Copia la selezione. `cut=true` esegue taglia. |
| `fullscreen()` | `() => void` | Attiva/disattiva la modalità fullscreen. |
| `getCell(x, y)` | `(x, y) => HTMLElement | null` | Restituisce il `<td>` DOM della cella `(x, y)`. |
| `getElement()` | `() => HTMLElement` | Restituisce il nodo radice del componente griglia. |
| `setStyle(cell, style)` | `(cell: string, style) => void` | Applica stili CSS a una cella in notazione A1. |
| `dispatch(name, detail?)` | `(name, detail?) => void` | Emette un `CustomEvent` sull'elemento host. |

---

## Opzioni di configurazione (`JxCellOptions`)

### Dati

```typescript
const options: JxCellOptions = {
  // ── Array di oggetti (chiavi = name/field delle colonne) ──────────────────
  // Formato consigliato: ogni oggetto corrisponde a una riga.
  data: [
    { nome: 'Alice', punteggio: 95 },
    { nome: 'Bob',   punteggio: 80 },
  ],

  // ── Oppure array di array ─────────────────────────────────────────────────
  // Ogni array interno è una riga; gli elementi corrispondono alle colonne in ordine.
  // data: [['Alice', 95], ['Bob', 80]],

  // ── URL remoto ────────────────────────────────────────────────────────────
  // Chiamato automaticamente all'init e a ogni workbook.refresh().
  // Il server deve restituire JSON: un array o { data: [...] }.
  url: 'https://api.esempio.com/dati',

  // Metodo HTTP. Default: 'GET'. Alternativa: 'POST'.
  method: 'GET',

  // Parametri extra per la richiesta.
  // Con GET: aggiunti come query string (?k=v&...).
  // Con POST: serializzati nel body come JSON.
  requestVariables: { pagina: 1, limite: 50 },

  // Se true, mostra un overlay con indicatore di caricamento durante il fetch.
  loadingSpin: true,

  // ── Sorgente CSV ──────────────────────────────────────────────────────────
  // Può essere: un URL (fetch automatico), un percorso relativo, o una stringa CSV inline.
  // La stringa inline viene riconosciuta se contiene '\n' o '\r'.
  csv: 'assets/dati.csv',

  // Se true, la prima riga del CSV viene usata come intestazioni di colonna.
  csvHeaders: true,

  // Separatore dei campi CSV. Default: ','.
  csvDelimiter: ',',

  // Nome del file generato da download() (senza estensione '.csv').
  csvFileName: 'esportazione',

  // Se false, disabilita completamente il download CSV. Default: true.
  allowExport: true,

  // Se true, include la riga header nel CSV scaricato. Default: false.
  includeHeadersOnDownload: false,

  // ── Dimensioni minime garantite ───────────────────────────────────────────
  // Aggiunge righe/colonne vuote per rispettare queste dimensioni minime.
  // [colonneMinime, righeMinime]
  minDimensions: [5, 10],

  // Numero minimo di righe totali. Aggiunge vuote se i dati sono meno.
  minRows: 5,

  // Numero minimo di righe vuote in coda ai dati (utile per UX di inserimento).
  minSpareRows: 1,

  // Numero minimo di colonne vuote dopo le colonne dati.
  minSpareCols: 0,

  // ── Stili e metadati iniziali ─────────────────────────────────────────────
  // Mappa stili iniziali: { 'A1': { fontWeight: 'bold', color: '#ff0000' } }
  style: {},
  // Mappa metadati iniziali: { 'A1': { nota: 'importante', validato: true } }
  meta: {},
};
```

### Colonne (columns)

Ogni elemento dell'array `columns` descrive una colonna della griglia.

```typescript
const options: JxCellOptions = {
  columns: [
    {
      // ── IDENTIFICAZIONE ────────────────────────────────────────────────────
      // Etichetta mostrata nell'header. Può contenere formule (es. '=COUNTA(B:B)').
      title: 'Prodotto',

      // Chiave dell'oggetto dati a cui questa colonna è associata.
      // Usa 'name' (preferibile) oppure 'field' (alias compatibile).
      name: 'prodotto',

      // ── TIPO EDITOR ────────────────────────────────────────────────────────
      // Determina il widget di modifica della cella (vedi §Tipi di colonna).
      type: 'text',

      // ── LAYOUT ────────────────────────────────────────────────────────────
      // Larghezza colonna in pixel. Se omessa usa defaultColWidth (default: 150).
      width: 200,

      // Allineamento del testo. Valori: 'left' | 'center' | 'right'.
      align: 'left',

      // ── MODIFICA ──────────────────────────────────────────────────────────
      // Se true, la cella non è modificabile dall'utente.
      // Non influisce su setValue() programmatico.
      readOnly: false,

      // ── VISIBILITÀ ────────────────────────────────────────────────────────
      // Se true, la colonna non viene renderizzata nel DOM.
      // Equivalente a type: 'hidden'.
      hidden: false,

      // ── ORDINAMENTO ───────────────────────────────────────────────────────
      // Abilita/disabilita il click sull'header per ordinare questa colonna.
      sortable: true,

      // Comparatore personalizzato. Signature come Array.sort.
      // rowA, rowB = array completo della riga; col = indice 0-based della colonna.
      sortFn: (rowA, rowB, col) => String(rowA[col]).localeCompare(String(rowB[col])),

      // ── FILTRO ────────────────────────────────────────────────────────────
      // Se false, non mostra l'input filtro per questa colonna (richiede columnFilter: true).
      filterable: true,

      // ── NUMERICI ──────────────────────────────────────────────────────────
      // Separatore decimale per colonne numeric/number. Default: '.'.
      decimal: '.',

      // Maschera di input (es. '###,###.##' per migliaia con separatore virgola).
      mask: '',

      // ── DROPDOWN / AUTOCOMPLETE ───────────────────────────────────────────
      // Lista delle opzioni. Elementi: stringhe oppure { id: any, name: string }.
      source: ['Opzione A', 'Opzione B', { id: 'c', name: 'Opzione C' }],

      // Sorgente dinamica per autocomplete: stringa[], Promise<...>, Observable<...>.
      autocompleteSource: async (q) => fetch(`/api?q=${q}`).then(r => r.json()),

      // Filtro dinamico delle opzioni in base al valore di altre celle della riga.
      // Usato per creare dropdown a cascata (es. Regione → Provincia → Comune).
      // ctx.row = array completo della riga corrente (valori processati).
      filterFn: ({ row }) => row[0] === 'IT' ? ['Milano', 'Roma'] : ['Parigi', 'Lione'],

      // ── COMPONENTI ANGULAR CUSTOM ──────────────────────────────────────────
      // Sostituisce il testo dell'header con un componente Angular.
      headerComponent: MioHeaderComponent,

      // Sostituisce il testo nelle celle del footer di questa colonna.
      footerComponent: MioFooterComponent,

      // Sostituisce l'editor built-in con un componente Angular.
      // Usato solo con type: 'custom'.
      editor: { component: MiaCellaComponent },

      // ── TIPO NATIVO DEL VALORE ─────────────────────────────────────────────
      // Per colonne 'custom': dichiara il tipo nativo del valore.
      // Valori: 'string' | 'number' | 'boolean'. Default: 'string'.
      valueType: 'number',

      // ── OPZIONI EXTRA ─────────────────────────────────────────────────────
      // Oggetto opaco passato ai componenti custom via context.column.options.
      // Usa questa proprietà per configurare il comportamento del componente.
      options: { prefisso: '€', budgetMassimo: 1000 },
    },
  ],

  // Larghezza predefinita per le colonne senza width esplicita. Default: 150.
  defaultColWidth: 150,

  // Allineamento predefinito per le colonne senza align esplicita.
  defaultColAlign: 'left',

  // Altezza predefinita delle righe in pixel. Default: 28.
  defaultRowHeight: 28,
};
```

### Modifica e interazione

```typescript
const options: JxCellOptions = {
  // Abilita/disabilita la modifica globale.
  // false = griglia completamente in sola lettura.
  editable: true,

  // Mostra la maniglia di riempimento stile Excel nell'angolo della selezione.
  // Trascinando si replicano valori e formule.
  enableFillHandle: true,

  // Con fill handle attivo, incrementa automaticamente numeri e serie alfanumeriche.
  // Es. '1, 2, 3...' oppure 'Q1, Q2, Q3...' oppure '001, 002, 003...'.
  autoIncrement: false,

  // Se true, aggiunge una riga vuota quando TUTTE le righe risultano popolate.
  // La riga vuota viene aggiunta silenziosamente (senza passare per l'undo stack).
  autoAddRow: true,

  // Drag & drop colonne: trascina un'intestazione per riordinarle.
  columnDrag: true,

  // Ridimensionamento colonne: trascina il bordo destro dell'header.
  columnResize: true,

  // Preserva le larghezze correnti delle colonne tra chiamate successive a setConfig().
  // Quando true, ogni volta che si chiama setConfig({ columns }), le larghezze già
  // presenti nel workbook vengono mantenute per le colonne con lo stesso name/field,
  // evitando il flash visivo "espansione→restringimento" causato dal reset ai valori
  // di configurazione. Nuovo con v6.9.6. Default: false.
  preserveColumnWidths: true,

  // Drag & drop righe: trascina il numero di riga per riordinarle.
  rowDrag: true,

  // Ridimensionamento righe: trascina il bordo inferiore della cella.
  rowResize: true,

  // ── PERMESSI ──────────────────────────────────────────────────────────────
  // Questi flag controllano cosa l'utente può fare tramite UI (tastiera/menu contestuale).
  // Non bloccano le operazioni programmatiche (workbook.*).
  // Per blocco programmatico usa workbook.setLocked(true).

  allowInsertRow: true,           // permette inserimento righe dal menu contestuale
  allowInsertColumn: true,        // permette inserimento colonne
  allowDeleteRow: true,           // permette eliminazione righe
  allowDeleteColumn: true,        // permette eliminazione colonne
  allowDeletingAllRows: true,     // false = non eliminare l'ultima riga
  allowManualInsertRow: false,    // mostra il pulsante "+" sotto la griglia
  allowManualInsertColumn: false, // mostra il pulsante "+" a destra della griglia
  allowRenameColumn: false,       // permette rinomina colonne con doppio click
  allowComments: false,           // mostra "Aggiungi commento" nel menu contestuale
  allowCut: true,                 // abilita Ctrl+X
  includeHeadersOnCopy: false,    // include la riga header nelle copie Ctrl+C

  // ── TESTO ─────────────────────────────────────────────────────────────────
  // Abilita il testo a capo nelle celle (come CSS word-wrap: break-word).
  wordWrap: false,

  // Troncamento del testo: 'clip' taglia netto, 'ellipsis' mostra '...'.
  textOverflow: 'ellipsis',

  // ── CONVERSIONE AUTOMATICA ────────────────────────────────────────────────
  // Converte automaticamente stringhe durante l'inserimento:
  // '42' → 42 (number), 'true' → true (boolean), 'null' → '' (empty).
  autoCasting: false,

  // Blocca le formule incollate dagli appunti (protezione XSS/injection).
  // '=FORMULA...' viene trasformato in "'=FORMULA..." (apostrofo iniziale).
  secureFormulas: false,

  // Rimuove tutti i tag HTML (<b>, <script>, ecc.) dai dati in input.
  stripHTML: false,

  // Come stripHTML, ma solo durante copia/incolla.
  stripHTMLOnCopy: false,

  // ── CLASSI CSS EXTRA ──────────────────────────────────────────────────────
  // Aggiunge classi CSS a tutte le celle di una colonna specifica.
  // Chiave = indice colonna (0-based), valore = classi CSS spazio-separate.
  classes: {
    0: 'colonna-evidenziata',
    3: 'pericolo attenzione',
  },
};
```

### Layout e visualizzazione

```typescript
const options: JxCellOptions = {
  // Mostra la riga thead con i titoli colonna.
  columnHeaders: true,

  // Mostra la colonna degli indici riga (prima colonna con 1, 2, 3...).
  rowHeaders: true,

  // Evidenzia la cella dell'header di colonna corrispondente alla selezione. Default: true.
  highlightSelectedColumnHeader: true,

  // Evidenzia la cella dell'header di riga corrispondente alla selezione. Default: true.
  highlightSelectedRowHeader: true,

  // Mostra il tfoot (righe footer).
  showFooter: true,

  // Altezza del contenitore scroll. Accetta qualsiasi valore CSS.
  // OBBLIGATORIO per sticky header/footer e freeze.
  tableHeight: '500px',

  // Alternativa a tableHeight: indica quante righe dati devono essere visibili
  // contemporaneamente. jx-table calcola automaticamente l'altezza come:
  //   34px (header colonne) + visibleRowCount × defaultRowHeight
  // Se tableHeight è impostato, ha la precedenza su visibleRowCount.
  visibleRowCount: 10,

  // Larghezza del contenitore scroll. Se omessa usa la larghezza naturale.
  tableWidth: '100%',

  // Abilita lo scroll orizzontale e verticale.
  // Deve essere true per usare stickyHeader/stickyFooter/freeze.
  tableOverflow: true,
};
```

### Virtualizzazione righe (Virtual Scroll)

Per dataset con centinaia o migliaia di righe, `jx-table` supporta un motore di
**row virtualization** nativo: mantiene nel DOM solo la finestra di righe visibili
più un buffer di overscan, riducendo il rendering iniziale fino al **−96%**
(esempio: 400 righe → da 626 ms a 25 ms).

```typescript
const options: JxCellOptions = {
  // Attiva la virtualizzazione delle righe.
  // Disabilitata automaticamente se sono presenti celle con rowspan > 1.
  virtualScroll: true,

  // OBBLIGATORIO con virtualScroll: definisce l'altezza del viewport.
  // Puoi usare tableHeight (stringa CSS) oppure visibleRowCount (n. righe).
  tableHeight: '480px',
  // — oppure —
  visibleRowCount: 15,    // 34 + 15 × defaultRowHeight px

  // Numero di righe extra renderizzate oltre il viewport (sopra e sotto).
  // Aumentare per ridurre il lampeggio durante scroll lento. Default: 8.
  virtualScrollOverscan: 8,

  // Limite massimo di righe extra aggiunte dall'overscan dinamico basato
  // sulla velocità di scroll. Buffer anti-flash durante scroll veloce.
  // Default: 40.
  virtualScrollMaxVelocityOverscan: 40,

  tableOverflow: true,    // OBBLIGATORIO
};
```

> **Limitazioni**:
> - Incompatibile con celle unite che occupano più righe (`mergeCells` con rowspan > 1):
>   la virtualizzazione si disabilita automaticamente con un avviso in console.
> - Le righe congelate (`freezeRows`) vengono sempre renderizzate indipendentemente
>   dalla finestra virtuale.

### Header e footer fissi — colonne congelate

```typescript
const options: JxCellOptions = {
  tableHeight: '400px',    // OBBLIGATORIO per il funzionamento dello sticky
  tableOverflow: true,     // OBBLIGATORIO

  // L'intestazione (thead) rimane visibile durante lo scroll verticale.
  stickyHeader: true,

  // Il footer (tfoot) rimane visibile durante lo scroll verticale.
  // Funziona anche con footer collassabili: la posizione si aggiorna
  // automaticamente quando le righe vengono nascoste/mostrate.
  stickyFooter: true,

  // Congela le prime N colonne: rimangono visibili durante lo scroll orizzontale.
  // Le celle congelate hanno uno sfondo opaco (--jx-header-bg).
  freezeColumns: 2,

  // Congela le ultime N colonne al bordo DESTRO: il body scorre orizzontalmente
  // tra le colonne ferme a sinistra e quelle ferme a destra.
  freezeColumnsRight: 1,

  // Congela le prime N righe del tbody durante lo scroll verticale.
  freezeRows: 1,

  // Lista precisa di indici colonna (0-based) da congelare.
  // Alternativa più flessibile a freezeColumns: permette colonne non contigue.
  frozenColumnIndexes: [0, 1, 2],

  // Come frozenColumnIndexes ma per il bordo destro.
  frozenColumnIndexesRight: [8, 9],

  // Mostra una riga di input filtro sotto ogni header colonna.
  columnFilter: false,
};
```

> **⚠️ Attenzione sticky/freeze**: `--jx-cell-bg`, `--jx-cell-alt-bg`,
> `--jx-header-bg` e `--jx-footer-bg` **devono essere colori completamente opachi**.
> Valori semi-trasparenti (`rgba(...)`) rendono visibili le righe in scorrimento
> dietro le celle sticky/congelate.

### Ordinamento

```typescript
const options: JxCellOptions = {
  // Abilita il click sull'header per ordinare (cicla: asc → desc → originale).
  sortable: true,

  columns: [
    // Disabilita l'ordinamento su questa colonna.
    { title: 'ID', name: 'id', sortable: false },

    // Comparatore personalizzato. Parametri:
    // rowA / rowB = array completo della riga da confrontare
    // col         = indice 0-based della colonna corrente
    {
      title: 'Data', name: 'data', type: 'calendar',
      sortFn: (rowA, rowB, col) =>
        new Date(rowA[col]).getTime() - new Date(rowB[col]).getTime(),
    },
  ],
};

// ── Ordinamento programmatico ─────────────────────────────────────────────
workbook.sort(2, 'asc');   // colonna 2, crescente
workbook.sort(2, 'desc');  // colonna 2, decrescente
workbook.sort(2, null);    // ripristina ordine originale
workbook.clearSort();      // alias di sort(col, null)

// Lettura stato
const s = workbook.getSortState();
// → { columnIndex: 2, direction: 'asc' } | null
```

### Ricerca e filtri

> La ricerca globale e i filtri di colonna operano sul **testo visualizzato**
> della cella (case-insensitive): le etichette di `dropdown`/`select`/
> `autocomplete` e i valori formattati dalle maschere vengono risolti, così il
> termine cercato corrisponde a ciò che l'utente vede effettivamente in griglia.

```typescript
const options: JxCellOptions = {
  // Mostra una casella di ricerca globale.
  search: true,

  // Modalità ricerca:
  // 'hide' = nasconde le righe non corrispondenti (default)
  // 'dim'  = opacizza le righe non corrispondenti
  searchMode: 'hide',

  // Opacità delle righe non corrispondenti in modalità 'dim'. Default: 0.2.
  searchDimOpacity: 0.2,

  // Mostra una riga di input filtro per colonna sotto l'header.
  columnFilter: true,

  // Per-colonna: scegli SU QUALI colonne mostrare l'input filtro.
  // Imposta `filterable: false` sulla definizione di colonna per escluderla
  // (richiede `columnFilter: true`). Le colonne senza il flag restano filtrabili.
  columns: [
    { title: 'Nome',  name: 'name'  /* filtrabile (default) */ },
    { title: 'Avatar', name: 'img', filterable: false },  // niente input filtro
    { title: 'Ruolo', name: 'role', filterable: true  },
  ],

  // Blocca le righe filtrate: le righe escluse dai filtri attivi (nascoste in
  // modalità 'hide' o attenuate in 'dim', sia da ricerca che da filtri colonna)
  // diventano NON editabili per l'intera riga finché i filtri restano attivi.
  // Quando i filtri vengono rimossi le righe tornano editabili. Default: false.
  lockFilteredRows: true,
};

// ── Ricerca globale ────────────────────────────────────────────────────────
workbook.search('alice');      // mostra solo le righe contenenti 'alice'
workbook.resetSearch();        // ripristina tutte le righe
workbook.getSearchQuery();     // restituisce la query corrente

// ── Filtri colonna ─────────────────────────────────────────────────────────
workbook.setColumnFilter(0, 'ali');    // filtra la colonna 0 per 'ali'
workbook.getColumnFilter(0);           // stringa filtro corrente della colonna 0
workbook.getColumnFilters();           // Map<number, string> con tutti i filtri
workbook.clearColumnFilters();         // rimuove tutti i filtri di colonna

// ── Stream reattivi ────────────────────────────────────────────────────────
// Emettono un Set<number> con gli indici delle righe nascoste.
workbook.search$.subscribe(righeNascoste => {
  console.log('Nascoste dalla ricerca:', [...righeNascoste]);
});
workbook.columnFilter$.subscribe(righeNascoste => {
  console.log('Nascoste dai filtri:', [...righeNascoste]);
});
```

### Paginazione

```typescript
const options: JxCellOptions = {
  // Righe per pagina. 0 o undefined = paginazione disabilitata.
  pagination: 25,
};

// ── Navigazione (tutti gli indici sono 0-based) ────────────────────────────
workbook.page(2);            // vai alla pagina 2
workbook.nextPage();         // pagina successiva (no-op se è l'ultima)
workbook.prevPage();         // pagina precedente (no-op se è la prima)
workbook.firstPage();        // prima pagina
workbook.lastPage();         // ultima pagina

// ── Informazioni ──────────────────────────────────────────────────────────
workbook.getPageCount();     // numero totale di pagine
workbook.whichPage();        // indice pagina corrente (0-based)
workbook.getPageSize();      // righe per pagina
workbook.getPageRange();     // [primaRiga, ultimaRiga] indici inclusivi

// ── Stream reattivo ────────────────────────────────────────────────────────
workbook.page$.subscribe(pagina => console.log('Pagina corrente:', pagina));
```

### Unione celle (Merge)

```typescript
const options: JxCellOptions = {
  // Mappa 'CELLA': [colonne, righe].
  // 'A1': [3, 1] → A1 occupa 3 colonne e 1 riga
  // 'B3': [1, 2] → B3 occupa 1 colonna e 2 righe
  mergeCells: {
    'A1': [3, 1],
    'B3': [1, 2],
  },
};

// ── Gestione programmatica ────────────────────────────────────────────────
workbook.setMerge('A1', 3, 1);    // unisci A1 su 3 colonne, 1 riga
workbook.removeMerge('A1');        // rimuovi unione A1
workbook.getMerge();               // mappa completa JxMergeMap
workbook.getMerge('A1');           // [colspan, rowspan] | null
workbook.destroyMerged();          // rimuovi tutte le unioni
workbook.hasMergedCells();         // boolean
workbook.isColumnMerged(0);        // true se la colonna 0 è parte di un'unione
workbook.isRowMerged(2);           // true se la riga 2 è parte di un'unione
```

### Intestazioni annidate (Nested Headers)

Le intestazioni annidate aggiungono una o più righe sopra l'header standard
per raggruppare le colonne correlate.

```typescript
const options: JxCellOptions = {
  nestedHeaders: [
    // Riga superiore: ogni cella copre colspan colonne
    [
      { title: 'Dati Anagrafici', colspan: 2 },
      { title: 'Dati Finanziari', colspan: 3 },
    ],
    // Riga inferiore: sotto-gruppi
    [
      { title: 'Identità',  colspan: 2 },
      { title: 'Costi',     colspan: 2 },
      { title: 'Ricavi',    colspan: 1 },
    ],
  ],
};
```

**Proprietà di ogni cella `nestedHeaders`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `title` | `string` | Testo da visualizzare. Supporta formule (`=...`). |
| `colspan` | `number` | Numero di colonne coperte. Default: 1. |
| `component` | `Type<...>` | Componente Angular custom (vedi §Cella sub-header). |

**Normalizzazione automatica**: la libreria aggiunge celle vuote per coprire le colonne rimanenti.

**Colonne senza gruppo (rowspan automatico)**: una colonna non coperta da alcun gruppo
(cella vuota con `colspan: 1` in tutte le righe `nestedHeaders`) rende la sua intestazione
principale su un'unica cella che occupa in verticale tutta l'altezza dell'header
(rowspan). Così non resta una cella nested vuota che scorre autonomamente sopra la
colonna, e l'intestazione mantiene ordinamento/resize/filtro.

**Formule nei titoli**:

```typescript
nestedHeaders: [[
  { title: 'Anagrafica', colspan: 1 },
  { title: '=CONCATENATE("Totale: €",SUM(B1:B999))', colspan: 6 },
  { title: '=CONCATENATE("(",COUNTA(A1:A999)," righe)")', colspan: 3 },
]]
```

**Componenti custom**:

```typescript
nestedHeaders: [[
  { title: 'Anagrafica', colspan: 1, component: MioSubHeaderComponent },
  { title: 'Calcoli',    colspan: 6, component: MioSubHeaderComponent },
  { title: 'Opzioni',    colspan: 2 }, // rendering default
]]
```

### Footer

```typescript
const options: JxCellOptions = {
  stickyFooter: true,   // il footer rimane visibile durante lo scroll

  footers: [
    // ── Riga semplice (array di stringhe/formule) ─────────────────────────
    [
      'Etichetta',           // valore statico
      '=SUM(B1:B100)',       // formula: somma colonna B
      '=AVERAGE(C1:C100)',   // formula: media colonna C
      '=MAX(D1:D100)',       // formula: massimo colonna D
      '=COUNTA(A1:A100)',    // formula: conteggio celle non vuote
      '=CONCATENATE("Tot: €", SUM(G1:G100))',  // formula + testo
    ],

    // ── Riga con oggetti (colspan, footerComponent, options) ──────────────
    [
      { value: 'RIEPILOGO', colspan: 3 },          // occupa 3 colonne
      { value: '=SUM(D1:D100)' },                  // formula
      {
        value: '=SUM(G1:G100)',
        footerComponent: MioGaugeFooterComponent,  // componente custom
        options: { target: 1000, colore: 'green' } // opzioni per il componente
      },
    ],

    // ── Riga toggle collassabile ───────────────────────────────────────────
    // Riga 0 funge da intestazione del gruppo. Le righe 1-N vengono
    // nascoste/mostrate al click sul toggle.
    [
      {
        value: '▼ Totali',
        colspan: 8,
        footerComponent: CollapsibleFooterToggleComponent,
        options: {
          label: 'Riepilogo totali',     // etichetta mostrata nel bottone
          collapsedByDefault: false,     // se true inizia collassato
        },
      },
    ],
    // Righe controllate dal toggle (fy=1, fy=2, ...)
    ['', '=SUM(B1:B12)', '', '=SUM(D1:D12)'],
    ['', '', '', '', '', 'Totale gen.', '=SUM(G1:G12)'],
  ],
};
```

**Footer sulle sole righe visibili (`footerOnVisibleRows`)**

Per impostazione predefinita i footer aggregano l'**intero dataset**: ricerca,
filtri di colonna e `hideRow()` nascondono le righe a video ma non influenzano i
totali. Attivando `footerOnVisibleRows: true` i footer vengono invece
ricalcolati considerando **solo le righe visibili** — un comportamento analogo a
`SUBTOTAL` di Excel.

```typescript
const options: JxCellOptions = {
  footerOnVisibleRows: true,   // i totali riflettono solo le righe visibili
  footers: [
    ['Totale', '=SUM(B:B)', '=AVERAGE(C:C)'],  // usa riferimenti a colonna intera
  ],
};

// Il footer si aggiorna automaticamente quando cambiano:
workbook.search('alice');          // ricerca full-text
workbook.setColumnFilter(3, 'HR'); // filtro di colonna
workbook.hideRow(2);               // nascondere righe via API
```

> **Nota:** usa riferimenti a colonna intera (`=SUM(C:C)`) o funzioni aggregate
> nei footer. I riferimenti a range con indice assoluto (`=SUM(C1:C10)`) si
> riferirebbero alle prime righe *visibili* della matrice filtrata.

**Gestione programmatica:**

```typescript
// Imposta una cella footer (row=riga 0-based, col=colonna 0-based)
workbook.setFooter(0, 2, '=SUM(C1:C50)');

// Legge il valore: processed=true → calcolato; processed=false → formula grezza
workbook.getFooter(0, 2, true);    // numero calcolato
workbook.getFooter(0, 2, false);   // '=SUM(C1:C50)'

// Matrice completa
workbook.getFooters(true);   // con valori calcolati
workbook.getFooters(false);  // con formule grezze

// Sostituisce tutta la configurazione footer
workbook.setFooters([['Totale', '=SUM(B1:B99)']]);

// ── Visibilità righe footer (per footer collassabili) ──────────────────────
workbook.hideFooterRow(1);           // nasconde la riga footer 1
workbook.showFooterRow(1);           // mostra la riga footer 1
workbook.toggleFooterRow(1);         // alterna visibilità riga 1
workbook.isFooterRowHidden(1);       // true se la riga 1 è nascosta

// Nasconde/mostra TUTTE le righe con fy > headerFy.
// Restituisce true=collassato, false=espanso.
const collapsed = workbook.toggleFooterGroup(0);

// Verifica se il gruppo è collassato
workbook.isFooterGroupCollapsed(0);  // true se riga 1 è nascosta
```

### Barra strumenti (Toolbar)

```typescript
const options: JxCellOptions = {
  toolbar: [
    // type: 'i' = bottone icona Material Icons
    // k: proprietà CSS da applicare alle celle selezionate
    // v: valore CSS da applicare al click
    // content: nome icona (https://fonts.google.com/icons)
    // tooltip: testo al passaggio del mouse
    { type: 'i', content: 'format_bold',       k: 'font-weight',     v: 'bold',      tooltip: 'Grassetto' },
    { type: 'i', content: 'format_italic',     k: 'font-style',      v: 'italic',    tooltip: 'Corsivo' },
    { type: 'i', content: 'format_underlined', k: 'text-decoration', v: 'underline', tooltip: 'Sottolineato' },

    // type: 'divisor' = separatore visivo (linea verticale)
    { type: 'divisor' },

    { type: 'i', content: 'format_align_left',   k: 'text-align', v: 'left' },
    { type: 'i', content: 'format_align_center', k: 'text-align', v: 'center' },
    { type: 'i', content: 'format_align_right',  k: 'text-align', v: 'right' },

    { type: 'divisor' },

    // type: 'color' = apre un color picker nativo
    // k: proprietà CSS a cui applicare il colore scelto
    { type: 'color', content: 'format_color_text', k: 'color',            tooltip: 'Colore testo' },
    { type: 'color', content: 'format_color_fill', k: 'background-color', tooltip: 'Colore sfondo' },

    { type: 'divisor' },

    // type: 'select' = <select> HTML per scegliere un valore CSS
    // v: array di valori selezionabili
    { type: 'select', k: 'font-size', v: ['10px','11px','12px','14px','16px','18px','20px','24px'] },

    { type: 'divisor' },

    // Bottone con handler personalizzato
    // onclick(el, workbook, item): el = DOM bottone, workbook = JxWorkbookService
    {
      type: 'i',
      content: 'download',
      tooltip: 'Esporta CSV',
      onclick: (_el, wb) => wb.download(true),
    },
  ],

  // Plugin toolbar aggiuntivi (vedi §Barra strumenti: sistema plugin)
  toolbarPlugins: [new MioPlugin()],
};
```

### Menu contestuale (Context Menu)

```typescript
const options: JxCellOptions = {
  contextMenu: {
    // Disabilita il menu globalmente (boolean) o per cella specifica (callback).
    // (x, y) => true = menu disabilitato su quella cella.
    disabled: (x, _y) => x === 0,   // disabilitato sulla prima colonna

    // Se false, nasconde tutte le voci built-in (inserisci/elimina/ordina ecc.).
    showDefaultItems: true,

    // Classi CSS aggiuntive per il pannello del menu.
    menuClass: 'mio-menu-contestuale',

    // TemplateRef Angular custom (vedi §Context menu personalizzato).
    template: this.customMenuTemplate,
  },
};
```

### Persistenza

```typescript
const options: JxCellOptions = {
  // Chiave localStorage. Se impostata, i dati vengono salvati automaticamente
  // (con debounce 100ms) ad ogni modifica, e ricaricati all'init.
  persistence: 'mia-griglia-v1',
};

// Operazioni manuali
workbook.saveState();               // forza il salvataggio
workbook.clearPersistence();        // cancella i dati salvati
workbook.getPersistedData();        // restituisce any[][] | null
```

### Localizzazione (i18n)

```typescript
const options: JxCellOptions = {
  text: {
    noRecordsFound:               'Nessun risultato trovato',
    show:                         'Mostra',
    entries:                      'righe',
    insertANewRowBefore:          'Inserisci riga sopra',
    insertANewRowAfter:           'Inserisci riga sotto',
    deleteSelectedRows:           'Elimina righe selezionate',
    insertANewColumnBefore:       'Inserisci colonna prima',
    insertANewColumnAfter:        'Inserisci colonna dopo',
    deleteSelectedColumns:        'Elimina colonne selezionate',
    renameThisColumn:             'Rinomina colonna',
    orderAscending:               'Ordine crescente',
    orderDescending:              'Ordine decrescente',
    copy:                         'Copia',
    paste:                        'Incolla',
    search:                       'Cerca...',
    addRow:                       'Aggiungi riga',
    addColumn:                    'Aggiungi colonna',
    // {0} = pagina corrente, {1} = totale pagine
    showingPage:                  'Pagina {0} di {1}',
    areYouSureToDeleteTheSelectedRows: 'Eliminare le righe selezionate?',
    yesImSure:                    'Sì, elimina',
    notNow:                       'Annulla',
    rows:                         'righe',
    editComments:                 'Modifica commento',
    addComments:                  'Aggiungi commento',
    clearComments:                'Rimuovi commento',
    freezeColumns:                'Blocca colonne',
    unfreezeColumns:              'Sblocca colonne',
  },
};

// Accesso programmatico
workbook.getText('addRow');     // 'Aggiungi riga' (o il testo custom se impostato)
workbook.setDictionary({ addRow: 'Nuovo prodotto' }); // override a runtime
```

### Callback legacy (on*)

Tutte le callback vengono scatenate anche dagli eventi programmatici. Per scenari reattivi preferire i **RxJS stream** in `workbook.events.*`.

```typescript
const options: JxCellOptions = {
  // Chiamata DOPO che una cella cambia valore.
  // name = indirizzo A1, value = nuovo valore, oldValue = vecchio valore.
  onchange: (el, cell, name, value, oldValue) => { /* ... */ },

  // Chiamata PRIMA che una cella cambi.
  // Restituire false per bloccare la modifica.
  // Restituire un valore diverso per sostituire il valore committato.
  onbeforechange: (el, cell, name, value) => {
    if (value === 'VIETATO') return false;
  },

  // Chiamata dopo che più celle cambiano in una singola operazione (es. incolla).
  onafterchanges: (el, changes) => { /* ... */ },

  // Selezione cambiata.
  onselection: (el, x1, y1, x2, y2) => { /* ... */ },

  // Editor aperto su una cella.
  oneditionstart: (el, cell, x, y) => { /* ... */ },

  // Editor chiuso e valore committato.
  oneditionend: (el, cell, x, y, value) => { /* ... */ },

  // Riga inserita.
  oninsertrow: (el, rowIndex, amount) => { /* ... */ },
  // Prima di inserire una riga. false = blocca.
  onbeforeinsertrow: (el, rowIndex, amount) => {
    if (rowIndex > 100) return false;
  },

  // Riga eliminata.
  ondeleterow: (el, rowIndex, amount) => { /* ... */ },
  // Prima di eliminare una riga. false = blocca.
  onbeforedeleterow: (el, rowIndex, amount) => { /* ... */ },

  // Riga spostata.
  onmoverow: (el, from, to) => { /* ... */ },
  // Colonna spostata.
  onmovecolumn: (el, from, to) => { /* ... */ },
  // Colonna ridimensionata.
  onresizecolumn: (el, col, width) => { /* ... */ },
  // Riga ridimensionata.
  onresizerow: (el, row, height) => { /* ... */ },

  // Incolla completato.
  onpaste: (el, data) => { /* ... */ },
  // Prima dell'incolla. Restituire i dati (eventualmente trasformati).
  onbeforepaste: (el, data) => data.map(r => r.map(v => String(v).trim())),

  // Ordinamento completato.
  onsort: (col, direction) => { /* ... */ },

  // Valore footer cambiato.
  onfooterchange: (el, row, col, value) => { /* ... */ },

  // Dati salvati nel localStorage.
  onpersist: (key) => { /* ... */ },

  // Evento catch-all: riceve il nome dell'evento e gli argomenti.
  onevent: (eventName, ...args) => { /* ... */ },
};
```

---

## Definizione colonna (`JxCellColumn`)

Riferimento rapido di tutte le proprietà:

| Proprietà | Tipo | Default | Descrizione |
|---|---|---|---|
| `type` | `string` | `'text'` | Tipo editor (vedi §Tipi di colonna). |
| `title` | `string` | lettera | Etichetta header. Supporta formule (`=...`). |
| `name` | `string` | — | Chiave nell'oggetto dati. |
| `field` | `string` | — | Alias di `name`. |
| `width` | `number` | `150` | Larghezza in pixel. |
| `align` | `string` | `'left'` | Allineamento: `left` | `center` | `right`. |
| `readOnly` | `boolean` | `false` | Cella non modificabile dall'utente. |
| `hidden` | `boolean` | `false` | Nasconde la colonna dal DOM. |
| `sortable` | `boolean` | `true` | Abilita ordinamento tramite click header. |
| `sortFn` | `function` | — | Comparatore `(rowA, rowB, col) => number`. |
| `filterable` | `boolean` | `true` | Mostra input filtro colonna. |
| `source` | `any[]` | — | Opzioni per `dropdown` / `autocomplete`. |
| `autocompleteSource` | `JxAutocompleteSource` | — | Sorgente dinamica per `autocomplete`. |
| `filterFn` | `function` | — | Filtro opzioni `({ row }) => any[]`. |
| `decimal` | `string` | `'.'` | Separatore decimale per numerici. |
| `mask` | `string` | — | Maschera input (es. `'###,###.##'`). |
| `valueType` | `string` | `'string'` | Tipo nativo valore per colonne `custom`. |
| `headerComponent` | `Type<...>` | — | Componente Angular per la cella header. |
| `footerComponent` | `Type<...>` | — | Componente Angular per le celle footer. |
| `editor.component` | `Type<...>` | — | Componente Angular per le celle corpo. |
| `options` | `object` | `{}` | Opzioni extra per i componenti custom. |

### Tipi di colonna

| Tipo | Descrizione |
|---|---|
| `text` | Input testo semplice (default). |
| `numeric` / `number` | Input numerico con `decimal` e `mask` opzionali. |
| `formula` | Cella formula sola lettura, calcolata automaticamente. |
| `checkbox` | Toggle booleano (`true`/`false`). |
| `dropdown` | Selezione singola da `source`. |
| `autocomplete` | Dropdown con ricerca da `source` o `autocompleteSource`. |
| `calendar` / `date` | Datepicker integrato. |
| `color` | Color picker (valore hex `#rrggbb`). |
| `image` | Input URL immagine con preview. |
| `html` | Editor HTML. |
| `button` | Pulsante cliccabile. |
| `hidden` | Colonna nascosta (equivalente a `hidden: true`). |
| `custom` | Componente Angular via `editor.component`. |

### Colonna autocomplete

```typescript
columns: [
  // ── Sorgente statica ───────────────────────────────────────────────────
  {
    title: 'Paese', name: 'paese', type: 'autocomplete',
    autocompleteSource: ['Italia', 'Francia', 'Germania'],
  },

  // ── Sorgente asincrona (Promise) ───────────────────────────────────────
  // query = testo digitato. Restituire string[] o { id, name }[].
  {
    title: 'Città', name: 'citta', type: 'autocomplete',
    autocompleteSource: async (query) => {
      const res = await fetch(`/api/citta?q=${encodeURIComponent(query)}`);
      return res.json();
    },
  },

  // ── Sorgente Observable ────────────────────────────────────────────────
  // La libreria si sottoscrive e gestisce l'unsubscribe automaticamente.
  {
    title: 'Tag', name: 'tag', type: 'autocomplete',
    autocompleteSource: (query) => mioServizio.cercaTag(query),
  },
]
```

### Dropdown a cascata (filterFn)

```typescript
const MODELLI: Record<string, string[]> = {
  Toyota: ['Yaris', 'Corolla', 'RAV4'],
  BMW:    ['Serie 1', 'Serie 3', 'X5'],
};

columns: [
  {
    title: 'Marca', name: 'marca', type: 'dropdown',
    source: Object.keys(MODELLI),
  },
  {
    title: 'Modello', name: 'modello', type: 'dropdown',
    source: Object.values(MODELLI).flat(),
    // filterFn è chiamato ogni volta che l'utente apre il dropdown.
    // ctx.row = array completo della riga corrente (valori processati).
    filterFn: ({ row }) => MODELLI[row[0] as string] ?? [],
  },
]
```

---

## Servizio Workbook (`JxWorkbookService`)

Ricevuto tramite l'evento `(ready)`. Oppure: `@ViewChild(JxTableComponent).workbook`.

### Dati: lettura e scrittura

```typescript
// ── Lettura ────────────────────────────────────────────────────────────────

// Matrice dati processata (formule calcolate). Copia immutabile.
workbook.getData(): any[][]

// Matrice dati grezza (formule non calcolate, come digitato). Copia immutabile.
workbook.getRawData(): any[][]

// Array di oggetti con chiavi = name/field delle colonne. processed=true (default).
workbook.getJson(processed?: boolean): Record<string, any>[]

// Riga come oggetto (rowNumber 0-based). Senza rowNumber restituisce tutti.
workbook.getObject(rowNumber?: number, processed?: boolean)

// Array dei valori della riga r (0-based).
workbook.getRowData(r: number, processed?: boolean): any[]

// Array dei valori della colonna col (0-based).
workbook.getColumnData(col: number, processed?: boolean): any[]

// Valore processato di una cella (notazione A1).
workbook.getValue(cell: string): any

// Valore grezzo (formula come stringa) di una cella.
workbook.getRawValue(cell: string): any

// Valore tramite coordinate numeriche (0-based).
workbook.getValueFromCoords(x: number, y: number): any

// Copia immutabile dell'array grezzo della riga y.
workbook.getRow(y: number): readonly any[]

// Titoli delle colonne come array di stringhe.
workbook.getHeaders(): string[]

// Come getHeaders() ma con eventuali formule già risolte.
workbook.getEvaluatedHeaderTitles(): string[]

// Titolo risolto della singola colonna x.
workbook.getEvaluatedHeaderTitle(x: number): string

// Titolo risolto della cella (rowIndex, cellIndex) dei nested headers.
workbook.getEvaluatedNestedHeaderTitle(rowIndex: number, cellIndex: number): string

// Numero di righe dati.
workbook.getRowCount(): number

// Numero di colonne.
workbook.getColumnCount(): number

// Definizione JxCellColumn della colonna x. null se non configurata.
workbook.getColumnDef(x: number): JxCellColumn | null

// Configurazione corrente come JxCellOptions.
workbook.getConfig(): JxCellOptions

// ── Scrittura ──────────────────────────────────────────────────────────────

// Sostituisce tutti i dati.
workbook.setData(data: any[] | any[][]): void

// Aggiunge righe in coda senza cancellare i dati esistenti.
workbook.appendData(data: any[] | any[][]): void

// Elimina tutte le righe.
workbook.deleteAll(): void

// Imposta il valore di una cella (notazione A1). Registra nell'undo stack.
// Scatena beforeChange$ → change$ → afterChanges$.
workbook.setValue(cell: string, value: any): void

// Imposta una formula su una cella (alias di setValue).
workbook.setFormula(cell: string, expression: string): void

// Imposta lo stesso valore su più celle.
workbook.setMultipleCells(cells: string[], value: any): void

// Sostituisce i valori di un'intera riga (0-based).
workbook.setRowData(row: number, data: any[]): void

// Sostituisce i valori di un'intera colonna (0-based).
workbook.setColumnData(col: number, data: any[]): void

// Imposta il titolo (testo header) di una colonna.
workbook.setHeader(col: number, title: string): void

// Legge il titolo corrente di una colonna.
workbook.getHeader(col: number): string

// Forza il ricalcolo di tutte le formule.
workbook.recalculateAll(): void
```

### Righe e colonne

```typescript
// ── Inserimento ────────────────────────────────────────────────────────────

// Inserisce amount righe all'indice index (default: fine).
// rowData = oggetto con chiavi o array di valori.
workbook.insertRow(index?: number, amount?: number, rowData?: any): void

// Inserisce amount colonne all'indice index (default: fine).
workbook.insertColumn(index?: number, amount?: number, defaultValue?: any): void

// ── Eliminazione ───────────────────────────────────────────────────────────
workbook.deleteRow(index: number, amount?: number): void
workbook.deleteColumn(index: number, amount?: number): void

// ── Spostamento ────────────────────────────────────────────────────────────
// Aggiorna automaticamente i riferimenti delle formule.
workbook.moveRow(from: number, to: number): void
workbook.moveColumn(from: number, to: number): void

// ── Dimensioni ────────────────────────────────────────────────────────────
workbook.getWidth(col: number): number        // larghezza in px
workbook.setWidth(col: number, width: number): void
workbook.getHeight(row: number): number       // altezza in px
workbook.setHeight(row: number, height: number): void

// ── Stato configurazione ──────────────────────────────────────────────────
// true dopo il primo setConfig({ columns }) con colonne reali.
// Utile per distinguere il primo caricamento dai reload successivi
// (es. cambio periodo, aggiornamento dati) senza stato esterno al componente.
// Nuovo con v6.9.7.
//
// @example
// // Esegui autofit solo al primo caricamento, poi lascia i resize manuali intatti:
// if (!wb.configuredOnce) { autofit.schedule(); }
workbook.configuredOnce: boolean              // getter, readonly

// ── Fill (riempimento) ─────────────────────────────────────────────────────
// Replica il valore di (fromX, fromY) verso il basso fino a toY.
// Formule → aggiusta i riferimenti di riga.
// autoIncrement=true → incrementa numeri e serie.
workbook.fillDown(fromX: number, fromY: number, toY: number): void

// Replica il valore di (fromX, fromY) verso destra fino a toX.
workbook.fillRight(fromX: number, fromY: number, toX: number): void

// ── Allineamento ───────────────────────────────────────────────────────────
workbook.setColumnAlign(col: number, align: 'left' | 'center' | 'right'): void

// ── Iniezione ─────────────────────────────────────────────────────────────
// Inserisce la matrice 2D data a partire dalla cella (x, y).
workbook.injectArray(x: number, y: number, data: any[][]): void
```

### Celle: stile, sola lettura, classi, commenti, metadati

```typescript
// ── STILI ─────────────────────────────────────────────────────────────────

// Cella singola (notazione A1).
workbook.setCellStyle(cell: string, style: JxCellStyle): void

// Riga intera (0-based).
workbook.setRowStyle(row: number, style: JxCellStyle): void

// Colonna intera (0-based).
workbook.setColumnStyle(col: number, style: JxCellStyle): void

// Cella header (0-based).
workbook.setHeaderColumnStyle(col: number, style: JxCellStyle): void
workbook.clearHeaderColumnStyle(col: number): void

// Cella footer [fx=item, fy=riga] (entrambi 0-based).
workbook.setFooterCellStyle(fx: number, fy: number, style: JxCellStyle): void
workbook.setFooterRowStyle(fy: number, style: JxCellStyle): void
workbook.clearFooterCellStyle(fx: number, fy: number): void

// Nested header [rowIdx=riga, cellIdx=cella] (entrambi 0-based).
workbook.setNestedHeaderCellStyle(rowIdx: number, cellIdx: number, style: JxCellStyle): void
workbook.setNestedHeaderRowStyle(rowIdx: number, style: JxCellStyle): void
workbook.clearNestedHeaderCellStyle(rowIdx: number, cellIdx: number): void

// Annulla stili (senza argomento annulla tutto).
workbook.clearCellStyle(cell: string): void
workbook.clearRowStyle(row: number): void
workbook.clearColumnStyle(col: number): void
workbook.clearAllStyles(): void
workbook.resetStyle(cell?: string): void

// Legge lo stile corrente (composizione di cella + riga + colonna).
workbook.getStyle(cell: string): JxCellStyle | null
workbook.getCellStyle(cell: string): JxCellStyle

// ── SOLA LETTURA ──────────────────────────────────────────────────────────

// Imposta sola lettura su cella, riga o colonna.
workbook.setCellReadonly(cell: string, readonly: boolean): void
workbook.setRowReadonly(row: number, readonly: boolean): void
workbook.setColumnReadonly(col: number, readonly: boolean): void
workbook.clearAllReadonly(): void

// Verifica sola lettura (controlla cella, riga e colonna).
workbook.isReadOnly(cell: string): boolean

// Blocco globale: impedisce QUALSIASI modifica (anche programmatica).
workbook.setLocked(locked: boolean): void
workbook.isLocked(): boolean

// ── CLASSI CSS ────────────────────────────────────────────────────────────

// Aggiunge classi CSS a una cella (spazio-separati).
workbook.addClass(cell: string, className: string): void

// Rimuove una classe. Senza className rimuove tutte.
workbook.removeClass(cell: string, className?: string): void

// Restituisce il Set delle classi applicate.
workbook.getClasses(cell: string): Set<string>

// ── COMMENTI ──────────────────────────────────────────────────────────────

// Imposta un commento (mostra triangolino rosso nell'angolo).
workbook.setComments(cell: string, comment: string): void

// Legge commento (senza arg → tutti i commenti).
workbook.getComments(cell?: string): string | Record<string, string>

// Cancella commento (senza arg → tutti).
workbook.clearComments(cell?: string): void

// ── METADATI ──────────────────────────────────────────────────────────────

// Imposta metadati su una cella (non visibili).
workbook.setMeta(cell: string, data: Record<string, any>): void

// Aggiunge/aggiorna chiavi specifiche nei metadati.
workbook.updateMeta(cell: string, data: Record<string, any>): void

// Legge metadati (senza arg → tutti).
workbook.getMeta(cell?: string): Record<string, any> | Record<string, Record<string, any>>

// ── LABEL / INDIRIZZO ─────────────────────────────────────────────────────

// Indirizzo A1 di una cella.
workbook.getLabel(cell: string): string

// Indirizzo A1 dalle coordinate numeriche.
workbook.getLabelFromCoords(x: number, y: number): string

// Lettera colonna dall'indice 0-based.
workbook.getColumnName(index: number): string   // es. 0 → 'A', 26 → 'AA'

// Indice 0-based dalla lettera colonna.
workbook.getIdFromColumnName(name: string): number

// Indice colonna cercando per name/field. -1 se non trovata.
workbook.getColumnByKey(key: string): number

// Label display di un valore dropdown (es. traduce l'id nel nome).
workbook.getDropDownValue(col: number, key: any): string

// Elemento DOM della cella.
workbook.getCellFromCoords(x: number, y: number): HTMLElement | null
```

**Proprietà di `JxCellStyle`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `color` | `string` | Colore testo (es. `'#dc2626'`). |
| `backgroundColor` | `string` | Colore sfondo. |
| `fontWeight` | `string` | Spessore font: `'bold'` \| `'normal'`. |
| `fontStyle` | `string` | Stile font: `'italic'` \| `'normal'`. |
| `fontFamily` | `string` | Famiglia font. |
| `fontSize` | `string` | Dimensione font (es. `'14px'`). |
| `textAlign` | `string` | Allineamento: `'left'` \| `'center'` \| `'right'`. |
| `textDecoration` | `string` | Decorazione (es. `'underline'`). |
| `border` | `string` | Bordo shorthand (es. `'1px solid #000'`). |
| `borderTop` | `string` | Bordo superiore. |
| `borderBottom` | `string` | Bordo inferiore. |
| `borderLeft` | `string` | Bordo sinistro. |
| `borderRight` | `string` | Bordo destro. |

### Selezione e navigazione

```typescript
// Legge la selezione corrente.
workbook.getSelection(): JxSelection | null

// Imposta la selezione tramite i due angoli.
workbook.setSelection(sel: JxSelection): void
workbook.updateSelectionFromCoords(x1: number, y1: number, x2: number, y2: number): void

// Seleziona tutto.
workbook.selectAll(): void

// Azzera la selezione.
workbook.resetSelection(): void

// Aggiorna la visualizzazione della selezione.
workbook.refreshSelection(): void

// Indici righe selezionate (quelle con tutte le colonne selezionate).
workbook.getSelectedRows(): number[]

// Indici colonne selezionate.
workbook.getSelectedColumns(): number[]

// Selezione come array di nomi cella A1.
workbook.getHighlighted(): string[]

// ── Navigazione tastiera ───────────────────────────────────────────────────
// shift=true estende la selezione; ctrl=true salta a inizio/fine.
workbook.up(shift?: boolean, ctrl?: boolean): void
workbook.down(shift?: boolean, ctrl?: boolean): void
workbook.left(shift?: boolean, ctrl?: boolean): void
workbook.right(shift?: boolean, ctrl?: boolean): void
workbook.first(shift?: boolean, ctrl?: boolean): void  // salta a A1
workbook.last(shift?: boolean, ctrl?: boolean): void   // salta all'ultima cella

interface JxSelection {
  x1: number;  // colonna inizio (0-based)
  y1: number;  // riga inizio (0-based)
  x2: number;  // colonna fine (0-based)
  y2: number;  // riga fine (0-based)
}
```

### Ordinamento e ricerca

```typescript
workbook.sort(col: number, direction: 'asc' | 'desc' | null): void
workbook.clearSort(): void
workbook.orderBy(col: number, asc: boolean): void   // alias di sort()
workbook.getSortState(): JxSortState | null         // { columnIndex, direction } | null

workbook.search(query: string): void
workbook.resetSearch(): void
workbook.getSearchQuery(): string

workbook.setColumnFilter(col: number, value: string): void
workbook.getColumnFilter(col: number): string
workbook.getColumnFilters(): Map<number, string>
workbook.clearColumnFilters(): void
workbook.openFilter(): void
workbook.closeFilter(): void
workbook.resetFilters(): void   // alias di clearColumnFilters
```

### Paginazione

```typescript
workbook.page(n: number): void       // vai alla pagina n (0-based)
workbook.setPage(n: number): void    // alias
workbook.nextPage(): void
workbook.prevPage(): void
workbook.firstPage(): void
workbook.lastPage(): void
workbook.loadUp(): void              // alias di prevPage()
workbook.loadDown(): void            // alias di nextPage()
workbook.getPageCount(): number
workbook.whichPage(): number
workbook.getPageSize(): number
workbook.getPageRange(): [number, number]   // [primaRiga, ultimaRiga] inclusivi
```

### Unione celle

```typescript
workbook.setMerge(cell: string, colspan?: number, rowspan?: number): void
workbook.removeMerge(cell: string): void
workbook.getMerge(cell?: string): Record<string,[number,number]> | [number,number] | null
workbook.destroyMerged(): void
workbook.hasMergedCells(): boolean
workbook.isColumnMerged(col: number): boolean
workbook.isRowMerged(row: number): boolean
workbook.isColMerged(col: number): boolean  // alias di isColumnMerged()
```

### Undo / Redo

```typescript
workbook.undo(): boolean    // false se lo stack è vuoto
workbook.redo(): boolean
workbook.canUndo(): boolean
workbook.canRedo(): boolean
workbook.setHistory(): void // svuota lo stack undo/redo

workbook.events.undo$.subscribe(() => { /* undo eseguito */ });
workbook.events.redo$.subscribe(() => { /* redo eseguito */ });
```

### Visibilità righe e colonne

```typescript
workbook.hideRow(row: number): void
workbook.showRow(row: number): void
workbook.isRowHidden(row: number): boolean
workbook.getHiddenRows(): Set<number>

workbook.hideColumn(col: number): void
workbook.showColumn(col: number): void
workbook.isColHidden(col: number): boolean
workbook.getHiddenColumns(): Set<number>

// Colonna degli indici riga (numeri 1,2,3...)
workbook.hideIndex(): void
workbook.showIndex(): void

// Emette ogni volta che la visibilità cambia.
workbook.visibility$.subscribe(() => { /* ri-renderizza */ });
```

### Footer: dati e visibilità

```typescript
// ── Dati ──────────────────────────────────────────────────────────────────

// Legge il valore calcolato (true) o la formula grezza (false).
workbook.getFooter(row: number, col: number, processed?: boolean): any

// Matrice completa.
workbook.getFooters(processed?: boolean): any[][]

// Imposta cella footer. Registra nell'undo stack.
workbook.setFooter(row: number, col: number, value: any): void

// Sostituisce tutta la configurazione footer.
workbook.setFooters(footers: any[][]): void

// ── Visibilità ────────────────────────────────────────────────────────────

workbook.hideFooterRow(fy: number): void
workbook.showFooterRow(fy: number): void
workbook.toggleFooterRow(fy: number): void
workbook.isFooterRowHidden(fy: number): boolean

// Alterna tutte le righe con fy > headerFy.
// Restituisce: true=collassato, false=espanso.
workbook.toggleFooterGroup(headerFy: number): boolean

// true se la riga headerFy+1 è nascosta.
workbook.isFooterGroupCollapsed(headerFy: number): boolean

// Emette ogni volta che i dati o la visibilità del footer cambiano.
workbook.footers$.subscribe(footerRows => { /* ri-renderizza */ });
```

### Persistenza

```typescript
workbook.saveState(): void       // alias: save()
workbook.clearPersistence(): void
workbook.getPersistedData(): any[][] | null
```

### Configurazione reattiva

```typescript
// Aggiorna le opzioni a runtime senza re-inizializzare la griglia.
workbook.setConfig(patch: Partial<JxCellOptions>): void

workbook.getConfig(): JxCellOptions

workbook.config$.subscribe(() => { /* config aggiornata */ });
workbook.loading$.subscribe(isLoading => { /* spinner */ });
workbook.locked$.subscribe(locked => { /* UI bloccata */ });
```

### Operazioni remote e CSV

```typescript
// Ricarica i dati dall'URL configurato in options.url.
workbook.refresh(): Promise<void>

// Scarica i dati come file CSV.
// includeHeaders: default = options.includeHeadersOnDownload.
workbook.download(includeHeaders?: boolean): void

// Parsa una stringa CSV in matrice 2D di stringhe. Compatibile RFC 4180.
workbook.parseCSV(str: string, delimiter?: string): string[][]
```

### Utility, i18n, hash

```typescript
workbook.getText(key: keyof JxCellText): string
workbook.setDictionary(text: Partial<JxCellText>): void
workbook.hash(): string                        // hash dei dati correnti
workbook.getFreezeWidth(): number              // px delle colonne congelate
workbook.destroy(): void                       // distrugge il workbook
workbook.dispatch(name: string, detail?: any, element?: EventTarget): void
workbook.executeFormula(expression: string): any
workbook.parseNumber(value: string): number    // '1.234,56' → 1234.56
workbook.parseValue(value: any, col: number): any
workbook.doubleDigitFormat(n: number): string  // 7 → '07'
workbook.validLetter(c: string): boolean       // 'A' → true
workbook.getColumnNameFromId(index: number): string   // alias di getColumnName()
workbook.getJsonRow(row: number): Record<string, any>
workbook.setCheckRadioValue(x: number, y: number, value: boolean): void
workbook.setExtensions(ext: Record<string, any>): void
```

### Stream reattivi (events)

Tutti i `before*` stream emettono un `JxCancellableEvent`:
- `e.cancel()`: blocca l'operazione
- `e.cancelled`: boolean
- `e.setResult(v)`: (solo `beforeEditionEnd$`) sovrascrive il valore committato

```typescript
// ── Before-events (cancellabili) ─────────────────────────────────────────

workbook.events.beforeChange$.subscribe(e => {
  // e.data: { x, y, cellName, value, oldValue, columnDef, rowData }
  if (e.data.value === '') e.cancel();
});

workbook.events.beforeInsertRow$.subscribe(e => {
  // e.data: { rowIndex, amount, rowCount, affectedRows }
  if (e.data.rowCount >= 100) e.cancel();
});

workbook.events.beforeDeleteRow$.subscribe(e => {
  // e.data: { rowIndex, amount, rowCount, affectedRows }
});

workbook.events.beforeInsertColumn$.subscribe(e => { /* { colIndex, amount, colCount, affectedCols } */ });
workbook.events.beforeDeleteColumn$.subscribe(e => { /* ... */ });
workbook.events.beforeMoveColumn$.subscribe(e => { /* { from, to, columnDef } */ });
workbook.events.beforeMoveRow$.subscribe(e => { /* { from, to, rowData } */ });

workbook.events.beforePaste$.subscribe(e => {
  // e.data: { data, startX, startY, endX, endY }
  // Trasforma prima del commit:
  e.data.data = e.data.data.map(r => r.map(v => String(v).trim()));
});

workbook.events.beforeMerge$.subscribe(e => { /* { cellName, colspan, rowspan, x, y } */ });
workbook.events.beforeResizeColumn$.subscribe(e => { /* { colIndex, width, oldWidth, columnDef } */ });
workbook.events.beforeResizeRow$.subscribe(e => { /* { rowIndex, height, oldHeight, rowData } */ });

workbook.events.beforeEditionEnd$.subscribe(e => {
  // e.data: { x, y, cellName, value, oldValue, columnDef, save }
  e.setResult(String(e.data.value).toUpperCase()); // trasforma prima del salvataggio
});

// ── After-events ─────────────────────────────────────────────────────────

workbook.events.change$.subscribe(e => {
  // { x, y, cellName, value, oldValue, columnDef, rowData }
});
workbook.events.afterChanges$.subscribe(e => {
  // { changes: [{ x, y, name, oldValue, newValue }] }
});
workbook.events.insertRow$.subscribe(e => { /* { rowIndex, amount, rowCount, affectedRows } */ });
workbook.events.deleteRow$.subscribe(e => { /* ... */ });
workbook.events.insertColumn$.subscribe(e => { /* { colIndex, amount, colCount, affectedCols } */ });
workbook.events.deleteColumn$.subscribe(e => { /* ... */ });
workbook.events.moveRow$.subscribe(e => { /* { from, to, rowData } */ });
workbook.events.moveColumn$.subscribe(e => { /* { from, to, columnDef } */ });
workbook.events.paste$.subscribe(e => { /* { data, startX, startY, endX, endY } */ });
workbook.events.merge$.subscribe(e => { /* { cellName, colspan, rowspan, x, y } */ });
workbook.events.resizeColumn$.subscribe(e => { /* { colIndex, width, oldWidth, columnDef } */ });
workbook.events.resizeRow$.subscribe(e => { /* { rowIndex, height, oldHeight, rowData } */ });
workbook.events.selection$.subscribe(s => { /* { x1, y1, x2, y2 } */ });
workbook.events.selectStart$.subscribe(s => { /* { x1, y1, x2, y2 } */ });
workbook.events.editionStart$.subscribe(e => { /* { x, y, cellName, currentValue, columnDef } */ });
workbook.events.editionEnd$.subscribe(e => { /* { x, y, cellName, value, oldValue, save, columnDef } */ });
workbook.events.sort$.subscribe(e => { /* { columnIndex, direction, columnDef, columnTitle } */ });
workbook.events.footerChange$.subscribe(e => { /* { row, col, value, oldValue } */ });
workbook.events.persist$.subscribe(e => { /* { key } */ });
workbook.events.undo$.subscribe(() => { });
workbook.events.redo$.subscribe(() => { });
workbook.events.click$.subscribe(e => { /* { x, y, cellName } */ });
workbook.events.focus$.subscribe(e => { /* { x, y, cellName } */ });
workbook.events.blur$.subscribe(e => { /* { x, y, cellName } */ });
workbook.events.load$.subscribe(() => { /* griglia pronta */ });
workbook.events.destroy$.subscribe(() => { /* griglia distrutta */ });
workbook.events.changeHeader$.subscribe(e => { /* { col, oldTitle, newTitle } */ });
workbook.events.cancelCell$.subscribe(e => { /* { x, y, cellName } — Escape premuto */ });
workbook.events.changeMeta$.subscribe(e => { /* { cell, meta } */ });
workbook.events.changeStyle$.subscribe(e => { /* { cells: string[] } */ });
workbook.events.copy$.subscribe(e => { /* { data: any[][], cut: boolean } */ });
```

**Tabella completa degli stream:**

| Stream | Payload | Annullabile |
|---|---|---|
| `beforeChange$` | `JxCancellableEvent<JxChangePayload>` | ✅ |
| `change$` | `JxChangePayload` | — |
| `afterChanges$` | `JxAfterChangesPayload` | — |
| `beforeInsertRow$` | `JxCancellableEvent<JxRowOpPayload>` | ✅ |
| `insertRow$` | `JxRowOpPayload` | — |
| `beforeDeleteRow$` | `JxCancellableEvent<JxRowOpPayload>` | ✅ |
| `deleteRow$` | `JxRowOpPayload` | — |
| `beforeInsertColumn$` | `JxCancellableEvent<JxColOpPayload>` | ✅ |
| `insertColumn$` | `JxColOpPayload` | — |
| `beforeDeleteColumn$` | `JxCancellableEvent<JxColOpPayload>` | ✅ |
| `deleteColumn$` | `JxColOpPayload` | — |
| `beforeMoveRow$` | `JxCancellableEvent<JxMoveRowPayload>` | ✅ |
| `moveRow$` | `JxMoveRowPayload` | — |
| `beforeMoveColumn$` | `JxCancellableEvent<JxMoveColPayload>` | ✅ |
| `moveColumn$` | `JxMoveColPayload` | — |
| `beforePaste$` | `JxCancellableEvent<JxPastePayload>` | ✅ |
| `paste$` | `JxPastePayload` | — |
| `beforeMerge$` | `JxCancellableEvent<JxMergePayload>` | ✅ |
| `merge$` | `JxMergePayload` | — |
| `beforeResizeColumn$` | `JxCancellableEvent<JxResizeColPayload>` | ✅ |
| `resizeColumn$` | `JxResizeColPayload` | — |
| `beforeResizeRow$` | `JxCancellableEvent<JxResizeRowPayload>` | ✅ |
| `resizeRow$` | `JxResizeRowPayload` | — |
| `selection$` | `JxSelection` | — |
| `editionStart$` | `JxEditionStartPayload` | — |
| `beforeEditionEnd$` | `JxCancellableEvent<JxBeforeEditionEndPayload>` | ✅ |
| `editionEnd$` | `JxEditionEndPayload` | — |
| `sort$` | `JxSortPayload` | — |
| `footerChange$` | `JxFooterChangePayload` | — |
| `persist$` | `JxPersistPayload` | — |
| `undo$` | `void` | — |
| `redo$` | `void` | — |
| `click$` | `{ x, y, cellName }` | — |
| `focus$` | `{ x, y, cellName }` | — |
| `blur$` | `{ x, y, cellName }` | — |
| `load$` | `void` (una sola volta) | — |
| `destroy$` | `void` | — |
| `changeHeader$` | `{ col, oldTitle, newTitle }` | — |
| `cancelCell$` | `{ x, y, cellName }` | — |
| `changeMeta$` | `{ cell, meta }` | — |
| `changeStyle$` | `{ cells: string[] }` | — |
| `copy$` | `{ data: any[][], cut: boolean }` | — |
| `selectStart$` | `{ x1, y1, x2, y2 }` | — |

### BehaviorSubject interni

| Stream | Tipo | Descrizione |
|---|---|---|
| `data$` | `BehaviorSubject<any[][]>` | Matrice dati processata. Emette dopo ogni modifica. |
| `footers$` | `BehaviorSubject<any[][]>` | Matrice footer processata. Emette dopo ogni modifica/visibilità. |
| `selection$` | `BehaviorSubject<JxSelection | null>` | Selezione corrente. |
| `sort$` | `BehaviorSubject<JxSortState | null>` | Stato ordinamento. |
| `search$` | `BehaviorSubject<Set<number>>` | Righe nascoste dalla ricerca globale. |
| `columnFilter$` | `BehaviorSubject<Set<number>>` | Righe nascoste dai filtri colonna. |
| `page$` | `BehaviorSubject<number>` | Indice pagina corrente (0-based). |
| `styles$` | `BehaviorSubject<void>` | Emette quando gli stili cambiano. |
| `visibility$` | `BehaviorSubject<void>` | Emette quando la visibilità di righe/colonne cambia. |
| `readonly$` | `BehaviorSubject<void>` | Emette quando le impostazioni sola-lettura cambiano. |
| `comments$` | `BehaviorSubject<void>` | Emette quando i commenti cambiano. |
| `cellClasses$` | `BehaviorSubject<void>` | Emette quando le classi CSS delle celle cambiano. |
| `locked$` | `BehaviorSubject<boolean>` | Stato blocco globale. |
| `config$` | `BehaviorSubject<void>` | Emette dopo setConfig(). |
| `loading$` | `BehaviorSubject<boolean>` | Stato caricamento remoto. |

---

## Barra strumenti: sistema plugin

I plugin estendono la toolbar senza modificare `options.toolbar`.

```typescript
import { JxToolbarPlugin, JxToolbarPluginContext, JxToolbarItem } from 'jx-cell';
import { Subscription } from 'rxjs';

export class MioPluginToolbar implements JxToolbarPlugin {
  // Identificatore univoco. Usato per deduplicare i plugin se le options
  // vengono ricostruite (evita doppia registrazione).
  readonly id = 'mio-plugin';

  // Etichetta leggibile (opzionale, per debug).
  readonly label = 'Mio Plugin';

  private wb!: any;
  private subs = new Subscription();

  // Chiamato UNA SOLA VOLTA quando la griglia è pronta.
  // ctx.workbook = JxWorkbookService dell'istanza.
  init(ctx: JxToolbarPluginContext): void {
    this.wb = ctx.workbook;

    // Puoi reagire agli eventi per aggiornare lo stato dei bottoni.
    this.subs.add(this.wb.events.change$.subscribe(() => {
      // es. abilita il bottone "salva" se ci sono modifiche non salvate
    }));
  }

  // Chiamato quando la griglia viene distrutta.
  // IMPORTANTE: pulisci sempre le sottoscrizioni qui.
  destroy(): void {
    this.subs.unsubscribe();
    this.wb = null!;
  }

  // Voci toolbar aggiuntive (appese DOPO le voci built-in di options.toolbar).
  readonly items: JxToolbarItem[] = [
    { type: 'divisor' },
    {
      type: 'i',
      content: 'save',
      tooltip: 'Salva',
      // onclick(el, workbook, item): el=DOM bottone, workbook=JxWorkbookService
      onclick: (_el, wb) => wb.saveState(),
    },
    {
      type: 'i', content: 'undo', tooltip: 'Annulla',
      onclick: (_el, wb) => wb.undo(),
    },
    {
      type: 'i', content: 'redo', tooltip: 'Ripristina',
      onclick: (_el, wb) => wb.redo(),
    },
    {
      type: 'select',
      k: 'font-family',
      v: ['Arial', 'Georgia', 'Courier New', 'Verdana'],
      tooltip: 'Font',
    },
  ];
}

// Registrazione nelle options
const options: JxCellOptions = {
  toolbar: [ /* voci built-in */ ],
  toolbarPlugins: [new MioPluginToolbar()],
};
```

---

## Celle personalizzate — guida completa

**Requisiti per TUTTI i componenti custom:**
- `standalone: false` — OBBLIGATORIO (non funzionano se standalone)
- Dichiarati in `declarations[]` del modulo che importa `JxCellModule`
- Consigliato: `ChangeDetectionStrategy.OnPush` per le performance

---

### Cella corpo (Body Cell)

Sostituisce il contenuto della `<td>` nelle righe dati. Usato per colonne di tipo `custom`.

```typescript
import {
  Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { JxCustomCellComponent, JxCustomCellContext } from 'jx-cell';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mia-cella',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      context.value        = valore processato (formula calcolata)
      context.displayValue = valore formattato per la visualizzazione
      context.editable     = true se la cella è modificabile
      context.row          = array completo della riga (valori processati)
      context.x / y        = coordinate 0-based
      context.cellName     = indirizzo A1 (es. 'B3')
      context.column       = JxCellColumn
      context.column.options = opzioni extra passate nella definizione colonna
      context.api          = JxWorkbookService (accesso completo al workbook)
      context.instance     = JxTableComponent
    -->

    <!-- Visualizzazione -->
    <span *ngIf="!editing"
          [class.errore]="context.value < 0"
          (dblclick)="apriEditor()">
      {{ context.displayValue }}
    </span>

    <!-- Editor inline -->
    <input *ngIf="editing"
           type="number"
           [value]="context.value"
           (blur)="salva($event)"
           (keydown.enter)="salva($event)"
           (keydown.escape)="chiudi()" />
  `,
})
export class MiaCellaComponent extends JxCustomCellComponent implements OnInit, OnDestroy {
  // OBBLIGATORIO
  @Input() override context!: JxCustomCellContext;

  editing = false;
  private subs = new Subscription();

  constructor(private cdr: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    // Reagisci ai cambiamenti (es. ricalcolo formule).
    this.subs.add(this.context.api.data$.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  apriEditor(): void {
    if (!this.context.editable) return;
    this.editing = true;
  }

  salva(event: Event): void {
    const v = parseFloat((event.target as HTMLInputElement).value);
    // Salva il valore → registra nell'undo stack, scatena change$.
    this.context.setValue(isNaN(v) ? 0 : v);
    this.editing = false;
  }

  chiudi(): void { this.editing = false; }
}
```

```typescript
// Dichiarazione nel modulo
@NgModule({ declarations: [MiaCellaComponent] })
export class AppModule {}

// Registrazione nella colonna
{
  title: 'Importo', name: 'importo', type: 'custom',
  valueType: 'number',
  editor: { component: MiaCellaComponent },
  options: { valuta: 'EUR', massimo: 9999 },
}
```

**Tutte le proprietà di `JxCustomCellContext<T>`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `x` / `columnIndex` | `number` | Indice colonna (0-based). |
| `y` / `rowIndex` | `number` | Indice riga (0-based). |
| `cellName` | `string` | Indirizzo A1 (es. `'B3'`). |
| `value` | `any` | Valore processato (formule calcolate). |
| `displayValue` | `any` | Valore formattato per la visualizzazione. |
| `row` | `T | any[]` | Array completo della riga corrente (processato). |
| `column` | `JxCellColumn?` | Definizione della colonna. `column.options` = opzioni custom. |
| `editable` | `boolean` | `true` se la cella è modificabile dall'utente. |
| `api` | `JxWorkbookService` | Accesso completo al workbook. |
| `instance` | `JxTableComponent` | Istanza del componente table. |
| `setValue(v)` | `(v: any) => void` | Salva il valore (registra undo, emette eventi). |
| `getValue()` | `() => any` | Legge il valore processato corrente. |
| `startEdit()` | `() => void` | Apre l'editor inline built-in. |
| `recalculate()` | `() => void` | Forza ricalcolo formule. |
| `focusCell()` | `() => void` | Mette il focus sulla cella. |

---

### Cella intestazione (Header Cell)

Sostituisce il rendering predefinito (titolo + icona sort) nell'header di una colonna.

```typescript
import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { JxCustomHeaderComponent, JxHeaderCellContext } from 'jx-cell';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mio-header',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      context.title         = titolo risolto (formule già calcolate)
      context.x             = indice colonna 0-based
      context.sortDirection = 'asc' | 'desc' | null
      context.column        = JxCellColumn (con column.options)
      context.sort()        = attiva ordinamento (cicla asc→desc→originale)
      context.api           = JxWorkbookService
    -->

    <div class="header" (click)="context.sort()">
      <span>{{ context.sortDirection === 'asc' ? '▲' : context.sortDirection === 'desc' ? '▼' : '↕' }}</span>
      <span style="flex:1; font-weight:700">{{ context.title }}</span>
      <span *ngIf="media !== null" style="font-size:10px; opacity:.7">
        Ø {{ media | number:'1.1-1' }}
      </span>
    </div>
  `,
})
export class MioHeaderComponent implements JxCustomHeaderComponent, OnInit, OnDestroy {
  @Input() context!: JxHeaderCellContext;

  media: number | null = null;
  private subs = new Subscription();

  ngOnInit(): void {
    // Aggiorna la media ogni volta che i dati cambiano.
    this.subs.add(this.context.api.data$.subscribe(data => {
      const col = this.context.x;
      const vals = data.map(r => Number(r[col])).filter(v => !isNaN(v));
      this.media = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
```

```typescript
// Dichiarazione nel modulo
@NgModule({ declarations: [MioHeaderComponent] })

// Registrazione nella colonna
{
  title: 'Importo', name: 'importo', type: 'numeric',
  headerComponent: MioHeaderComponent,
  options: { budget: 1000 },
}
```

**Proprietà di `JxHeaderCellContext`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `x` / `columnIndex` | `number` | Indice colonna (0-based). |
| `title` | `string` | Titolo risolto (formule calcolate). |
| `column` | `JxCellColumn?` | Definizione colonna completa (con `column.options`). |
| `sortDirection` | `'asc' | 'desc' | null` | Ordinamento corrente. |
| `sort()` | `() => void` | Attiva l'ordinamento (cicla asc→desc→originale). |
| `api` | `JxWorkbookService` | Accesso al workbook. |
| `instance` | `JxTableComponent` | Istanza table. |

---

### Cella footer (Footer Cell)

Sostituisce il testo predefinito nelle celle del `<tfoot>`.
Può essere associata a una **colonna** (via `column.footerComponent`) o a una
**cella specifica** del footer (via `footerComponent` nell'oggetto cella).

```typescript
import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { JxCustomFooterComponent, JxFooterCellContext } from 'jx-cell';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gauge-footer',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      context.fx           = indice item nell'array della riga footer (0-based)
      context.fy           = indice riga footer (0-based)
      context.logicalCol   = indice colonna logico (somma colspan precedenti)
      context.colspan      = colspan di questa cella
      context.value        = valore grezzo (formula o letterale)
      context.displayValue = valore calcolato/visualizzato
      context.column       = JxCellColumn (colonna a logicalCol)
      context.column.options = opzioni custom (fuse: colonna + cella)
      context.api          = JxWorkbookService
    -->
    <div class="gauge">
      <span>{{ context.displayValue | number:'1.0-0' }}</span>
      <div class="bar">
        <div class="fill" [style.width.%]="pct" [class.over]="pct >= 100"></div>
      </div>
      <span style="opacity:.5">/ {{ target }}</span>
    </div>
  `,
  styles: [`.gauge{display:flex;align-items:center;gap:6px}
            .bar{flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden}
            .fill{height:100%;background:#10b981;transition:width .3s}
            .over{background:#ef4444}`],
})
export class GaugeFooterComponent implements JxCustomFooterComponent, OnInit, OnDestroy {
  @Input() context!: JxFooterCellContext;

  pct = 0;
  target = 1000;
  private subs = new Subscription();

  ngOnInit(): void {
    this.target = this.context.column?.options?.['target'] ?? 1000;

    // Aggiorna ogni volta che il footer viene ricalcolato.
    this.subs.add(this.context.api.footers$.subscribe(() => {
      const val = Number(this.context.displayValue);
      this.pct = isNaN(val) ? 0 : Math.min(200, (val / this.target) * 100);
    }));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
```

```typescript
// ── Associazione a livello COLONNA ────────────────────────────────────────
// Il componente viene usato per TUTTE le celle footer di questa colonna.
{
  title: 'Totale', name: 'totale', type: 'formula',
  footerComponent: GaugeFooterComponent,
  options: { target: 5000 },
}
// Il valore della cella footer si dichiara comunque in options.footers[]:
footers: [['', '=SUM(G1:G99)']],

// ── Associazione a livello CELLA ──────────────────────────────────────────
// Ha priorità sul footerComponent della colonna.
footers: [[{
  value: '=SUM(G1:G99)',
  footerComponent: GaugeFooterComponent,
  options: { target: 9999 },   // merge con options della colonna; cella sovrascrive
}]],
```

**Proprietà di `JxFooterCellContext`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `fx` | `number` | Indice item nell'array della riga footer. |
| `fy` | `number` | Indice riga footer (0-based). |
| `logicalCol` | `number` | Indice colonna logico (somma colspan precedenti). |
| `colspan` | `number` | Colspan di questa cella. |
| `value` | `any` | Valore grezzo (formula o letterale). |
| `displayValue` | `any` | Valore calcolato/visualizzato. |
| `column` | `JxCellColumn?` | Colonna a `logicalCol`. `column.options` è la fusione di opzioni colonna+cella. |
| `api` | `JxWorkbookService` | Accesso al workbook. |
| `instance` | `JxTableComponent` | Istanza table. |

---

### Footer collassabile (`JxCustomFooterBase`)

`JxCustomFooterBase` è la classe base per componenti footer che controllano
la visibilità delle righe footer successive (pattern accordion/toggle).

```typescript
import {
  Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import { JxCustomFooterBase, JxFooterCellContext } from 'jx-cell';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collapsible-toggle',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      Al click chiama api.toggleFooterGroup(context.fy):
      nasconde/mostra tutte le righe footer con fy > context.fy.

      context.fy                          = indice riga toggle (es. 0)
      context.column.options.label        = etichetta del bottone
      context.column.options.collapsedByDefault = parte collassato?
    -->
    <button type="button" class="toggle" (click)="toggle()">
      <span>{{ collapsed ? '▶' : '▼' }}</span>
      <span style="flex:1">{{ label }}</span>
      <span *ngIf="collapsed && hiddenCount > 0" style="opacity:.6;font-size:10px">
        ({{ hiddenCount }} righe nascoste)
      </span>
    </button>
  `,
  styles: [`.toggle{display:flex;align-items:center;gap:6px;background:none;
             border:none;cursor:pointer;font:inherit;font-weight:600;
             width:100%;padding:2px 4px;border-radius:3px}
            .toggle:hover{background:rgba(0,0,0,.05)}`],
})
export class CollapsibleFooterToggleComponent
    extends JxCustomFooterBase implements OnInit, OnDestroy {

  @Input() override context: JxFooterCellContext = undefined!;

  collapsed = false;
  private subs = new Subscription();

  constructor(private cdr: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    const api = this.context?.api;
    const opts: any = this.context?.column?.options ?? {};

    // Se collapsedByDefault=true, collassa dopo l'init (setTimeout per evitare
    // ExpressionChangedAfterCheck durante il primo ciclo di change detection).
    if (opts['collapsedByDefault']) {
      this.collapsed = true;
      setTimeout(() => {
        api?.toggleFooterGroup(this.context.fy);
        this.cdr.markForCheck();
      }, 0);
    }

    // Sincronizza lo stato se il footer viene ricostruito dall'esterno
    // (es. dopo setFooters() o recalculateAll()).
    if (api?.footers$) {
      this.subs.add(api.footers$.subscribe(() => {
        this.collapsed = !!api.isFooterGroupCollapsed?.(this.context.fy);
        this.cdr.markForCheck();
      }));
    }
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  toggle(): void {
    const api = this.context?.api;
    if (!api?.toggleFooterGroup) return;
    // toggleFooterGroup(fy) nasconde/mostra tutte le righe con indice > fy.
    // Restituisce true=collassato, false=espanso.
    this.collapsed = api.toggleFooterGroup(this.context.fy);
    this.cdr.markForCheck();
  }

  get label(): string {
    return this.context?.column?.options?.['label']
        ?? this.context?.displayValue ?? '';
  }

  get hiddenCount(): number {
    const api = this.context?.api;
    if (!api || !this.collapsed) return 0;
    const total = (api as any).footerRawData?.length ?? 0;
    let count = 0;
    for (let r = (this.context.fy ?? 0) + 1; r < total; r++) {
      if (api.isFooterRowHidden(r)) count++;
    }
    return count;
  }
}
```

```typescript
// Dichiarazione nel modulo
@NgModule({ declarations: [CollapsibleFooterToggleComponent] })

// Uso nelle options
const options: JxCellOptions = {
  stickyFooter: true,
  footers: [
    // Riga 0: toggle — controlla le righe 1-N
    [{
      value: '▼ Totali',
      colspan: 16,
      footerComponent: CollapsibleFooterToggleComponent,
      options: {
        label: 'Riepilogo totali',
        collapsedByDefault: false,   // true = inizia collassato
      },
    }],
    // Riga 1: nascosta/visibile dal toggle
    ['', '=SUM(B1:B12)', '', '=SUM(D1:D12)'],
    // Riga 2: nascosta/visibile dal toggle
    ['', '', '', '', '', 'Totale gen.', '=SUM(G1:G12)'],
  ],
};
```

**Come funziona internamente:**
1. Click → `toggle()` chiama `api.toggleFooterGroup(this.context.fy)`
2. `toggleFooterGroup(0)` aggiunge/rimuove `fy=1, 2, ...` da `hiddenFooterRows`
3. Emette `footers$.next([...footers])` → il componente riceve l'aggiornamento
4. Il template Angular rivaluta `[hidden]="workbook.isFooterRowHidden(fy)"` per ogni `<tr>`
5. Il calcolo `sticky bottom` si aggiorna escludendo le righe nascoste

---

### Cella sub-header (Nested Header Cell)

Sostituisce il testo predefinito nelle celle dei nested headers.

```typescript
import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { JxCustomNestedHeaderBase, JxNestedHeaderCellContext } from 'jx-cell';

@Component({
  selector: 'app-gruppo-header',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      context.title      = testo (con formule calcolate)
      context.colspan    = colonne coperte
      context.rowIndex   = indice riga nestedHeaders (0-based)
      context.cellIndex  = indice cella nella riga (0-based)
      context.logicalCol = indice colonna logico del primo elemento coperto
      context.api        = JxWorkbookService
    -->
    <div class="gruppo" [style.border-bottom]="'2px solid ' + colore">
      <span>{{ icona }}</span>
      <span style="flex:1;font-weight:800;font-size:11px;text-transform:uppercase">
        {{ title }}
      </span>
      <span *ngIf="colspan > 1"
            style="background:#6366f1;color:#fff;border-radius:9px;padding:0 5px;font-size:10px">
        ×{{ colspan }}
      </span>
    </div>
  `,
})
export class GruppoHeaderComponent extends JxCustomNestedHeaderBase implements OnInit {
  // OBBLIGATORIO
  @Input() override context: JxNestedHeaderCellContext = undefined!;

  colore = '#6366f1';
  icona  = '';

  // Palette colori ciclici
  private static readonly PALETTE = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444'];

  ngOnInit(): void {
    this.colore = GruppoHeaderComponent.PALETTE[
      this.cellIndex % GruppoHeaderComponent.PALETTE.length
    ];
    const t = this.title.toLowerCase();
    this.icona = t.includes('calcol') ? '∑' : t.includes('data') ? '📅' : '🔲';
  }
}
```

```typescript
// Dichiarazione nel modulo
@NgModule({ declarations: [GruppoHeaderComponent] })

// Registrazione nelle options
nestedHeaders: [[
  { title: 'Anagrafica', colspan: 2, component: GruppoHeaderComponent },
  { title: 'Calcoli',    colspan: 6, component: GruppoHeaderComponent },
  { title: 'Opzioni',    colspan: 3 }, // rendering default
]]
```

**Getter di convenienza di `JxCustomNestedHeaderBase`** (evitano `this.context.*`):

```typescript
get title(): string        // context.title (titolo risolto)
get rowIndex(): number     // context.rowIndex
get cellIndex(): number    // context.cellIndex
get logicalCol(): number   // context.logicalCol
get colspan(): number      // context.colspan
```

**Proprietà di `JxNestedHeaderCellContext`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `rowIndex` | `number` | Indice riga `nestedHeaders` (0-based). |
| `cellIndex` | `number` | Indice cella nella riga (0-based). |
| `logicalCol` | `number` | Indice colonna logico del primo elemento coperto. |
| `colspan` | `number` | Colonne coperte. |
| `title` | `string` | Titolo risolto (formule calcolate). |
| `api` | `JxWorkbookService` | Accesso al workbook. |
| `instance` | `JxTableComponent` | Istanza table. |

---

## Context menu personalizzato

```typescript
@ViewChild('menuTpl') menuTpl!: TemplateRef<any>;

buildOptions(): JxCellOptions {
  return {
    contextMenu: {
      template: this.menuTpl,   // TemplateRef ottenuto da ngAfterViewInit
      showDefaultItems: false,  // nasconde le voci built-in
    },
  };
}
```

```html
<!--
  $implicit = JxContextMenuContext
  close     = callback per chiudere il menu
-->
<ng-template #menuTpl let-ctx="$implicit" let-close="close">
  <div class="menu">
    <div style="padding:4px 8px;opacity:.6;font-size:11px">
      <strong>{{ ctx.cellName }}</strong> = {{ ctx.value }}
    </div>
    <hr />
    <button (click)="ctx.workbook.insertRow(ctx.y, 1); close()">
      ➕ Inserisci riga sopra
    </button>
    <button (click)="ctx.workbook.deleteRow(ctx.y, 1); close()"
            [disabled]="ctx.workbook.getRowCount() <= 1">
      🗑️ Elimina riga {{ ctx.y + 1 }}
    </button>
    <hr />
    <button (click)="ctx.workbook.setCellStyle(ctx.cellName, { fontWeight:'bold' }); close()">
      B Grassetto
    </button>
    <button (click)="ctx.workbook.resetStyle(ctx.cellName); close()">
      ✕ Rimuovi stile
    </button>
  </div>
</ng-template>
```

**Proprietà di `JxContextMenuContext`:**

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `x` | `number` | Indice colonna (0-based). |
| `y` | `number` | Indice riga (0-based). |
| `cellName` | `string` | Indirizzo A1 (es. `'B3'`). |
| `value` | `any` | Valore corrente della cella. |
| `row` | `readonly any[]` | Array completo della riga. |
| `columnDef` | `JxCellColumn | null` | Definizione colonna. |
| `workbook` | `JxWorkbookService` | Workbook per operazioni. |
| `instance` | `JxTableComponent` | Istanza table. |
| `close()` | `() => void` | Chiude il menu. |

---

## Temi e stili

`jx-table` usa un sistema di temi a **tre livelli** identico a quello di `jx-grid`:
compile-time SCSS, runtime globale e runtime per istanza.

### Isolamento CSS e multi-istanza

Tutti i selettori del tema sono scopati sotto l'elemento host `jx-table`:

```css
/* CSS generato dalla libreria */
jx-table .jexcel_container { ... }
jx-table .jexcel tbody td  { ... }
jx-table .jexcel_toolbar   { ... }
```

Questo garantisce:
- **Zero conflitti** con la libreria jExcel originale (stesse classi `jexcel_*`)
- **Isolamento completo** tra più istanze `<jx-table>` sulla stessa pagina
- Ogni istanza può avere il proprio tema via CSS custom properties (vedi §Runtime per istanza)

Eccezioni globali (appese a `body` a runtime): `.jdropdown-container`, `.jcontextmenu`,
`.jx-toolbar-combo-menu` (overlay context menu / autocomplete / combo toolbar).

---

### 1 — Compile-time: variabili SCSS (massima priorità)

Sovrascrivere le `$jx-*` **prima** del `@use` modifica i valori compilati nel CSS finale.
Funziona quando i sorgenti SCSS della libreria sono disponibili nell'app.

```scss
// styles.scss — PRIMA di @use 'jx-cell/theme'
@use 'jx-cell/theme' with (
  // ── Tipografia ─────────────────────────────────────────────
  $jx-font-family:        'Roboto, sans-serif',
  $jx-font-size-xs:       11px,
  $jx-font-size-sm:       12px,
  $jx-font-size-md:       13px,

  // ── Brand ──────────────────────────────────────────────────
  $jx-primary:            #e63946,
  $jx-primary-hover:      #c0162a,
  $jx-accent:             #f97316,
  $jx-success:            #16a34a,
  $jx-danger:             #dc2626,
  $jx-warning:            #d97706,
  $jx-fill-handle:        #217346,

  // ── Superfici ──────────────────────────────────────────────
  $jx-cell-bg:            #ffffff,
  $jx-cell-alt-bg:        #f9fafb,
  $jx-cell-soft-bg:       #f3f4f6,
  $jx-header-bg:          #f1f5f9,
  $jx-footer-bg:          #f1f5f9,
  $jx-filter-bg:          #f1f5f9,
  $jx-filter-input-bg:    #ffffff,
  $jx-container-bg:       #ffffff,

  // ── Testo ──────────────────────────────────────────────────
  $jx-text:               #111827,
  $jx-text-muted:         #6b7280,
  $jx-header-text:        #374151,

  // ── Bordi ──────────────────────────────────────────────────
  $jx-border:             #e5e7eb,
  $jx-border-strong:      #d1d5db,
  $jx-filter-border:      #e5e7eb,

  // ── Selezione / hover ──────────────────────────────────────
  $jx-selection:          rgba(229,57,70,.07),
  $jx-selection-border:   #e63946,
  $jx-row-hover:          rgba(229,57,70,.04),

  // ── Overlay: context menu ──────────────────────────────────
  $jx-ctx-bg:             #ffffff,
  $jx-ctx-border:         #e5e7eb,
  $jx-ctx-text:           #111827,
  $jx-ctx-hover-bg:       #f3f4f6,

  // ── Overlay: autocomplete ──────────────────────────────────
  $jx-ac-bg:              #ffffff,
  $jx-ac-border:          #e5e7eb,
  $jx-ac-hover-bg:        #fff0f1,

  // ── Scrollbar ──────────────────────────────────────────────
  $jx-scrollbar-thumb:        #d1d5db,
  $jx-scrollbar-thumb-hover:  #9ca3af,
  $jx-scrollbar-size:         7px,

  // ── Forma ──────────────────────────────────────────────────
  $jx-radius-sm:          3px,
  $jx-radius-md:          6px,
  $jx-container-radius:   4px,

  // ── Dimensioni ─────────────────────────────────────────────
  $jx-header-height:      34px,
  $jx-row-height:         32px,
  $jx-toolbar-height:     36px,

  // ── Transizioni ────────────────────────────────────────────
  $jx-transition:         0.12s ease,
);
```

### 2 — Runtime globale: tutti i `jx-table` della pagina

```css
:root {
  --jx-primary:          #e63946;
  --jx-cell-bg:          #fffdf0;
  --jx-header-bg:        #1e293b;
  --jx-header-text:      #f8fafc;
  --jx-border:           #e2e8f0;
  --jx-selection-border: #e63946;
  --jx-container-radius: 4px;
}
```

### 3 — Runtime per istanza: solo un `jx-table` specifico

L'override si applica su `.jexcel_container` (l'elemento radice renderizzato dalla libreria)
oppure direttamente su `jx-table`:

```css
/* via classe sull'elemento padre */
.mia-sezione .jexcel_container {
  --jx-primary:    #059669;
  --jx-row-hover:  rgba(5,150,105,.04);
}

/* oppure direttamente sull'host Angular */
.mia-sezione jx-table {
  --jx-primary: #059669;
}
```

### Esempio: skin scura per `jx-table`

```css
.dark-sheet .jexcel_container {
  --jx-cell-bg:          #0e1628;
  --jx-cell-alt-bg:      #121a2c;
  --jx-cell-soft-bg:     #151e35;
  --jx-header-bg:        #101726;
  --jx-footer-bg:        #101726;
  --jx-filter-bg:        #101726;
  --jx-text:             #c9d8f0;
  --jx-text-muted:       rgba(122,154,191,.70);
  --jx-header-text:      rgba(122,154,191,.70);
  --jx-border:           rgba(88,130,220,.12);
  --jx-border-strong:    rgba(88,130,220,.22);
  --jx-primary:          #4f8ef7;
  --jx-primary-bg:       rgba(79,142,247,.08);
  --jx-selection-border: #4f8ef7;
  --jx-row-hover:        rgba(79,142,247,.04);
  --jx-ctx-bg:           #1e293b;
  --jx-ctx-border:       rgba(255,255,255,.08);
  --jx-ctx-text:         #c9d8f0;
  --jx-ctx-hover-bg:     rgba(255,255,255,.06);
  --jx-ac-bg:            #1e293b;
  --jx-ac-border:        rgba(255,255,255,.08);
  --jx-scrollbar-thumb:  rgba(255,255,255,.15);
}
```

### Tabella completa dei token `--jx-*`

#### Tipografia

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-font-family` | `$jx-font-family` | `'Inter', system-ui` | Font celle e UI |
| `--jx-font-size-xs` | `$jx-font-size-xs` | `11px` | Testo mini (header label) |
| `--jx-font-size-sm` | `$jx-font-size-sm` | `12px` | Testo secondario |
| `--jx-font-size-md` | `$jx-font-size-md` | `13px` | Testo corpo celle |

#### Brand / Accenti

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-primary` | `$jx-primary` | `#2563eb` | Colore principale (selezione, accenti) |
| `--jx-primary-hover` | `$jx-primary-hover` | `#1d4ed8` | Hover primario |
| `--jx-primary-bg` | `$jx-primary-bg` | `rgba(37,99,235,.07)` | Sfondo range selezionato |
| `--jx-primary-bg-mid` | `$jx-primary-bg-mid` | `rgba(37,99,235,.14)` | Sfondo cella attiva nel range |
| `--jx-accent` | `$jx-accent` | `#3b82f6` | Indicatori drag/resize/copy |
| `--jx-fill-handle` | `$jx-fill-handle` | `#217346` | Maniglia di riempimento |
| `--jx-success` | `$jx-success` | `#16a34a` | Stato positivo |
| `--jx-danger` | `$jx-danger` | `#dc2626` | Stato errore / azione distruttiva |
| `--jx-danger-bg` | `$jx-danger-bg` | `#fef2f2` | Sfondo errore |
| `--jx-warning` | `$jx-warning` | `#d97706` | Stato avvertimento |

#### Superfici

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-cell-bg` | `$jx-cell-bg` | `#ffffff` | Sfondo celle **⚠️ Opaco** |
| `--jx-cell-alt-bg` | `$jx-cell-alt-bg` | `#f8fafc` | Righe pari (zebra) **⚠️ Opaco** |
| `--jx-cell-soft-bg` | `$jx-cell-soft-bg` | `#f1f5f9` | Celle sola lettura |
| `--jx-header-bg` | `$jx-header-bg` | `#f1f5f9` | Thead + colonna numeri riga **⚠️ Opaco** |
| `--jx-footer-bg` | `$jx-footer-bg` | `#f1f5f9` | Footer **⚠️ Opaco** |
| `--jx-filter-bg` | `$jx-filter-bg` | `#f1f5f9` | Riga filtri |
| `--jx-filter-input-bg` | `$jx-filter-input-bg` | `#ffffff` | Sfondo input filtro |
| `--jx-container-bg` | `$jx-container-bg` | `#ffffff` | Sfondo contenitore |
| `--jx-overlay-bg` | `$jx-overlay-bg` | `rgba(255,255,255,.75)` | Overlay loading |

#### Testo

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-text` | `$jx-text` | `#1e293b` | Colore testo celle |
| `--jx-text-muted` | `$jx-text-muted` | `#64748b` | Testo secondario / placeholder |
| `--jx-header-text` | `$jx-header-text` | `#475569` | Testo intestazioni colonne |
| `--jx-filter-input-color` | `$jx-filter-input-color` | `#1e293b` | Testo input filtro |

#### Bordi

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-border` | `$jx-border` | `#e2e8f0` | Bordi celle e separatori |
| `--jx-border-strong` | `$jx-border-strong` | `#cbd5e1` | Bordo esterno contenitore |
| `--jx-filter-border` | `$jx-filter-border` | `#e2e8f0` | Bordo input filtro |

#### Selezione e stati riga

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-selection` | `$jx-selection` | `rgba(37,99,235,.07)` | Sfondo range selezionato |
| `--jx-selection-border` | `$jx-selection-border` | `#2563eb` | Contorno cella attiva |
| `--jx-selection-border-width` | `$jx-selection-border-width` | `2px` | Spessore del bordo perimetrale della selezione |
| `--jx-selection-range-bg` | `$jx-selection-range-bg` | `rgba(37,99,235,.3)` | Sfondo (tint) del range selezionato — copre anche il contenuto interno delle celle |
| `--jx-row-hover` | `$jx-row-hover` | `rgba(37,99,235,.04)` | Sfondo riga hover |

#### Overlay: context menu

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-ctx-bg` | `$jx-ctx-bg` | `#ffffff` | Sfondo menu |
| `--jx-ctx-border` | `$jx-ctx-border` | `#e2e8f0` | Bordo menu |
| `--jx-ctx-text` | `$jx-ctx-text` | `#1e293b` | Testo voci |
| `--jx-ctx-hover-bg` | `$jx-ctx-hover-bg` | `#f1f5f9` | Hover voce |
| `--jx-ctx-separator` | `$jx-ctx-separator` | `#f1f5f9` | Separatore |
| `--jx-ctx-danger` | `$jx-ctx-danger` | `#dc2626` | Voce distruttiva |
| `--jx-ctx-danger-hover` | `$jx-ctx-danger-hover` | `#fef2f2` | Hover voce distruttiva |

#### Overlay: autocomplete

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-ac-bg` | `$jx-ac-bg` | `#ffffff` | Sfondo lista |
| `--jx-ac-border` | `$jx-ac-border` | `#e2e8f0` | Bordo lista |
| `--jx-ac-text` | `$jx-ac-text` | `#1e293b` | Testo opzioni |
| `--jx-ac-hover-bg` | `$jx-ac-hover-bg` | `#eff6ff` | Hover opzione |
| `--jx-ac-hover-text` | `$jx-ac-hover-text` | `#1d4ed8` | Testo hover |
| `--jx-ac-active-bg` | `$jx-ac-active-bg` | `#dbeafe` | Opzione attiva |

#### Overlay: popup commento

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-comment-bg` | `$jx-comment-bg` | `#fffde7` | Sfondo popup |
| `--jx-comment-border` | `$jx-comment-border` | `#fde047` | Bordo popup |
| `--jx-comment-header-bg` | `$jx-comment-header-bg` | `#fef08a` | Header popup |
| `--jx-comment-text` | `$jx-comment-text` | `#374151` | Testo commento |
| `--jx-indicator-danger` | `$jx-indicator-danger` | `#dc2626` | Triangolino indicatore |

#### Scrollbar

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-scrollbar-track` | `$jx-scrollbar-track` | `transparent` | Traccia scrollbar |
| `--jx-scrollbar-thumb` | `$jx-scrollbar-thumb` | `#cbd5e1` | Cursore scrollbar |
| `--jx-scrollbar-thumb-hover` | `$jx-scrollbar-thumb-hover` | `#94a3b8` | Cursore hover |
| `--jx-scrollbar-size` | `$jx-scrollbar-size` | `7px` | Spessore scrollbar |

#### Forma ed elevazione

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-radius-sm` | `$jx-radius-sm` | `3px` | Raggio piccolo (input, badge) |
| `--jx-radius-md` | `$jx-radius-md` | `6px` | Raggio medio (dropdown) |
| `--jx-radius-lg` | `$jx-radius-lg` | `10px` | Raggio grande (overlay) |
| `--jx-container-radius` | `$jx-container-radius` | `8px` | Raggio contenitore principale |
| `--jx-shadow` | `$jx-shadow` | _(box-shadow)_ | Ombra contenitore |
| `--jx-shadow-overlay` | `$jx-shadow-overlay` | _(box-shadow)_ | Ombra overlay |
| `--jx-container-shadow` | `$jx-container-shadow` | _(box-shadow)_ | Ombra container card |

#### Dimensioni

| Token CSS | Var SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-header-height` | `$jx-header-height` | `34px` | Altezza riga intestazione |
| `--jx-row-height` | `$jx-row-height` | `32px` | Altezza riga dati |
| `--jx-toolbar-height` | `$jx-toolbar-height` | `36px` | Altezza toolbar |
| `--jx-transition` | `$jx-transition` | `0.12s ease` | Durata transizioni CSS |

---

## Icone personalizzate

Tutte le icone di sistema usate da `jx-table` (ordinamento, menu contestuale, paginazione, freccia combo della toolbar, chiusura del popup commento, placeholder del filtro colonna) sono personalizzabili tramite l'`InjectionToken` **`JX_ICONS`**.

La mappa di override è strutturata in due livelli — **nome componente → chiave icona → valore** — così si capisce a colpo d'occhio a quale componente appartiene ogni icona. Ogni chiave che **non** fornisci usa automaticamente l'icona di sistema di default (`JX_DEFAULT_ICONS`).

Un valore icona può essere un semplice glifo (`'▲'`), un'entità HTML (`'&#x2398;'`), markup HTML (`'<i class="fa fa-copy"></i>'`) o un SVG inline (`'<svg>…</svg>'`): viene reso tramite `[innerHTML]`.

> ⚠️ **Sicurezza** — I valori passano per `bypassSecurityTrustHtml`, necessario per consentire SVG/HTML. Devono quindi provenire dallo sviluppatore (configurazione fidata), **mai** da input utente.

### Configurazione

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { JxCellModule, JX_ICONS, JxIconOverrides } from 'jx-cell';

const MY_ICONS: JxIconOverrides = {
  'jx-table': {
    // Ordinamento (intestazioni di colonna)
    sortAsc:  '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M7 14l5-5 5 5z" fill="currentColor"/></svg>',
    sortDesc: '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>',
    sortNone: '<i class="fa fa-sort"></i>',

    // Filtro colonna (solo testo: il placeholder non rende HTML/SVG)
    filterPlaceholder: 'Cerca…',

    // Menu contestuale
    contextCopy:  '<i class="fa fa-copy"></i>',
    contextPaste: '<i class="fa fa-paste"></i>',

    // Paginazione
    pageFirst:    '«',
    pagePrevious: '‹',
    pageNext:     '›',
    pageLast:     '»',

    // Le chiavi non elencate mantengono il default di sistema
  },
};

@NgModule({
  imports: [JxCellModule],
  providers: [
    { provide: JX_ICONS, useValue: MY_ICONS },
  ],
})
export class AppModule {}
```

### Chiavi disponibili per `jx-table`

| Chiave | Default | Dove appare |
|---|---|---|
| `sortAsc` | `▲` | Indicatore ordinamento crescente (header) |
| `sortDesc` | `▼` | Indicatore ordinamento decrescente (header) |
| `sortNone` | `⇅` | Colonna ordinabile non ordinata (header) |
| `comboArrow` | `▼` | Freccia dropdown dei combo della toolbar |
| `filterPlaceholder` | `🔍` | Placeholder dell'input filtro colonna *(solo testo)* |
| `filterIndicator` | _(funnel SVG)_ | Icona filtro sull'header di colonna (colonne filtrabili, evidenziata se il filtro è attivo) |
| `contextCopy` | `⎘` | Menu contestuale → Copia |
| `contextPaste` | `⎙` | Menu contestuale → Incolla |
| `contextInsertRowBefore` | `⤒` | Menu contestuale → Inserisci riga prima |
| `contextInsertRowAfter` | `⤓` | Menu contestuale → Inserisci riga dopo |
| `contextDeleteRows` | `✕` | Menu contestuale → Elimina righe |
| `contextInsertColumnBefore` | `⤐` | Menu contestuale → Inserisci colonna prima |
| `contextInsertColumnAfter` | `⤑` | Menu contestuale → Inserisci colonna dopo |
| `contextDeleteColumns` | `✕` | Menu contestuale → Elimina colonne |
| `contextOrderAsc` | `▲` | Menu contestuale → Ordina crescente |
| `contextOrderDesc` | `▼` | Menu contestuale → Ordina decrescente |
| `pageFirst` | `⇤` | Paginazione → Prima pagina |
| `pagePrevious` | `‹` | Paginazione → Pagina precedente |
| `pageNext` | `›` | Paginazione → Pagina successiva |
| `pageLast` | `⇥` | Paginazione → Ultima pagina |
| `addColumn` | `+` | Pulsante "aggiungi colonna" |
| `commentClose` | `✕` | Pulsante chiusura popup commento |

> La chiave `filterPlaceholder` è renderizzata in un attributo `placeholder`, quindi accetta **solo testo semplice** (niente HTML/SVG). Tutte le altre chiavi supportano glifo, HTML o SVG.

### Come funziona internamente

Il servizio `JxIconService` (`providedIn: 'root'`) risolve ogni icona con la precedenza **override → default**:

```typescript
import { JxIconService } from 'jx-cell';

// component / key → SafeHtml (per [innerHTML]) — supporta glifo/HTML/SVG
icons.get('jx-table', 'sortAsc');

// component / key → string grezza (per attributi testuali, es. placeholder)
icons.getRaw('jx-table', 'filterPlaceholder');
```

Il componente `jx-table` espone due helper usati internamente dal template, utili anche nelle tue celle personalizzate se inietti lo stesso servizio:

| Helper | Ritorna | Uso |
|---|---|---|
| `icon(key)` | `SafeHtml` | Binding `[innerHTML]` (glifo/HTML/SVG) |
| `iconRaw(key)` | `string` | Contesti solo-testo (es. `[attr.placeholder]`) |

---

## Indirizzi e formule

```typescript
import { JxAddressService } from 'jx-cell';

const addr = new JxAddressService();

addr.columnName(0);    // 'A'
addr.columnName(25);   // 'Z'
addr.columnName(26);   // 'AA'
addr.columnIndex('B'); // 1
addr.cellName(2, 4);   // 'C5'   (col=2 → C, row=4 → riga 5)
addr.cellCoords('C5'); // { x: 2, y: 4 }

// Esecuzione formula (senza associarla a nessuna cella)
workbook.executeFormula('=SUM(A1:A10)');
workbook.executeFormula('=IF(B2>100,"Alto","Basso")');
workbook.executeFormula('=CONCATENATE(A1," ",B1)');
workbook.executeFormula('=AVERAGE(C1:C50)');
workbook.executeFormula('=COUNTA(D1:D100)');

// Celle
workbook.setFormula('D1', '=A1*B1+C1');
workbook.getRawValue('D1');  // '=A1*B1+C1' (grezzo)
workbook.getValue('D1');     // risultato calcolato
```

**Formule in titoli colonna, nested-header e footer:**

Qualsiasi stringa che inizia con `=` viene rivalutata automaticamente
ad ogni `recalculateAll()`.

```typescript
// Titolo colonna dinamico
columns: [{
  title: '=CONCATENATE("Q.tà (tot: ", SUM(B1:B999), ")")',
  name: 'qty', type: 'numeric',
}],

// Nested header dinamico
nestedHeaders: [[{
  title: '=CONCATENATE("Finanziari (", COUNTA(C1:C999), " righe)")',
  colspan: 4,
}]],

// Footer
footers: [[
  '=SUM(B1:B999)',
  '=AVERAGE(C1:C999)',
  '=MAX(D1:D999)',
  '=CONCATENATE("Tot: €", SUM(G1:G999))',
]],
```

---

## Esempio completo

```typescript
import { Component, ViewChild } from '@angular/core';
import { JxCellOptions, JxWorkbookService, JxTableComponent } from 'jx-cell';

interface Prodotto {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
  disponibile: boolean;
}

@Component({
  selector: 'app-prodotti',
  template: `
    <jx-table [options]="opzioni" (ready)="onReady($event)"></jx-table>
    <button (click)="wb.undo()" [disabled]="!wb?.canUndo()">↩</button>
    <button (click)="wb.download(true)">Esporta CSV</button>
  `,
})
export class ProdottiComponent {
  @ViewChild(JxTableComponent)
  grid!: JxTableComponent<Prodotto>;

  wb!: JxWorkbookService<Prodotto>;

  opzioni: JxCellOptions<Prodotto> = {
    data: [
      { id: 1, nome: 'Widget A', categoria: 'Utensili',    prezzo: 12.99, disponibile: true },
      { id: 2, nome: 'Widget B', categoria: 'Ferramenta', prezzo: 49.00, disponibile: false },
    ],
    columns: [
      { title: 'ID',          name: 'id',          type: 'numeric',  width: 60,  readOnly: true,  align: 'center' },
      { title: 'Nome',        name: 'nome',        type: 'text',     width: 200, sortable: true },
      { title: 'Categoria',   name: 'categoria',   type: 'dropdown', width: 130,
        source: ['Utensili', 'Ferramenta', 'Elettronica'] },
      { title: 'Prezzo €',    name: 'prezzo',      type: 'numeric',  width: 100, align: 'right', decimal: '.' },
      { title: 'Disponibile', name: 'disponibile', type: 'checkbox', width: 90,  align: 'center' },
    ],
    nestedHeaders: [[
      { title: 'Identificazione', colspan: 2 },
      { title: 'Dati commerciali', colspan: 3 },
    ]],
    footers: [[
      { value: 'TOTALE', colspan: 3 },
      { value: '=SUM(D1:D999)' },
      { value: '=COUNTA(A1:A999)' },
    ]],
    stickyHeader: true,
    stickyFooter: true,
    tableHeight: '450px',
    tableOverflow: true,
    sortable: true,
    search: true,
    columnFilter: true,
    pagination: 20,
    editable: true,
    allowManualInsertRow: true,
    columnResize: true,
    enableFillHandle: true,
    toolbar: [
      { type: 'i', content: 'format_bold',   k: 'font-weight', v: 'bold',   tooltip: 'Grassetto' },
      { type: 'i', content: 'format_italic', k: 'font-style',  v: 'italic', tooltip: 'Corsivo' },
      { type: 'divisor' },
      { type: 'color', content: 'format_color_text', k: 'color', tooltip: 'Colore testo' },
    ],
    persistence: 'prodotti-v1',
    text: {
      noRecordsFound: 'Nessun prodotto trovato',
      addRow: 'Aggiungi prodotto',
    },
    onbeforechange: (_el, _cell, _name, value) => {
      if (String(_name ?? '').startsWith('A')) return false; // blocca colonna ID
    },
  };

  onReady(wb: JxWorkbookService<Prodotto>): void {
    this.wb = wb;

    wb.events.change$.subscribe(e =>
      console.log(`${e.cellName}: "${e.oldValue}" → "${e.value}"`)
    );

    wb.events.beforeDeleteRow$.subscribe(e => {
      if (wb.getRowCount() <= 1) {
        e.cancel();
        alert('Deve rimanere almeno un prodotto.');
      }
    });

    wb.events.beforeEditionEnd$.subscribe(e => {
      if (e.data.x === 1) {
        e.setResult(String(e.data.value).toUpperCase());
      }
    });
  }
}
```

---

## Licenza

MIT

---

## Componente `jx-grid` — data-grid nativo Angular

`jx-grid` è una griglia dati leggera costruita interamente in Angular.
Usa `*ngFor` + `<jx-cell-host>` dinamico e si integra perfettamente con
il sistema di dependency injection Angular.

### Quando usare `jx-grid` vs `jx-table`

| Caratteristica | `jx-table` | `jx-grid` |
|---|---|---|
| Motore | motore interno della libreria | Angular nativo (`*ngFor`) |
| Funzionalità avanzate (merge, formula engine, sticky header, …) | ✅ | ❌ |
| API RxJS / `JxWorkbookService` | ✅ | ❌ |
| Dataset molto grandi con virtual scroll | ✅ built-in | ✅ built-in |
| Tipizzazione generica `T` | ❌ (array di array) | ✅ `JxGridComponent<T>` |
| Celle Angular custom native | parziale | ✅ |
| Change detection OnPush-friendly | parziale | ✅ |

---

### Setup e utilizzo base

```typescript
// app.module.ts — JxCellModule include già jx-grid
import { JxCellModule } from 'jx-cell';

@NgModule({ imports: [JxCellModule] })
export class AppModule {}
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { JxColumn, JxGridOptions } from 'jx-cell';

interface Prodotto {
  id: number;
  nome: string;
  prezzo: number;
  disponibile: boolean;
}

@Component({
  selector: 'app-root',
  template: `
    <jx-grid
      [data]="prodotti"
      [columns]="colonne"
      [options]="opzioni"
      (cellChange)="onCambiamento($event)"
      (rowSelect)="onRigaSelezionata($event)">
    </jx-grid>
  `,
})
export class AppComponent {
  prodotti: Prodotto[] = [
    { id: 1, nome: 'Widget A', prezzo: 29.90, disponibile: true  },
    { id: 2, nome: 'Widget B', prezzo: 49.90, disponibile: false },
  ];

  colonne: JxColumn<Prodotto>[] = [
    { key: 'id',           label: '#',            type: 'number',   width: 60,  editable: false },
    { key: 'nome',         label: 'Nome',          type: 'text',     width: 200 },
    { key: 'prezzo',       label: 'Prezzo',        type: 'number',   width: 110, decimals: 2, prefix: '€ ' },
    { key: 'disponibile',  label: 'Disponibile',   type: 'checkbox', width: 100 },
  ];

  opzioni: JxGridOptions = {
    editable: true,
    selectable: true,
    rowHeight: 40,
  };

  onCambiamento(e: any) {
    console.log('cambio cella', e.column.key, '→', e.newValue);
  }

  onRigaSelezionata(row: Prodotto) {
    console.log('riga selezionata', row);
  }
}
```

---

### Opzioni (`JxGridOptions`)

| Proprietà | Tipo | Default | Descrizione |
|---|---|---|---|
| `editable` | `boolean` | `false` | Abilita la modifica delle celle. |
| `selectable` | `boolean` | `false` | Abilita la selezione riga (emit `rowSelect`). |
| `autoHeight` | `boolean` | `false` | La griglia si espande senza scrollbar interna. Incompatibile con `virtualScroll`. |
| `rowHeight` | `number` | `40` | Altezza riga in pixel. Usato anche dal virtual scroll per il calcolo delle posizioni. |
| `emptyMessage` | `string` | `'Nessun dato disponibile'` | Messaggio mostrato quando `data` è vuoto. |
| `trackByKey` | `string` | — | Chiave di riga usata da Angular `trackBy` per il riuso dei DOM node. |
| `virtualScroll` | `boolean` | `false` | Attiva il virtual scroll (vedi sezione dedicata). |
| `virtualScrollHeight` | `string` | `'400px'` | Altezza CSS del container quando `virtualScroll` è attivo. |

---

### Colonne (`JxColumn<T>`)

```typescript
interface JxColumn<T = any> {
  key:            keyof T | string;   // campo del row object (obbligatorio)
  label:          string;             // testo header (obbligatorio)
  type?:          JxCellType;         // 'text' | 'number' | 'checkbox' | 'formula' | 'button' | 'attachment' | string
  width?:         string | number;    // es. 150 oppure '150px'
  editable?:      boolean;            // sovrascrive options.editable per questa colonna
  hidden?:        boolean;            // nasconde la colonna dal render
  cssClass?:      string;             // classe CSS sulla <td>
  headerCssClass?: string;            // classe CSS sulla <th>
  component?:     Type<JxCellComponent<T>>; // cella completamente custom
  formula?:       (row: T, rowIndex: number, meta: JxFormulaMeta<T>) => any;
  decimals?:      number;             // decimali per tipo 'number'
  prefix?:        string;             // es. '€ '
  suffix?:        string;             // es. ' kg'
  config?:        any;                // dati aggiuntivi per celle custom
}
```

---

### Tipi di cella built-in {#tipi-di-cella-built-in-jx-grid}

| `type` | Componente | Descrizione |
|---|---|---|
| `'text'` (default) | `TextCellComponent` | Testo libero, `<input type="text">` in edit. |
| `'number'` | `NumberCellComponent` | Numerico, supporta `decimals`, `prefix`, `suffix`. |
| `'checkbox'` | `CheckboxCellComponent` | Booleano, toggle su click. |
| `'formula'` | `FormulaCellComponent` | Valore calcolato da `column.formula`. |
| `'button'` | `ButtonCellComponent` | Pulsante, emette `cellAction`. |
| `'attachment'` | `AttachmentCellComponent` | Contatore allegati con azione apertura. |

Per usare un tipo custom basta passare `component: MiaCellaComponent` nella colonna.

---

### Output {#output-jx-grid}

| Output | Tipo evento | Descrizione |
|---|---|---|
| `cellChange` | `JxCellChangeEvent<T>` | Emesso dopo ogni commit di modifica. Contiene `{ row, rowIndex, column, columnIndex, oldValue, newValue }`. |
| `cellAction` | `JxCellActionEvent<T>` | Emesso da `button` / `attachment`. Contiene `{ row, rowIndex, column, columnIndex, value, action, payload }`. |
| `rowSelect` | `T` | Emesso al click su riga quando `options.selectable` è `true`. |

---

### Virtual scroll

Il virtual scroll di `jx-grid` è un'implementazione pura Angular **senza CDK**.
Funziona con due righe spacer CSS (`<tr class="jx-grid-spacer">`) che simulano
l'altezza delle righe non renderizzate, mantenendo la scrollbar proporzionata
all'intero dataset.

**Algoritmo:**

1. All'evento `scroll` si calcola `firstVisibleRow = scrollTop / rowHeight`.
2. Si espande di `VIRTUAL_BUFFER = 5` righe in alto e in basso.
3. Si clampano gli indici a `[0, data.length]`.
4. `virtualRows = data.slice(start, end)`.
5. `paddingTop = start * rowH` — spacer sopra.
6. `paddingBottom = (data.length - end) * rowH` — spacer sotto.

**Attivazione:**

```typescript
opzioni: JxGridOptions = {
  virtualScroll: true,
  virtualScrollHeight: '500px',  // altezza fissa obbligatoria
  rowHeight: 40,                 // suggerito per calcoli precisi (default 40)
  trackByKey: 'id',              // fortemente consigliato per performance
};
```

```html
<jx-grid
  [data]="milleRighe"
  [columns]="colonne"
  [options]="opzioni">
</jx-grid>
```

**Considerazioni:**

| Aspetto | Dettaglio |
|---|---|
| Righe DOM renderizzate | `ceil(containerH / rowH) + 10` (buffer 5+5) — costante |
| Altezze miste | Approssimate; per risultati esatti usare `rowHeight` uniforme |
| `autoHeight: true` | Incompatibile — la griglia deve avere altezza fissa |
| `trackByKey` | Consigliato: evita il destroy/recreate dei component delle celle durante lo scroll |
| Editing durante scroll | L'editor viene chiuso automaticamente da Angular quando il DOM node esce dalla finestra |

**Esempio con 1 000 righe:**

```typescript
interface Dipendente {
  id: number;
  nome: string;
  reparto: string;
  stipendio: number;
}

// Genera 1000 righe mock
rows = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  nome: `Dipendente ${i + 1}`,
  reparto: ['Engineering', 'Sales', 'HR'][i % 3],
  stipendio: 30000 + (i % 50) * 500,
}));

columns: JxColumn<Dipendente>[] = [
  { key: 'id',        label: '#',         type: 'number',   width: 60, editable: false },
  { key: 'nome',      label: 'Nome',       type: 'text',     width: 200 },
  { key: 'reparto',   label: 'Reparto',    type: 'text',     width: 140 },
  { key: 'stipendio', label: 'Stipendio',  type: 'number',   width: 120, decimals: 0, prefix: '€ ' },
];

options: JxGridOptions = {
  virtualScroll: true,
  virtualScrollHeight: '480px',
  rowHeight: 40,
  editable: true,
  selectable: true,
  trackByKey: 'id',
};
```

---

### Celle personalizzate in `jx-grid`

Implementa `JxCellComponent<T>` e passalo nella colonna via `component`:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JxCellComponent, JxCellContext } from 'jx-cell';

interface MyRow { id: number; status: 'ok' | 'error' | 'warn'; }

@Component({
  standalone: false,
  selector: 'app-status-cell',
  template: `
    <span [class]="'badge badge--' + context.value">
      {{ context.value }}
    </span>
  `,
})
export class StatusCellComponent implements JxCellComponent<MyRow> {
  @Input() context!: JxCellContext<MyRow>;
  @Output() valueChange = new EventEmitter<any>();
  // action: opzionale — usato da 'button' / 'attachment'
}
```

```typescript
// Colonna
{ key: 'status', label: 'Status', component: StatusCellComponent }
```

> Il componente deve essere **dichiarato** nel modulo Angular (es. `AppModule`).
> Non è necessario registrarlo nel `JxCellRegistryService` quando si usa `component` direttamente.

---

### Personalizzazione SCSS di `jx-grid`

`jx-grid` espone **tutti i valori visivi come CSS custom properties** (`--jx-grid-*`).
Non è necessario modificare il sorgente della libreria: basta sovrascriverli a qualsiasi livello del DOM.

#### 1 — Compile-time: variabili SCSS (massima priorità)

Funziona solo quando la libreria viene compilata insieme all'app (sorgenti SCSS disponibili).
Usare **prima** del `@use` per sovrascrivere i default:

```scss
// styles.scss
@use 'jx-cell/theme' with (
  // ── Grid container ──────────────────────────────────────────
  $jx-grid-bg:                    #ffffff,
  $jx-grid-border-color:          #d1d5db,
  $jx-grid-border-width:          1px,
  $jx-grid-radius:                8px,

  // ── Header ───────────────────────────────────────────────────
  $jx-grid-header-bg:             #f1f5f9,
  $jx-grid-header-color:          #374151,
  $jx-grid-header-font-weight:    600,
  $jx-grid-header-border-color:   #e5e7eb,
  $jx-grid-header-padding-x:      12px,
  $jx-grid-header-padding-y:      10px,

  // ── Celle ─────────────────────────────────────────────────────
  $jx-grid-cell-border-color:     #e5e7eb,
  $jx-grid-cell-padding-x:        12px,
  $jx-grid-cell-min-height:       36px,

  // ── Righe ─────────────────────────────────────────────────────
  $jx-grid-row-hover-bg:          rgba(59,130,246,.05),
  $jx-grid-row-selected-bg:       rgba(59,130,246,.10),

  // ── Stato vuoto ───────────────────────────────────────────────
  $jx-grid-empty-color:           #9ca3af,
  $jx-grid-empty-padding:         24px,

  // ── Celle speciali ────────────────────────────────────────────
  $jx-grid-attachment-color:      #2563eb,
  $jx-grid-formula-font-weight:   600,
  $jx-grid-total-font-weight:     700,
  $jx-grid-number-font-variant:   tabular-nums,
);
```

#### 2 — Runtime globale: tutti i `jx-grid` della pagina

```css
:root {
  --jx-grid-radius:           4px;
  --jx-grid-header-bg:        #f8fafc;
  --jx-grid-header-color:     #1e293b;
  --jx-grid-cell-min-height:  32px;
  --jx-grid-row-hover-bg:     #eff6ff;
  --jx-grid-row-selected-bg:  #dbeafe;
}
```

#### 3 — Runtime per istanza: solo un `jx-grid` specifico

```css
/* via classe CSS sull'elemento padre */
.mia-sezione jx-grid {
  --jx-grid-border-color:    #a0aec0;
  --jx-grid-header-bg:       #1a202c;
  --jx-grid-header-color:    #f7fafc;
  --jx-grid-row-hover-bg:    #ebf8ff;
  --jx-grid-row-selected-bg: #bee3f8;
}
```

#### Esempio: skin scura per `jx-grid`

```css
.dark-grid jx-grid {
  --jx-grid-bg:              #0f172a;
  --jx-grid-border-color:    rgba(255,255,255,.08);
  --jx-grid-header-bg:       #1e293b;
  --jx-grid-header-color:    #94a3b8;
  --jx-grid-header-border-color: rgba(255,255,255,.06);
  --jx-grid-cell-border-color:   rgba(255,255,255,.06);
  --jx-grid-row-hover-bg:    rgba(255,255,255,.04);
  --jx-grid-row-selected-bg: rgba(99,102,241,.15);
  --jx-grid-empty-color:     #475569;
  --jx-grid-attachment-color:#818cf8;
}
```

**Tabella completa dei token `--jx-grid-*`:**

| Token CSS | Variabile SCSS | Default | Descrizione |
|---|---|---|---|
| `--jx-grid-bg` | `$jx-grid-bg` | `#ffffff` | Sfondo contenitore |
| `--jx-grid-border-color` | `$jx-grid-border-color` | `$jx-border` | Bordo esterno |
| `--jx-grid-border-width` | `$jx-grid-border-width` | `1px` | Spessore bordo esterno |
| `--jx-grid-radius` | `$jx-grid-radius` | `$jx-container-radius` | Angoli arrotondati |
| `--jx-grid-header-bg` | `$jx-grid-header-bg` | `$jx-header-bg` | Sfondo header |
| `--jx-grid-header-color` | `$jx-grid-header-color` | `$jx-header-text` | Colore testo header |
| `--jx-grid-header-font-weight` | `$jx-grid-header-font-weight` | `700` | Grassetto header |
| `--jx-grid-header-border-color` | `$jx-grid-header-border-color` | `$jx-border` | Bordo sotto header |
| `--jx-grid-header-padding-x` | `$jx-grid-header-padding-x` | `10px` | Padding orizontale header |
| `--jx-grid-header-padding-y` | `$jx-grid-header-padding-y` | `8px` | Padding verticale header |
| `--jx-grid-cell-border-color` | `$jx-grid-cell-border-color` | `$jx-border` | Bordo sotto celle |
| `--jx-grid-cell-padding-x` | `$jx-grid-cell-padding-x` | `10px` | Padding orizontale celle |
| `--jx-grid-cell-min-height` | `$jx-grid-cell-min-height` | `$jx-row-height` | Altezza minima righe |
| `--jx-grid-row-hover-bg` | `$jx-grid-row-hover-bg` | `$jx-row-hover` | Sfondo riga hover |
| `--jx-grid-row-selected-bg` | `$jx-grid-row-selected-bg` | `$jx-selection` | Sfondo riga selezionata |
| `--jx-grid-empty-color` | `$jx-grid-empty-color` | `$jx-text-muted` | Colore messaggio vuoto |
| `--jx-grid-empty-padding` | `$jx-grid-empty-padding` | `20px` | Padding messaggio vuoto |
| `--jx-grid-attachment-color` | `$jx-grid-attachment-color` | `$jx-primary` | Colore link allegati |
| `--jx-grid-formula-font-weight` | `$jx-grid-formula-font-weight` | `600` | Font-weight celle formula |
| `--jx-grid-total-font-weight` | `$jx-grid-total-font-weight` | `700` | Font-weight celle totale |
| `--jx-grid-number-font-variant` | `$jx-grid-number-font-variant` | `tabular-nums` | Variante font numeri |

