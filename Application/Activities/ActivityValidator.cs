using System;
using FluentValidation;

namespace Application.Activities
{
	public class ProfileValidator : AbstractValidator<Domain.Activity>
	{
		public ProfileValidator()
		{
			RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();
        }
	}
}

