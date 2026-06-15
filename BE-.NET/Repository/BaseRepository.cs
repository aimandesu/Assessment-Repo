using BE_.NET.IRepository;
using Microsoft.EntityFrameworkCore;

namespace BE_.NET.Repository;

public class BaseRepository<T>(ApplicationDbContext context) : IBaseRepository<T>
    where T : class
{

    public virtual async Task<List<T>> GetAll(object? id = null)
    {
        var query = context.Set<T>().AsNoTracking();
        
        return await query.ToListAsync(); 
    }

    public virtual async Task<T> Create(T entity)
    {
        await context.Set<T>().AddAsync(entity);
        await context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T?> Update(T entity, object id)
    {
        var existing = await context.Set<T>().FindAsync(id);
        if (existing == null) return null;
        
        context.Entry(existing).CurrentValues.SetValues(entity);
        await context.SaveChangesAsync(); 
        
        return entity;
    }

    public virtual async Task<T?> Delete(object id)
    {
        var  existing = await context.Set<T>().FindAsync(id);
        if (existing == null) return null;
        
        context.Set<T>().Remove(existing);
        await context.SaveChangesAsync();
        
        return existing;
    }
}