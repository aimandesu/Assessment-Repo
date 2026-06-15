using BE_.NET.Services;

namespace BE_.NET.Helpers.Validation;

public static class ValidationExtensions
{
    public static RouteHandlerBuilder WithValidation<T>(this RouteHandlerBuilder builder) where T : class
    {
        return builder
            .AddEndpointFilter<ValidationServiceBehavior<T>>();
        // .ProducesValidationProblem(); // Enhances OpenAPI / Swagger documentation
    }
}
