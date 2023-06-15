export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

export const muiTableTextLabels = {
  body: {
    noMatch: 'Niente da mostrare',
    toolTip: 'Ordina',
    columnHeaderTooltip: column => `Ordina per ${column.label}`
  },
  pagination: {
    next: 'Prossima pagina',
    previous: 'Pagina precedente',
    rowsPerPage: 'Righe per pagina',
    displayRows: 'di'
  },
  toolbar: {
    search: 'Cerca',
    downloadCsv: 'Scarica CSV',
    print: 'Stampa',
    viewColumns: 'Vedi colonne',
    filterTable: 'Filtra la tabella'
  },
  filter: {
    all: 'Tutto',
    title: 'Filtri',
    reset: 'Reset'
  },
  viewColumns: {
    title: 'Mostra colonne',
    titleAria: 'Mostra/Nascondi colonne'
  },
  selectedRows: {
    text: 'Riga(e) selezionate',
    delete: 'Cancella',
    deleteAria: 'Cancella righe selezionate'
  }
};
