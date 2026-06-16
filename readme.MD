# Assessment-Repo

A full-stack employee management web application built with **ASP.NET Core Minimal API** (.NET backend) and **React + TypeScript** (frontend), deployed on a shared IIS host under a single domain.

Live demo: [https://wilmar-assessment.premiumasp.net/wilmar-assessment/](https://wilmar-assessment.premiumasp.net/wilmar-assessment/)

---

## Tech Stack

### Backend — `BE-.NET`
- **ASP.NET Core** — Minimal API
- **Entity Framework Core** — ORM with SQL Server
- **Dapper** — for raw/stored procedure queries
- **Rate Limiting** — built-in ASP.NET Core rate limiter
- **CORS** — configured for cross-origin frontend requests

### Frontend — `FE-React`
- **React 18 + TypeScript**
- **Vite** — build tool
- **TanStack Query v5** — server state, caching, and mutations
- **React Hook Form + Zod** — form handling and schema validation
- **shadcn/ui + Tailwind CSS** — UI components and styling
- **Sonner** — toast notifications

---

## Features

- **Employee List** — paginated table with sort (Name, BirthDate, Sex, Salary) and order (Ascending/Descending) controls
- **Create Employee** — form dialog with validation (name, NIK, birth date, salary, address, sex)
- **Edit Employee** — pre-filled form dialog; NIK is read-only on edit
- **Delete Employee** — confirmation dialog before deletion
- **OCR endpoint** — additional API route for OCR processing -> only in POSTMAN
- **Global error handling** — API errors surface as toast notifications via Sonner

---

## Project Structure

```
Assessment-Repo/
├── BE-.NET/                  # ASP.NET Core backend
│   ├── Api/
│   │   └── Endpoints/        # Minimal API endpoint definitions
│   ├── Services/             # DI service registrations
│   ├── wwwroot/
│   │   └── wilmar-assessment/ # Built React frontend served as static files
│   │       ├── index.html
│   │       ├── assets/
│   │       └── web.config    # IIS SPA fallback rewrite rule
│   ├── ApplicationDbContext.cs
│   ├── Program.cs
│   └── web.config            # ASP.NET Core IIS hosting config
│
└── FE-React/                 # React + TypeScript frontend
    ├── src/
    │   ├── components/       # Reusable UI components (ReusableTable, SimpleSelect, etc.)
    │   ├── features/
    │   │   └── employee/     # Employee columns, form dialog, delete dialog
    │   ├── hooks/            # useApiQuery, useApiMutation
    │   ├── pages/
    │   │   └── Home/         # EmployeePage
    │   ├── services/         # API service functions
    │   └── types/            # Zod schemas and response types
    ├── vite.config.ts
    └── .env
```

---

## API Endpoints

| Method | Route                       | Description |
|---|-----------------------------|---|
| GET | `/api/employee`             | Get paginated employee list |
| POST | `/api/create/employee`      | Create a new employee |
| PUT | `/api/employee/update/{id}` | Update an employee |
| DELETE | `/api/employee/delete/{id}` | Delete an employee |
| POST | `/api/ocr/plate`            | OCR processing endpoint |

## API URL
https://job222-8988.postman.co/workspace/AimanAfiq_Work's~a34e9583-0a87-4583-a919-47f032a82b6a/collection/33511040-861aeb4f-21d2-44af-8dac-2de5c13d82c5?action=share&source=copy-link&creator=33511040

## API Collection
In Root: Wilmar.postman_collection.json

## Programmability - Stored Procedure

For pagination Employee
```
CREATE PROCEDURE [dbo].[GetEmployees]

    @PageNumber INT = 1,
    @PageSize INT = 30,
    @SortBy NVARCHAR(50) = 'Id',
    @IsDesc BIT = 0

AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    DECLARE @SQL NVARCHAR(MAX);

    SET @SQL = N'
        SELECT
            *,
        COUNT(*) OVER() AS TotalCount
        FROM dbo.Employee
        ORDER BY ' + @SortBy + 
            CASE 
                WHEN @IsDesc = 1 THEN ' DESC' ELSE ' ASC' 
                END + N'
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
    ';

    EXEC sp_executesql @SQL,
        N'@Offset INT, @PageSize INT',
        @Offset, @PageSize;
END
```

## Level 2 - Description

1. The key api is hardcoded into my hosting provider and supplied through .NET environment variables lookup
2. Provider chosen + why
```
I Choose Google Cloud Vision because it 
has free tier and the most I am comfortable 
with because I used many Google APIs before
```
3. How to run OCR gateway
```
Just use the API provided in the API URL and API Collection section.
Use my hosting backend endpoint to run: https://wilmar-assessment.premiumasp.net/api/ocr/plate
```