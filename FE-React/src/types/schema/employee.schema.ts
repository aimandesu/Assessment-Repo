import * as z from "zod";

const fifteenYearsAgo = new Date();
fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);

export const EmployeeSchema = z.object({
  Id: z.string(),
  Name: z
    .string()
    .min(1, "Name is Required")
    .max(30, "Name can't exceed 30 characters"),
  BirthDate: z.coerce
    .date()
    .min(1, "Birth Date is Required")
    .max(fifteenYearsAgo, {
      message: "Employee must be at least 15 years old",
    }),
  Sex: z.boolean("Sex is required"),
  Address: z
    .string()
    .max(200, "Address can't exceed 200 characters")
    .optional(),
  Salary: z.number().min(1, "Salary is Required"),
  NIK: z.string().max(10, "NIK can't exceed 10 characters").optional(),
  EntryDate: z.coerce.date().optional(),
  UpdateDate: z.coerce.date().optional(),
  //   TotalCount: z.number().optional(),
});
export type Employee = z.infer<typeof EmployeeSchema>;
