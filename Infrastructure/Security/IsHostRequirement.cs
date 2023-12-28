using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Infrastructure.Security
{
	public class IsHostRequirement : IAuthorizationRequirement
	{
	}

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccesor;

        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccesor, DataContext dbContext)
        {
            _httpContextAccesor = httpContextAccesor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Task.CompletedTask;
            }

            var activityId = Guid.Parse(_httpContextAccesor.HttpContext?
                .Request.RouteValues.SingleOrDefault(
                x => x.Key == "id").Value?.ToString());

            var atendee = _dbContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.AppUserId == userId
                    && x.ActivityId == activityId)
                .Result;

            if (atendee == null)
            {
                return Task.CompletedTask;
            }

            if (atendee.IsHost)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}

