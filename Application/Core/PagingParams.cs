using System;
namespace Application.Core
{
	public class PagingParams
	{
		private const int MaximumPageSize = 50;
		public int PageNumber { get; set; } = 1;
		public int _pageSize = 8;
		public int PageSize
		{
			get => _pageSize;
			set => _pageSize = (value > MaximumPageSize) ?
				MaximumPageSize : value;
		}
	}
}

