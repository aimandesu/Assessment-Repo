using System.Net;
using BE_.NET.Response;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;

namespace BE_.NET.Services;

public static class ExceptionServiceExtension
{
    public static void ConfigureExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                    {
                        var exception = context.Features
                            .Get<IExceptionHandlerFeature>()?
                            .Error;

                        context.Response.ContentType = "application/json";

                        switch (exception)
                        {
                            case ArgumentException ex:
                                var argumentErrorResponse = ResultResponse<object>.Failure(
                                    new Error(HttpStatusCode.BadRequest, ex.Message)
                                );
                                
                                await argumentErrorResponse.ExecuteAsync(context);
                                break;
                            
                            case ValidationException ex:
                                var errors = ex.Errors
                                    .Select(e => new { field = e.PropertyName, message = e.ErrorMessage })
                                    .ToList();
                                
                                var validationErrorResponse = ResultResponse<object>.Failure(
                                        new Error(
                                            HttpStatusCode.UnprocessableEntity,
                                            "Validation failed",
                                            errors)
                                        );
                                
                                await validationErrorResponse.ExecuteAsync(context);
                                break;

                            default:
                                var internalErrorResponse = ResultResponse<object>.Failure(
                                    new Error(
                                        HttpStatusCode.InternalServerError,
                                        exception?.Message ?? "An unexpected error occurred."
                                    )
                                );
        
                                await internalErrorResponse.ExecuteAsync(context);
                                break;
                        }
                    }
                );
            }
        );
    }
}