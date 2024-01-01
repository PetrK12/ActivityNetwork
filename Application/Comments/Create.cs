using System;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Comments
{
	public class Create
	{
		public class Command : IRequest<Result<CommentDto>>
		{
			public string Body { get; set; }
			public Guid ActivityId { get; set; }
		}

		public class CommandValidator : AbstractValidator<Command>
		{
			public CommandValidator()
			{
				RuleFor(x => x.Body).NotEmpty();
			}
		}

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
			private readonly DataContext _dataContext;
			private readonly IMapper _mapper;
			private readonly IUserAccessor _userAccessor;

            public Handler(IUserAccessor userAccessor, DataContext dataContext, IMapper mapper)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
				var activity = await _dataContext.Activities
					.FindAsync(request.ActivityId);

				var user = await _dataContext.Users
					.Include(p => p.Photos)
					.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

				if(activity == null || user == null)
				{
					return null;
				}

				var comment = new Comment
				{
					Author = user,
					Activity = activity,
					Body = request.Body,
				};

				activity.Comments.Add(comment);

				var successs = await _dataContext.SaveChangesAsync() > 0;

				if(successs)
				{
					return Result<CommentDto>.Succes(_mapper.Map<CommentDto>(comment));
				}
				return Result<CommentDto>.Failure("Failed to add comment");
            }
        }
    }
}

