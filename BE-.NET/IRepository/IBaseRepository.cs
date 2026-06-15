namespace BE_.NET.IRepository;

public interface IBaseRepository<T>
{
    Task<List<T>> GetAll(object? id = null);
    Task<T> Create(T entity);
    Task<T?> Update(T entity, object id); //if by design, we need to supply accordingly
    //the entity so we dont even need the id
    Task<T?> Delete(object id);
}