"use client";

// contants
import { ProgramRecords } from "@/app/constants";
import { TEXT, TABLE_HEADERS, CHECKBOX_STATES } from "./constants";
import { useMemo, useState } from "react";

interface ProgramRecord {
  name: string;
  device: string;
  path: string;
  status: string;
}

const DataTable = ({}) => {
  const { NONE_SELECTED, DONWLOAD_SELCTED, SELECTED } = TEXT;
  const [allCheckboxSelected, setAllChecboxSelected] = useState(false);
  const [selectedCheckBox, setSelectedChekBox] = useState<boolean[]>(
    Array(ProgramRecords.length).fill(false)
  );

  const onToggleSelectCheckBox = () => {
    if (!allCheckboxSelected)
      setSelectedChekBox(selectedCheckBox.map(() => true));
    else setSelectedChekBox(selectedCheckBox.map(() => false));
    setAllChecboxSelected(!allCheckboxSelected);
  };

  const onDownloadClick = () => {
    let alertDownloadMessage = "";
    ProgramRecords.map((record) => {
      if (record.status === CHECKBOX_STATES.AVAILABLE) {
        alertDownloadMessage = alertDownloadMessage + record.path + "\n";
      }
    });

    alert(`${TEXT.DOWNLOADED_ITEMS}\n${alertDownloadMessage}`);
  };

  const countSelected = useMemo(() => {
    return selectedCheckBox.filter((checkbox) => checkbox).length;
  }, selectedCheckBox);

  const shouldEnableDownload = useMemo(() => {
    const filterdata = ProgramRecords.filter(
      (record, index) =>
        (record.status === CHECKBOX_STATES.AVAILABLE &&
          selectedCheckBox[index] == false) ||
        (record.status === CHECKBOX_STATES.SCHEDULED &&
          selectedCheckBox[index] == true)
    );
    return filterdata.length === 0;
  }, selectedCheckBox);

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
