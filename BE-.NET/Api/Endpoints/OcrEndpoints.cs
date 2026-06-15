using System.Net;
using BE_.NET.Api.Request;
using BE_.NET.Helpers.Validation;
using BE_.NET.Response;
using Google.Cloud.Vision.V1;
using Microsoft.AspNetCore.Mvc;

namespace BE_.NET.Api.Endpoints;

public static class OcrEndpoints
{
    public static void MapOcrEndpoints(this IEndpointRouteBuilder app)
    {
        var ocrGroup = app
            .MapGroup("api/ocr")
            .WithTags("OCR");

        // Disable standard anti-forgery token validation if testing via Postman/external clients
        ocrGroup.MapPost("/plate", DetectImageToText)
            .DisableAntiforgery()
            .WithValidation<CreateImageToTextRequest>()
            .RequireRateLimiting("rate-limit");
    }

    private static async Task<IResult> DetectImageToText(
        [FromForm] CreateImageToTextRequest request,
        IConfiguration configuration)
    {

        try
        {
            var apiKey = configuration["GoogleCloud:ApiKey"];

            // Read the uploaded file into a byte array
            using var memoryStream = new MemoryStream();
            await request.ImageFile.CopyToAsync(memoryStream);
            var imageBytes = memoryStream.ToArray();

            // Create the Vision Client and load the image data
            var clientBuilder = new ImageAnnotatorClientBuilder
            {
                ApiKey = apiKey 
            };

            var client = await clientBuilder.BuildAsync();
            var image = Image.FromBytes(imageBytes);

            // Call the Vision API (TEXT_DETECTION)
            // Use DetectTextAsync for standard text/license plates. 
            // Use DetectDocumentTextAsync instead if you are scanning dense document pages.
            var response = await client.DetectTextAsync(image);

            // Extract the structured text results
            if (response == null || response.Count == 0)
            {
                return ResultResponse<object>.Success(new
                    {
                        plate_text = "No plate text could be identified in this image.",
                        status_code = (int)HttpStatusCode.UnprocessableContent
                    }
                );
            }

            // The first element in the response list contains the entire blocks of parsed text merged together
            var fullTextResult = response[0].Description.Trim();

            return ResultResponse<object>.Success(new
            {
                plate_text = fullTextResult.ToUpper().Replace("\n", " "),
                ConfidenceDetails = response.Skip(1).Select(x => new { Word = x.Description, Location = x.BoundingPoly })
            });
        }
        catch (Exception ex)
        {
            return ResultResponse<object>.Failure(
                new Error(
                    HttpStatusCode.InternalServerError, 
                    $"Google Vision API error: {ex.Message}")
            );
        }
    }
}
