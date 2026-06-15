namespace BE_.NET.Helpers.Filter;

public abstract class QueryObject
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool IsDescending { get; set; } = false;
}