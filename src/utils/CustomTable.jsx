// CustomTable.jsx
import { Offcanvas } from "bootstrap";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import PaginationInfo from "./PaginationInfo";

/* =========================
   GET CELL VALUE
========================= */
const getValue = (row, accessor, index) => {
  if (!accessor) return "N/A";

  if (typeof accessor === "function") return accessor(row, index);

  const keys = accessor.split(".");
  let value = row;

  for (let key of keys) {
    value = value?.[key];
    if (value === undefined || value === null) return "N/A";
  }

  return value;
};

const CustomTable = ({
  data = [],
  columns = [],
  actions,
  enableColumnToggle = false,
  initialHiddenColumns = [],
  pagination,
  onRowClick,
  totalRow = null,
  onPageChange,
  onPageSizeChange,
}) => {
  /* =========================
      STATE
  ========================= */
  const [sortConfig, setSortConfig] = useState(null);

  // applied state
  const [hiddenColumns, setHiddenColumns] = useState(initialHiddenColumns);

  // draft state (for Apply)
  const [tempHiddenColumns, setTempHiddenColumns] = useState(initialHiddenColumns);

  /* =========================
      COLUMN WIDTH STATE
  ========================= */
  const [columnWidths, setColumnWidths] = useState(() => {
    const widths = {};
    columns.forEach((col, index) => {
      if (index === 0) {
        widths[col.id] = col.width || 100;
      } else {
        widths[col.id] = col.width || 180;
      }
    });
    return widths;
  });

  useEffect(() => {
    setColumnWidths((prev) => {
      const updated = { ...prev };
      columns.forEach((col) => {
        if (!updated[col.id]) {
          updated[col.id] = col.width || 180;
        }
      });
      return updated;
    });
  }, [columns]);

  const resizingRef = useRef(null);

  /* =========================
      SORT HANDLER
  ========================= */
  const handleSort = (col) => {
    if (!col.sortable) return;

    setSortConfig((prev) => {
      if (!prev || prev.key !== col.id) {
        return { key: col.id, direction: "asc" };
      }
      return {
        key: col.id,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  const renderSortIcon = (col) => (col.sortable ? " ⇅" : null);

  /* =========================
      SORTED DATA
  ========================= */
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const column = columns.find((c) => c.id === sortConfig.key);
    if (!column) return data;

    const normalRows = [];
    const totalRows = [];

    data.forEach((row) => {
      const isTotalRow = Object.values(row).some(
        (val) => typeof val === "string" && val.toLowerCase().includes("total"),
      );

      if (isTotalRow) totalRows.push(row);
      else normalRows.push(row);
    });

    const extractValue = (val) => {
      if (React.isValidElement(val)) {
        const children = val.props?.children;
        if (Array.isArray(children)) {
          return children
            .map((child) =>
              typeof child === "string" ? child : extractValue(child),
            )
            .join("");
        }
        return typeof children === "string" ? children : extractValue(children);
      }
      return val ?? "";
    };

    const isDateLike = (v) =>
      typeof v === "string" && /\d{4}-\d{2}-\d{2}/.test(v);

    const sortedNormal = [...normalRows].sort((a, b) => {
      let aVal = extractValue(getValue(a, column.accessor));
      let bVal = extractValue(getValue(b, column.accessor));

      if (isDateLike(aVal) && isDateLike(bVal)) {
        return sortConfig.direction === "asc"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      // handle numbers with commas, ₹, %
      const aNum =
        typeof aVal === "string"
          ? Number(aVal.replace(/[₹,%]/g, "").replace(/,/g, ""))
          : Number(aVal);
      const bNum =
        typeof bVal === "string"
          ? Number(bVal.replace(/[₹,%]/g, "").replace(/,/g, ""))
          : Number(bVal);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        : String(bVal).localeCompare(String(aVal), undefined, {
            numeric: true,
          });
    });

    return [...sortedNormal, ...totalRows];
  }, [data, sortConfig, columns]);

  /* =========================
      COLUMN RESIZE
  ========================= */
  const startResize = (e, colId) => {
    e.preventDefault();
    e.stopPropagation();

    resizingRef.current = {
      colId,
      startX: e.clientX,
      startWidth: columnWidths[colId],
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const onMouseMove = (e) => {
    if (!resizingRef.current) return;

    const { colId, startX, startWidth } = resizingRef.current;
    const diff = e.clientX - startX;

    setColumnWidths((prev) => ({
      ...prev,
      [colId]: Math.max(startWidth + diff, 80),
    }));
  };

  const stopResize = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  /* =========================
      RENDER
  ========================= */
  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.id),
  );

  const toggleTempColumn = (id) => {
    setTempHiddenColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const isEmpty = sortedData.length === 0;

  return (
    <>
      {/* Column toggle offcanvas (commented out but preserved) */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="columnOffcanvas"
        style={{ width: "300px" }}
      >
        <div className="offcanvas-header border-bottom">
          <h6 className="mb-0">Table Columns</h6>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          />
        </div>

        <div className="offcanvas-body p-0 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto p-3">
            {columns
              .filter((col) => col.hideable)
              .map((col) => (
                <div className="form-check mb-2" key={col.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`toggle-${col.id}`}
                    checked={!tempHiddenColumns.includes(col.id)}
                    onChange={() => toggleTempColumn(col.id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`toggle-${col.id}`}
                  >
                    {col.header}
                  </label>
                </div>
              ))}
          </div>

          <div className="border-top p-2 d-flex justify-content-between bg-white">
            <button
              className="btn btn-sm btn-outline-secondary"
              data-bs-dismiss="offcanvas"
              onClick={() => setTempHiddenColumns(hiddenColumns)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-sm btn_primary"
              onClick={() => {
                const visibleTempColumns = columns.filter(
                  (col) => col.hideable && !tempHiddenColumns.includes(col.id),
                );
                if (visibleTempColumns.length === 0) {
                  toast.error("Please select at least 1 column");
                  return;
                }
                setHiddenColumns(tempHiddenColumns);
                const offcanvasElement =
                  document.getElementById("columnOffcanvas");
                const offcanvasInstance =
                  Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) {
                  offcanvasInstance.hide();
                }
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="table-responsive"
        style={{
          maxHeight: "430px",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <table
          className="table table-hover table-borderless table-nowrap mb-0"
          style={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <thead>
            <tr className="w-100 py-2">
              {visibleColumns.map((col, colIndex) => (
                <th
                  key={col.id}
                  onClick={() => handleSort(col)}
                  className="text-nowrap t"
                  style={{
                    cursor: col.sortable ? "pointer" : "default",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "#e1e1e4",
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: colIndex === 0 ? "10px 6px" : "8px 10px",
                    lineHeight: "1.2",
                    verticalAlign: "middle",
                    width: columnWidths[col.id],
                    minWidth: 60,
                    textAlign: "left",
                    borderBottom: "1px solid #adb5bd",
                  }}
                >
                  <div>
                    <span>{col.header}</span>
                    <span style={{ fontSize: "12px", opacity: 0.7 }}>
                      {renderSortIcon(col)}
                    </span>
                  </div>

                  {/* RESIZER */}
                  <div
                    onMouseDown={(e) => startResize(e, col.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 6,
                      height: "15px",
                      width: "5px",
                      backgroundColor: "#555151",
                      borderRadius: "10px",
                      cursor: "col-resize",
                      zIndex: 11,
                    }}
                  >
                    <div
                      style={{
                        width: "1px",
                        height: "100%",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </th>
              ))}
              {actions && (
                <th
                  style={{
                    top: 0,
                    zIndex: 10,
                    background: "#e1e1e4",
                    padding: "0 10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    borderBottom: "1px solid #adb5bd",
                    height: "34px",
                    width: "300px",
                    verticalAlign: "middle",
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {visibleColumns.map((col, colIndex) => {
                    const value = getValue(row, col.accessor, index);
                    return (
                      <td
                        key={col.id}
                        title={value}
                        className="text-nowrap"
                        style={{
                          fontSize: "13px",
                          padding: "6px 10px",
                          width: columnWidths[col.id],
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        {value}
                      </td>
                    );
                  })}
                  {actions && (
                    <td
                      style={{
                        borderBottom: "1px solid #dee2e6",
                        padding: "6px 10px",
                        width: "100",
                      }}
                    >
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + (actions ? 1 : 0)}
                  className="text-center"
                  style={{ fontSize: "13px", padding: "20px" }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start mx-3">
          <div className="col-sm">
            <PaginationInfo
              data={{
                length: pagination?.length,
                start: pagination?.start,
                end: pagination?.end,
                total: pagination?.searchResult,
              }}
              loading={pagination?.loading}
            />
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
            <div className="mt-2">
              <select
                className="form-select form-control me-3 input_bg_color pagination-select"
                aria-label="Default select example"
                required
                onChange={(e) => onPageSizeChange?.(e)}
                value={pagination?.pageSize}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="">
              <Pagination
                currentPage={pagination?.page}
                totalPages={pagination?.totalPages}
                loading={false}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomTable;