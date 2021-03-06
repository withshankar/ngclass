using System.IO;
using AtTheMovies.Server.Data;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Newtonsoft.Json.Serialization;

namespace AtTheMovies
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc()
                    .AddJsonOptions(o => o.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver());
            services.AddScoped<IMovieStore, InMemoryMovieStore>();
        }
        public void Configure(IApplicationBuilder app, IApplicationEnvironment environemnt)
        {
            app.UseIISPlatformHandler();

            var provider = new PhysicalFileProvider(Path.Combine(environemnt.ApplicationBasePath, "node_modules"));
            var options = new FileServerOptions();
            options.RequestPath = "/node_modules";
            options.StaticFileOptions.FileProvider = provider;
            options.EnableDirectoryBrowsing = true;
            app.UseFileServer(options);

            app.UseFileServer();
            app.UseMvc();
            
            app.Run(async ctx =>
            {
                var pathToIndex = Path.Combine(environemnt.ApplicationBasePath, "wwwroot", "index.html");
                using (var indexStream = File.Open(pathToIndex, FileMode.Open))
                {
                    ctx.Response.StatusCode = 200;
                    await indexStream.CopyToAsync(ctx.Response.Body);
                }
            });

        }

        public static void Main(string[] args) => Microsoft.AspNet.Hosting.WebApplication.Run<Startup>(args);
    }
}
