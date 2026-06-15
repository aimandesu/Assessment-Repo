using FluentValidation;

namespace BE_.NET.Services;

public class ValidationServiceBehavior<T>(IValidator<T> validator) : IEndpointFilter
    where T : class
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        // Locate the argument matching the request type 'T'
        var argument = context.Arguments.FirstOrDefault(x => x is T) as T;

        if (argument is null)
        {
            throw new ArgumentException($"Invalid value '{argument}' for enum {typeof(T).Name}");
        }

        var validationResult = await validator.ValidateAsync(argument);

        if (!validationResult.IsValid)
        {
            // Converts FluentValidation errors into a standard ProblemDetails dictionary
            var failures = validationResult.Errors;
            
            if (failures.Count != 0)
            {
                throw new ValidationException(failures);
            }
        }

        return await next(context);
    }
}
