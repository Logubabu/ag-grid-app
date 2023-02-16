import React, { useEffect, useState } from "react";
import Table from "../table/table";

const HomePage = () => {
  const rowConfigURL = "http://localhost:4000/rowConfig";
  const columnsConfigURL = "http://localhost:4000/columnsConfig";

  const [columnsConfig, setcolumnsConfig] = useState<any>([]);
  const [rowConfig, setrowConfig] = useState<any>({});
  let [table, setTable] = useState(<></>);
  let [checkboxData, setCheckBox] = useState([]);

  // column data
  useEffect(() => {
    async function fetchcolumnData() {
      const res = await fetch(columnsConfigURL);
      const resp = await res.json();
      setcolumnsConfig(resp);
    }
    fetchcolumnData();
  }, []);

  //Row data
  useEffect(() => {
    async function fetchRowData() {
      const res = await fetch(rowConfigURL);
      const resp = await res.json();
      setrowConfig(resp);
    }
    fetchRowData();
  }, []);

  const HandleSubmitButton = () => {
    // let rowFields: any = [];
    // checkboxData.forEach((k: any) => {
    //   Object.keys(rowConfig).forEach((key: any) => {
    //     if (key === k["field"]) {
    //       rowFields.push({ [key]: rowConfig[key] });
    //     }
    //   });
    // });
    setTable(<Table columnData={checkboxData} rowData={rowConfig} />);
  };

  return (
    <>
      <div>
        <h2>Please select... </h2>
        <ul>
          {columnsConfig.map((item: any, index: number) => (
            <li key={item.field}>
              <input
                type="checkbox"
                name={item.field}
                value={index}
                onChange={(e: any) => {
                  let checked = e.target.checked;
                  if (checked) {
                    // @ts-ignore
                    setCheckBox([...checkboxData, item]);
                  }
                }}
              />
              <label>{item.field}</label>
            </li>
          ))}
        </ul>
        <button
          className="bg-sky-500 hover:bg-cyan-600 bg-origin-border text-black"
          onClick={() => HandleSubmitButton()}
        >
          Submit
        </button>
        {table}
      </div>
    </>
  );
};

export default HomePage;
