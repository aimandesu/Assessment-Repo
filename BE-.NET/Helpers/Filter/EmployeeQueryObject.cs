using BE_.NET.Enums;

namespace BE_.NET.Helpers.Filter;

public class EmployeeQueryObject : QueryObject
{
    public string? SortBy { get; set; } = null;
}