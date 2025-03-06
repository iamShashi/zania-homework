"use client";

// contants
import { ProgramRecords } from "@/app/constants";
import { TEXT, TABLE_HEADERS, CHECKBOX_STATES } from "./constants";
import React, { useMemo, useState } from "react";

// interface ProgramRecord to Type check data
interface ProgramRecord {
  name: string;
  device: string;
  path: string;
  status: string;
}

// dataTable component
const DataTable = ({}) => {
  const { NONE_SELECTED, DONWLOAD_SELCTED, SELECTED } = TEXT;
  const [allCheckboxSelected, setAllChecboxSelected] = useState<boolean>(false);

  // initialising with all the checkboxes selected
  const [selectedCheckBox, setSelectedChekBox] = useState<boolean[]>(
    Array(ProgramRecords.length).fill(false)
  );

  // when all checkbox select checkbox is toggled
  const onToggleSelectCheckBox = () => {
    // we simply toggle all the individual check boxes
    // as well as out main select all checkbox
    if (!allCheckboxSelected)
      setSelectedChekBox(selectedCheckBox.map(() => true));
    else setSelectedChekBox(selectedCheckBox.map(() => false));
    setAllChecboxSelected(!allCheckboxSelected);
  };

  const onDownloadClick = () => {
    // onDownloadButtonclick we simply
    // iterate through all the available checkboxes and download them
    let alertDownloadMessage = "";
    ProgramRecords.map((record: ProgramRecord) => {
      if (record.status === CHECKBOX_STATES.AVAILABLE) {
        alertDownloadMessage = alertDownloadMessage + record.path + "\n";
      }
    });

    // alert to fire alert
    alert(`${TEXT.DOWNLOADED_ITEMS}\n${alertDownloadMessage}`);
  };

  // to keep the countupdated when
  // new check box is toggleds
  const countSelected = useMemo(() => {
    return selectedCheckBox.filter((checkbox) => checkbox).length;
  }, selectedCheckBox);

  // to check should we enable download button
  const shouldEnableDownload = useMemo(() => {
    // we simply check if wrong boxes are not checked and its length should be 0
    // so we put in the conditions for wrong selections in or state
    const filterdata = ProgramRecords.filter(
      (record, index) =>
        (record.status === CHECKBOX_STATES.AVAILABLE &&
          selectedCheckBox[index] == false) ||
        (record.status === CHECKBOX_STATES.SCHEDULED &&
          selectedCheckBox[index] == true)
    );
    return filterdata.length === 0;
  }, selectedCheckBox);

  // on each individual checkbox if selected we simply show and update
  // our all checkbox selected state data
  const onIndividualCheckBoxClick = (index: number) => {
    setSelectedChekBox((prevState) => {
      const newSelectedCheckBoxes = [...prevState];
      newSelectedCheckBoxes[index] = !newSelectedCheckBoxes[index];
      return newSelectedCheckBoxes;
    });
  };

  return (
    <>
      <h1>{TEXT.HEADER}</h1>
      <div className="w-100">
        <div className="flex-row">
          <div>
            <input
              type="checkbox"
              checked={allCheckboxSelected}
              onChange={onToggleSelectCheckBox}
            />
          </div>
          <div>
            {countSelected < 1 ? NONE_SELECTED : `${countSelected} ${SELECTED}`}
          </div>
          <div>
            <button disabled={!shouldEnableDownload} onClick={onDownloadClick}>
              &#8681;{DONWLOAD_SELCTED}
            </button>
          </div>
        </div>
      </div>
      <table className="program-table">
        <thead>
          <tr>
            <th></th>
            {TABLE_HEADERS.map((header: string, index: number) => (
              <th key={index} className="table-cell-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ProgramRecords.map((item: ProgramRecord, index: number) => {
            const { name = "", device = "", path = "", status = "" } = item;
            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCheckBox[index]}
                    onChange={() => onIndividualCheckBoxClick(index)}
                  />
                </td>
                <td>{name}</td>
                <td>{device}</td>
                <td>{path}</td>
                <td>
                  <div className="table-status-cell">
                    {status === CHECKBOX_STATES.AVAILABLE && (
                      <span className="available-circle">&nbsp;</span>
                    )}
                    {status}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;
