using BE_.NET.Api.Request;
using FluentValidation;

namespace BE_.NET.Helpers.Validation;

public class ImageToTextRequest : AbstractValidator<CreateImageToTextRequest>
{
    public ImageToTextRequest()
    {
        RuleFor(x => x.ImageFile.Length)
            .LessThanOrEqualTo(5 * 1024 * 1024)
            .WithMessage("The image must be 5 MB or smaller.");
            
        RuleFor(x => x.ImageFile.ContentType)
            .Must(type => type is "image/jpeg" or "image/png")
            .WithMessage("Only JPEG and PNG images are allowed.");
    }
    
}