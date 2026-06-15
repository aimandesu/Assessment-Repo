using System.Data;
using System.Net;
using BE_.NET.Enums;
using BE_.NET.Helpers;
using BE_.NET.Helpers.Filter;
using BE_.NET.Helpers.Generator;
using BE_.NET.IRepository;
using BE_.NET.Model;
using BE_.NET.Response;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE_.NET.Api.Endpoints;

public static class EmployeeEndpoints
{
    public static void MapEmployeeEndpoints(this IEndpointRouteBuilder app)
    {
        var employeeGroup = app
            .MapGroup("api/employee")
            .WithTags("Employee");

        employeeGroup.MapGet("/", GetEmployees);
        employeeGroup.MapPost("/create", CreateEmployee);
        employeeGroup.MapPut("/update/{id}", UpdateEmployee);
        employeeGroup.MapDelete("/delete/{id}", DeleteEmployee);
    }

    private static async Task<IResult> GetEmployees(
        ApplicationDbContext context,
        [AsParameters] EmployeeQueryObject query) //[AsParameters]
    {
        var parameters = new DynamicParameters();
        parameters.Add("@PageNumber",  query.PageNumber);
        parameters.Add("@PageSize",    query.PageSize);
        parameters.Add("@IsDesc", query.IsDescending);

        if (query.SortBy != null)
        {
            var sortingBy = EnumHelper.ParseEnumOrThrow<SortingType>(
                query.SortBy.ToString() ?? "");
            
            parameters.Add("@SortBy", sortingBy
                .ToString());
        }
        
        await using var conn = context.Database.GetDbConnection();
        
        var result = await conn.QueryAsync(
            "dbo.GetEmployees",
            parameters,
            commandType: CommandType.StoredProcedure
        );
     
        var list      = result.ToList();
        var total     = list.FirstOrDefault()?.TotalCount ?? 0;
        var totalPages = (int)Math.Ceiling(total / (double)query.PageSize);
     
        return ResultResponse<object>.Success(
            new
            {
                Data       = list,
                Page       = query.PageNumber,
                PageSize   = query.PageSize,
                TotalCount = total,
                TotalPages = totalPages
            });
        
    }

    private static async Task<IResult> CreateEmployee(
        IBaseRepository<Employee> repository,
        [FromBody] Employee employee)
    {
        employee.EntryDate ??= DateTime.Now;
        var referenceDate = employee.EntryDate.Value;
        
        employee.Id = await EmployeeIdGenerator.GenerateEmployeeCode(repository, referenceDate);
        var createdEmployee = await repository.Create(employee);

        return ResultResponse<Employee>.Success(createdEmployee);

    }
    
    private static async Task<IResult> UpdateEmployee(
        string id,
        IBaseRepository<Employee> repository,
        [FromBody] Employee employeeUpdatePayload)
    {
        employeeUpdatePayload.Id = id; 
        employeeUpdatePayload.UpdateDate = DateTime.Now;
        
        var updatedEmployee = await repository.Update(employeeUpdatePayload, id);

        
        if (updatedEmployee == null)
        {
            return ResultResponse<object>.Failure(
                new Error(
                    HttpStatusCode.NotFound, 
                    $"Employee with ID {id} was not found.")
            );
        }

        return ResultResponse<Employee>.Success(updatedEmployee);
    }

    private static async Task<IResult> DeleteEmployee(
        string id,
        IBaseRepository<Employee> repository)
    {
        var deletedEmployee = await repository.Delete(id);

        if (deletedEmployee == null)
        {
            return ResultResponse<object>.Failure(
                new Error(
                    HttpStatusCode.NotFound,
                    $"Employee with ID {id} was not found.")
            );
        }

        return ResultResponse<Employee>.Success(deletedEmployee);
    }

    
}