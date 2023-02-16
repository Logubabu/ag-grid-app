import React, { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, ValueSetterParams, ISelectCellEditorParams } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
ModuleRegistry.registerModules([ClientSideRowModelModule, RichSelectModule]);

const Table = (data: any) => {
  const columnsConfig = data.columnData;
  const rowConfig = data.rowData;
  const gridApi = useRef<AgGridReact>(null);

  // value setter function
  function numberValueSetter(params: ValueSetterParams) {
    Object.keys(rowConfig).forEach((k: any) => {
      let selectedRow = params.colDef.field;
      rowConfig[k].forEach((obj: any) => {
        //@ts-ignore
        if (obj[selectedRow] === params.newValue) {
          for (let d in obj) {
            params.data[k][d] = obj[d];
          }
        }
      });
    });
    return true;
  }

  // Row Value mapping
  function getDropdownOptions(params: any, columnName: any, fields: any) {
    let listValues: any = [];
    rowConfig[fields].forEach((data: any) => {
      if (data.mapping !== undefined) {
        Object.keys(data.mapping).forEach((e: any) => {
          if (params.data[e][columnName] === data.mapping[e]) {
            listValues.push(data[columnName]);
          }
        });
      } else {
        listValues.push(data[columnName]);
      }
    });
    return { values: listValues };
  }

  // column field convertions
  let columnDefs: any = [];
  columnsConfig.forEach((data: any) => {
    let sub_fields = { [data["field"]]: data["sub_fields"] };
    let children: any = [];
    sub_fields[data["field"]].forEach((items: any) => {
      children.push({
        field: items,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: (params: any) => getDropdownOptions(params, items, data["field"]),
        valueSetter: numberValueSetter,
        valueGetter: (params: any) => {
          return params.data[data["field"]][items];
        },
      });
    });
    columnDefs.push({
      headerName: data["field"],
      children: children,
    });
  });

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      flex: 1,
      editable: true,
      sortable: true,
      animateRows: true,
      floatingFilter: true,
      filter: true,
    }),
    []
  );

  // add new data

  function addItems(data: any) {
    let addRowData: any = {};
    Object.keys(data).forEach((item) => {
      addRowData[item] = {};
    });

    gridApi.current?.api.applyTransaction({
      add: [addRowData],
    });
  }

  // const onGridReady = (params: any) => {
  //   setApis(params.api);
  //   fetch(rowConfigURL)
  //     .then((resp) => resp.json())
  //     .then((resp) => setrowConfig(resp));
  // };

  return (
    <div className="ag-theme-alpine" style={{ height: 720, width: "100%" }}>
      <button onClick={() => addItems(rowConfig)}>Add Items</button>
      <AgGridReact
        ref={gridApi}
        rowData={[rowConfig]}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        // onGridReady={onGridReady}
      ></AgGridReact>
    </div>
  );
};

export default Table;
