// features/employee/EmployeeFormDialog.tsx
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSchema, type Employee } from "@/types/schema/employee.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Employee;
  onSubmit: (data: Employee) => void;
  isPending?: boolean;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
}: EmployeeFormDialogProps) {
  const isEdit = !!defaultValues;

  const form = useForm<Employee>({
    resolver: zodResolver(EmployeeSchema) as Resolver<Employee>,
    mode: "onTouched",
    defaultValues: defaultValues ?? {
      Id: "",
      Name: "",
      BirthDate: new Date(),
      Sex: true,
      Address: "",
      Salary: 0,
      NIK: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
        BirthDate: new Date(defaultValues.BirthDate),
        EntryDate: defaultValues.EntryDate
          ? new Date(defaultValues.EntryDate)
          : undefined,
        UpdateDate: defaultValues.UpdateDate
          ? new Date(defaultValues.UpdateDate)
          : undefined,
      });
    } else {
      form.reset({
        Id: "",
        Name: "",
        BirthDate: new Date(),
        Sex: true,
        Address: "",
        Salary: 0,
        NIK: "",
      });
    }
  }, [defaultValues]);

  const handleSubmit = (data: Employee) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white bg-blue-500 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            Employee Data
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="pt-2">
            {/* ID — readonly, edit only */}
            {isEdit && (
              <Controller
                name="Id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="grid grid-cols-3 items-center gap-4"
                  >
                    <FieldLabel htmlFor="emp-id" className="text-right">
                      ID
                    </FieldLabel>
                    <Input
                      {...field}
                      id="emp-id"
                      disabled
                      className="col-span-2 bg-muted"
                    />
                  </Field>
                )}
              />
            )}

            {/* Name */}
            <Controller
              name="Name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-3 items-center gap-4"
                >
                  <FieldLabel htmlFor="emp-name" className="text-right">
                    Nama
                  </FieldLabel>
                  <div className="col-span-2">
                    <Input
                      {...field}
                      id="emp-name"
                      aria-invalid={fieldState.invalid}
                      maxLength={30}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />

            {/* Sex */}
            <Controller
              name="Sex"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-3 items-center gap-4"
                >
                  <FieldLabel className="text-right">Sex</FieldLabel>
                  <RadioGroup
                    value={field.value ? "male" : "female"}
                    onValueChange={(v) => field.onChange(v === "male")}
                    className="flex gap-4 col-span-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="male" id="sex-male" />
                      <Label htmlFor="sex-male">Male</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="female" id="sex-female" />
                      <Label htmlFor="sex-female">Female</Label>
                    </div>
                  </RadioGroup>
                </Field>
              )}
            />

            {/* NIK — readonly on edit */}
            <Controller
              name="NIK"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-3 items-center gap-4"
                >
                  <FieldLabel htmlFor="emp-nik" className="text-right">
                    NIK
                  </FieldLabel>
                  <Input
                    {...field}
                    id="emp-nik"
                    disabled={isEdit}
                    aria-invalid={fieldState.invalid}
                    className={`col-span-2 ${isEdit ? "bg-muted" : ""}`}
                    maxLength={10}
                  />
                </Field>
              )}
            />

            {/* BirthDate */}
            <Controller
              name="BirthDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-3 items-center gap-4"
                >
                  <FieldLabel htmlFor="emp-birthdate" className="text-right">
                    Tanggal Lahir
                  </FieldLabel>
                  <div className="col-span-2">
                    <Input
                      id="emp-birthdate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />

            {/* Salary */}
            <Controller
              name="Salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-3 items-center gap-4"
                >
                  <FieldLabel htmlFor="emp-salary" className="text-right">
                    Gaji
                  </FieldLabel>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">RM</span>
                    <div className="flex-1">
                      <Input
                        {...field}
                        id="emp-salary"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="text-right"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </div>
                </Field>
              )}
            />

            {/* Address */}
            <Controller
              name="Address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-3 items-start gap-4"
                >
                  <FieldLabel htmlFor="emp-address" className="text-right pt-2">
                    Alamat
                  </FieldLabel>
                  <div className="col-span-2">
                    <Textarea
                      {...field}
                      id="emp-address"
                      rows={3}
                      aria-invalid={fieldState.invalid}
                      maxLength={200}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-start gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
