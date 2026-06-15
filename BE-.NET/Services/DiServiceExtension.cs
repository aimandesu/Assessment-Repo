using System.Reflection;
using BE_.NET.IRepository;
using BE_.NET.Repository;
using FluentValidation;

namespace BE_.NET.Services;

public static class DiServiceExtension
{
    public static void ConfigureDiService(this IServiceCollection services)
    {
        
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        services.AddValidatorsFromAssembly(
            Assembly.GetExecutingAssembly()
            //includeInternalTypes: true -> use this if your validation is internal class
        );

    }
}