# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



# 📊 CustomTable Component

`CustomTable` is a reusable and configurable React table component built for dashboards and data-heavy applications.  
It supports sorting, column visibility toggle, custom cell rendering, action columns, and automatically keeps **Total rows always at the bottom**.

---

## ✨ Features

- ✅ Column-based sorting (numbers, strings, JSX safe)
- ✅ **Static sort icon (⇅)** — no 🔼 / 🔽 icons
- ✅ Automatically keeps **“Total” / “total” rows at the bottom**
- ✅ Hide / show columns using Bootstrap offcanvas
- ✅ Custom cell rendering via accessor functions
- ✅ Clickable cells (API calls, navigation, filters, etc.)
- ✅ Optimized using `useMemo` for large datasets
- ✅ Optional Actions column
- ✅ Bootstrap-compatible UI

---

## 📦 Basic Usage

```jsx
- import CustomTable from "./CustomTable";

<CustomTable
  data={tableData}
  columns={columns}
/>

```

# Column Configuration

Each column is defined using an object.

const columns = [
  {
    id: "branch",
    header: "Branch",
    accessor: "branch",
    sortable: true,
    hideable: true
  },
  {
    id: "enrollments",
    header: "Enrollments",
    accessor: "enrollments",
    sortable: true,
    hideable: true
  }
];

Column Properties
Property	Type	Description
id	string	Unique column identifier
header	string / JSX	Column heading
accessor	string / function	Value resolver
sortable	boolean	Enables sorting
hideable	boolean	Allows column toggle
🖱 Clickable Cell Example

To trigger a function from a specific column (for example, clicking on Branch):

```jsx
{
  id: "branch",
  header: "Branch",
  sortable: true,
  hideable: true,
  accessor: (row) => (
    <span
      style={{ cursor: "pointer" }}
      onClick={() =>
        handleBranchSubmit(row.branchId, filterDates)
      }
    >
      {row.branch}
    </span>
  )
}
```

✅ No changes required inside CustomTable
✅ All logic remains in the parent component

Sorting Behavior

Sorting works only when sortable: true

Sort icon is always ⇅

Supports:

Numbers

Strings

Comma-formatted numbers (1,23,000)

JSX values

Clicking a column toggles ASC / DESC internally

🧮 Total Row Handling (Important)

Any row that contains "total" or "Total" in any column value is:

❌ Excluded from sorting

✅ Always pushed to the last position

✅ Preserved even after sorting

Example:
```jsx
{
  branch: "Total",
  enrollments: 320,
  feeReceived: 450000
}
```


No additional configuration is required.

👁 Column Visibility Toggle

Uses Bootstrap Offcanvas

Only columns with hideable: true appear in toggle list

Hidden columns are managed internally in state

⚡ Performance Notes

Sorting is optimized using useMemo

Re-sorting occurs only when:

data changes

columns change

Sort configuration changes

Large Data Sets

1,000+ rows → works smoothly

10,000+ rows → recommended:

Server-side sorting

Pagination

Virtualization (e.g. react-window)

🧩 Actions Column (Optional)

```jsx
<CustomTable
  data={data}
  columns={columns}
  actions={(row) => (
    <button onClick={() => editRow(row)}>Edit</button>
  )}
/>
```


Adds an extra Actions column automatically.