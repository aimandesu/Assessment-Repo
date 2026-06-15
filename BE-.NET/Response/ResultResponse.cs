using System.Net;
using System.Text.Json.Serialization;

namespace BE_.NET.Response;

public class ResultResponse<T> : IResult
{
    private readonly T? _data;
    private readonly Error? _error;
    private readonly HttpStatusCode _status;

    private ResultResponse(T data, HttpStatusCode status)
    {
        _data = data;
        _status = status;
    }

    private ResultResponse(Error error)
    {
        _error = error;
        _status = error.Status ?? HttpStatusCode.InternalServerError;
    }

    // Factory methods
    public static ResultResponse<T> Success(T data, HttpStatusCode status = HttpStatusCode.OK)
        => new(data, status);

    public static ResultResponse<T> Failure(Error error)
        => new(error);

    public async Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.StatusCode = (int)_status;

        if (_error is null)
            await Results.Json(_data, statusCode: (int)_status).ExecuteAsync(httpContext);
        else
            await Results.Json(_error, statusCode: (int)_status).ExecuteAsync(httpContext);
    }
}

public sealed record Error(
    [property: JsonConverter(typeof(JsonNumberEnumConverter<HttpStatusCode>))]
    HttpStatusCode? Status,
    string Description,
    object? CustomObject = null)
{
    public static Error None = new(null, string.Empty, null);
}