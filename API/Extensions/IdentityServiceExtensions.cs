using System;
using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistance;

namespace API.Extensions
{
	public static class IdentityServiceExtensions
	{
		public static IServiceCollection AddIdentityServices(this IServiceCollection services,
			IConfiguration configuration)
		{
			services.AddIdentityCore<AppUser>(opt =>
			{
				opt.Password.RequireNonAlphanumeric = false;
				opt.Password.RequiredLength = 5;
				opt.Password.RequireDigit = false;
				opt.Password.RequireUppercase = false;
				opt.Password.RequireLowercase = false;
				opt.User.RequireUniqueEmail = true;
			})
			.AddEntityFrameworkStores<DataContext>();

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("TokenKey").Value));

			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(opt => {
					opt.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuerSigningKey = true,
						IssuerSigningKey = key,
						ValidateIssuer = false,
						ValidateAudience = false
					};
					opt.Events = new JwtBearerEvents
					{
						OnMessageReceived = context =>
						{
							var accessToken = context.Request.Query["access_token"];
							var path = context.HttpContext.Request.Path;
							if(!string.IsNullOrEmpty(accessToken) &&
								path.StartsWithSegments("/chat"))
							{
								context.Token = accessToken;
							}
							return Task.CompletedTask;
						}
					};
			});

			services.AddAuthorization(opt =>
			{
				opt.AddPolicy("IsActivityHost", policy =>
				{
					policy.Requirements.Add(new IsHostRequirement());
				});
			});
			services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
			services.AddScoped<TokenService>();

			return services;
		}
	}
}

