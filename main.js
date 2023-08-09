const cellStyle = {
  'white-space': 'normal',
  'font-size': '11px',
  'line-height': 'normal',
  display: 'flex',
  'align-items': 'center',
};

var columnDef = [
  { headerName: 'ID', field: 'id', cellStyle: cellStyle },
  { headerName: 'Nombre', field: 'name', cellStyle: cellStyle },
  { headerName: 'Apellido', field: 'lastname', cellStyle: cellStyle },
  { headerName: 'Edad', field: 'age', cellStyle: cellStyle },
  {
    headerName: 'Estado',
    field: 'status',
    cellStyle: { ...cellStyle, 'justify-content': 'center' },
    cellRenderer: function ({ value }) {
      switch (value) {
        case 'pendiente':
          return `<span> ${value.toUpperCase()} </span>`;

        case 'cargando':
          return `<span> <i class="fa-solid fa-sync fa-spin badge"></i> </span>`;

        case 'autorizado':
          return `<span> <i class="fas fa-check-circle badge success"></i> </span>`;

        case 'rechazado':
          return `<span> <i class="fas fa-times-circle badge error"></i> </span>`;
      }
    },
  },
];

var gridOptions = {
  defaultColDef: {
    editable: false,
    sortable: true,
    filter: false,
    flex: 1,
    resizable: false,
    lockPosition: true,
    cellClass: 'cell-wrap-text',
    singleClickEdit: false,
  },
  rowData: [],
  columnDefs: columnDef,
  animateRows: true,
  pagination: true,
  localeText: {
    loading: 'Cargando...',
  },
  getRowId: function (params) {
    return params.data.id;
  },
};

$(function () {
  const div = document.querySelector('#myGrid');
  new agGrid.Grid(div, gridOptions);

  loadInitialData();
});

const loadInitialData = () => {
  const fakeData = {
    firstName: ['Juan', 'Pedro', 'Maria', 'Jose', 'Luis', 'Ana', 'Carlos', 'Jorge', 'Miguel', 'Raul'],
    lastName: [
      'Perez',
      'Gomez',
      'Gonzales',
      'Rodriguez',
      'Lopez',
      'Garcia',
      'Martinez',
      'Sanchez',
      'Fernandez',
      'Diaz',
    ],
    age: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    status: ['pendiente'],
  };

  const rowData = [];

  for (let i = 0; i < 100; i++) {
    const randomFirstName = fakeData.firstName[Math.floor(Math.random() * fakeData.firstName.length)];
    const randomLastName = fakeData.lastName[Math.floor(Math.random() * fakeData.lastName.length)];
    const randomAge = fakeData.age[Math.floor(Math.random() * fakeData.age.length)];
    const randomStatus = fakeData.status[Math.floor(Math.random() * fakeData.status.length)];
    rowData.push({
      id: i + 1,
      name: randomFirstName.toUpperCase(),
      lastname: randomLastName.toUpperCase(),
      age: randomAge,
      status: randomStatus,
    });
  }

  gridOptions.api.setRowData(rowData);
};

const fakePost = async () => {
  const statusList = ['autorizado', 'rechazado'];

  const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];
  const randomTimeout = Math.floor(Math.random() * 5 + 1) * 1000;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(randomStatus);
    }, randomTimeout);
  });
};

// simulate a post request
const sendData = async () => {
  gridOptions.api.forEachNode((node) => {
    node.setDataValue('status', 'cargando');
    gridOptions.api.refreshCells({ rowNodes: [node] });
  });

  gridOptions.api.forEachNode(async (node) => {
    const status = await fakePost();
    node.setDataValue('status', status);
    gridOptions.api.applyTransaction({ update: [node.data] });
  });
};
