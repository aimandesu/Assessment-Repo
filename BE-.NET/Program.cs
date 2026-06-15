using BE_.NET;
using BE_.NET.Api.Endpoints;
using BE_.NET.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureCorsPolicyServiceExtension(builder.Configuration);
builder.Services.ConfigureDiService();
builder.Services.ConfigureRateLimiterServiceExtension();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}

app.UseCors("CorsPolicy");
app.UseRateLimiter();
app.ConfigureExceptionHandler();
app.UseHttpsRedirection();
//Routes
app.MapEmployeeEndpoints();
app.MapOcrEndpoints();

app.Run();
