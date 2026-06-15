import type { Column } from "@/components/ui-custom/ReusableTable";
import type { Employee } from "@/types/schema/employee.schema";

interface EmployeeColumnActions {
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const getEmployeeColumns = ({
  onEdit,
  onDelete,
}: EmployeeColumnActions): Column<Employee>[] => [
  {
    header: "NIK",
    cell: (row) => row.NIK,
  },
  {
    header: "Name",
    cell: (row) => row.Name,
  },
  {
    header: "Birth Date",
    cell: (row) => new Date(row.BirthDate).toLocaleDateString("en-MY"),
  },
  {
    header: "Sex",
    cell: (row) => (row.Sex ? "Male" : "Female"),
  },
  {
    header: "Salary",
    cell: (row) =>
      new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
      }).format(row.Salary),
  },
  {
    header: "Status",
    cell: (row) => {
      const isUpdatedToday = row.UpdateDate
        ? new Date(row.UpdateDate).toDateString() === new Date().toDateString()
        : false;
      return (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isUpdatedToday
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUpdatedToday ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    header: "Action",
    cell: (row) => (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(row)}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(row)}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    ),
  },
];
