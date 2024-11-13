window.columnDefs = [];
window.rowData = [];
window.rowImmutableStore;
window.gridOptions;
window._dotNetInstance;
window.gridApi;

function initGridColumns(field, title, width, resizable, editable, columnFilter, sortable) {
    window.columnDefs.push({
        field: field,
        headerName: title,
        width: width,
        resizable: resizable,
        editable: editable,
        filter: columnFilter,
        sortable: sortable,
    });
}

function initAgGridRowData(json, pageable, pageSize, fullRowEdit, dotNetInstance) {
    console.log(json);
    window._dotNetInstance = dotNetInstance;
    rowData = JSON.parse(json);
    setTimeout(() => initAgGrid(pageable, pageSize, fullRowEdit));
}

function initAgGrid(pageable, pageSize, fullRowEdit) {
    // Set grid options
    window.gridOptions = {
        columnDefs: window.columnDefs,
        rowData: window.rowData,
        pagination: pageable,
        paginationPageSize: pageSize,
        rowDragManaged: true,
        animateRows: true,
        editType: fullRowEdit ? 'fullRow' : '',
        onRowValueChanged: fullRowEdit ? onRowEdit : null,
        readOnlyEdit: !fullRowEdit,
        onCellEditRequest: !fullRowEdit ? onCellEdit : null,
    };

    // Add grid to the page
    const gridDiv = document.querySelector('#myGrid');
    window.gridApi = agGrid.createGrid(gridDiv, window.gridOptions);
}

function onRowEdit(event) {
    var newItem = event.data;
    OnEditCallback(newItem);
}

function onCellEdit(event) {
    event.data[event.colDef.field] = event.newValue;
    window.gridApi.setGridOption("rowData", window.rowData);
    OnEditCallback(event.data);
}

function OnEditCallback(newItem) {
    window._dotNetInstance.invokeMethodAsync('Edited', JSON.stringify(newItem));
}

// Dispose all variables when page is changed to avoid duplicated incorrect values
function dispose() {
    window.columnDefs = [];
    window.rowData = [];
    window.rowImmutableStore = null;
    window.gridOptions = null;
    window._dotNetInstance = null;
    window.gridApi = null;
}