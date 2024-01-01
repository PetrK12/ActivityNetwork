using System;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Comments
{
	public class List
	{
		public class Query : IRequest<Result<List<CommentDto>>>
		{
			public Guid ActivityId { get; set; }
		}

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;

            public Handler(IMapper mapper, DataContext dataContext)
            {
                _mapper = mapper;
                _dataContext = dataContext;
            }

            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _dataContext.Comments
                    .Where(x => x.Activity.Id == request.ActivityId)
                    .OrderByDescending(x => x.CreatedAt)
                    .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                if(comments == null)
                {
                    return Result<List<CommentDto>>.Failure("No comments exists");
                }

                return Result<List<CommentDto>>.Succes(comments);
            }
        }
    }
}

