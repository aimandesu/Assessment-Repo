import PaginationControls from "@/components/PaginationControl";
import { ReusableTable } from "@/components/ui-custom/ReusableTable";
import { SimpleSelect } from "@/components/ui-custom/SimpleSelect";
import SkeletonRow from "@/components/ui-custom/SkeletonRow";
import { getEmployeeColumns } from "@/features/employee/EmployeeColumns";
import { useApiQuery } from "@/hooks/useApiQuery";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeList,
  updateEmployee,
} from "@/services/employee-service";
import type { PaginationResponse } from "@/types/api-response/pagination-response";
import { EmployeeSchema, type Employee } from "@/types/schema/employee.schema";
import { keepPreviousData } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { EmployeeFormDialog } from "./HomeComponents/EmployeeFormDialogProps";
import { EmployeeDeleteDialog } from "./HomeComponents/EmployeeDeleteDIalog";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Button } from "@/components/ui/button";

const EmployeePage = () => {
  const sortSelection = ["Name", "BirthDate", "Sex", "Salary"];
  const rankSelection = ["Descending", "Ascending"];

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [sort, setSortBy] = useState<string>(sortSelection[0]);
  const [descend, setDescent] = useState(rankSelection[0]);

  //functionality
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const listKey = ["employee-list"];

  const { mutate: create, isPending: isCreating } = useApiMutation(
    createEmployee,
    listKey,
    {
      onSuccess: (newEmployee) => {
        setCreateOpen(false);
        console.log("Created:", newEmployee); // newEmployee is the Employee returned from API
      },
      onError: (err) => {
        console.error("Create failed:", err.message);
      },
    },
  );

  const { mutate: update, isPending: isUpdating } = useApiMutation(
    updateEmployee,
    listKey,
    {
      onSuccess: (updatedEmployee) => {
        setEditTarget(null);
        console.log("Updated:", updatedEmployee);
      },
      onError: (err) => {
        console.error("Update failed:", err.message);
      },
    },
  );

  const { mutate: remove, isPending: isDeleting } = useApiMutation(
    (id: string) => deleteEmployee(id),
    listKey,
    {
      onSuccess: () => {
        console.log("Success");
        setDeleteTarget(null);
      },
      onError: (err) => {
        console.error("Delete failed:", err.message);
      },
    },
  );

  const columns = useMemo(
    () =>
      getEmployeeColumns({
        onEdit: (employee) => setEditTarget(employee),
        onDelete: (employee) => setDeleteTarget(employee),
      }),
    [],
  );

  const { data, isFetching } = useApiQuery<PaginationResponse<Employee>>(
    [
      "employee-list",
      pageNumber.toString(),
      pageSize.toString(),
      sort,
      descend,
    ],
    () =>
      getEmployeeList({
        PageNumber: pageNumber,
        PageSize: pageSize,
        IsDescending: descend === "Descending",
        SortBy: sort,
      }),
    undefined,
    {
      placeholderData: keepPreviousData,
    },
  );

  const employees: Employee[] = data?.data ?? [];
  const totalCount: number = data?.totalCount ?? 0;
  const totalPages: number = data?.totalPages ?? 0;

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPageNumber(p);
  };

  return (
    <div className="flex flex-col gap-y-5 m-3">
      <div className="flex flex-row w-full justify-between ">
        <SimpleSelect
          value={pageSize.toString()}
          options={["15", "30", "45"]}
          onValueChange={(v) => {
            setPageSize(Number(v));
            setPageNumber(1);
          }}
        />
        <div className="flex flex-row gap-3">
          <SimpleSelect
            value={descend}
            options={rankSelection}
            onValueChange={(v) => {
              setDescent(v);
              setPageNumber(1);
            }}
          />
          <SimpleSelect
            value={sort}
            options={sortSelection}
            onValueChange={(v) => {
              setSortBy(v);
              setPageNumber(1);
            }}
          />
        </div>
      </div>
      <ReusableTable
        columns={columns}
        data={employees}
        keyExtractor={(tx) => tx.Id}
        emptyState={
          isFetching ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <SkeletonRow key={i} rowsCount={pageSize} />
            ))
          ) : (
            <div className="py-18 text-center text-muted-foreground text-sm">
              No Employees found
            </div>
          )
        }
      />
      <PaginationControls
        currentPage={Number(pageNumber)}
        lastPage={totalPages}
        onGoTo={goTo}
      />
      <div className="flex flex-row w-full justify-end">
        <Button onClick={() => setCreateOpen(true)} variant="outline">
          Create Employee
        </Button>
      </div>
      {/* forms */}
      <EmployeeFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        isPending={isCreating}
        onSubmit={(data) => create(data)}
      />

      <EmployeeFormDialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        defaultValues={editTarget ?? undefined}
        isPending={isUpdating}
        onSubmit={(data) => update(data)}
      />

      <EmployeeDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        employeeName={deleteTarget?.Name}
        isPending={isDeleting}
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget.Id);
        }}
      />
    </div>
  );
};

export default EmployeePage;
