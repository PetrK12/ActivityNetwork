using System;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
	public class Delete
	{
		public class Command : IRequest<Result<Unit>>
		{
			public string Id { get; set; }
		}

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if(user == null)
                {
                    return null;
                }

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                {
                    return null;
                }

                if (photo.IsMain)
                {
                    return Result<Unit>.Failure("Cannot delete main photo");
                }

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if(result == null)
                {
                    return Result<Unit>.Failure("Problem deleting photo from cloud");
                }

                user.Photos.Remove(photo);
                var success = await _dataContext.SaveChangesAsync() > 0;

                if(success)
                {
                    return Result<Unit>.Succes(Unit.Value);
                }
                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}

