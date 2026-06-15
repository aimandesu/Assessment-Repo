import type { QueryObject } from "@/types/api-request/query-object";
import type { PaginationResponse } from "@/types/api-response/pagination-response";
import type { Employee } from "@/types/schema/employee.schema";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getEmployeeList = async (
  params: QueryObject,
): Promise<PaginationResponse<Employee>> => {
  const res = await fetch(
    `${BASE_URL}/api/employee?` +
      `pageNumber=${params.PageNumber ?? 1}` +
      `&pageSize=${params.PageSize ?? 10}` +
      `&SortBy=${params.SortBy ?? "createdAt"}` +
      `&IsDescending=${params.IsDescending ?? true}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const createEmployee = async (
  data: Omit<Employee, "Id" | "EntryDate" | "UpdateDate">,
): Promise<Employee> => {
  const res = await fetch(`${BASE_URL}/api/employee/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create employee");
  return res.json();
};

export const updateEmployee = async (data: Employee): Promise<Employee> => {
  const res = await fetch(`${BASE_URL}/api/employee/update/${data.Id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return res.json();
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/employee/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete employee");
};
