using BE_.NET.IRepository;
using BE_.NET.Model;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BE_.NET.Helpers.Generator;

public static class EmployeeIdGenerator
{
    public static async Task<string> GenerateEmployeeCode(IBaseRepository<Employee> repository, DateTime referenceDate)
    {
        var yearStr = referenceDate.ToString("yyyy"); // e.g., "2026"
        var monthStr = referenceDate.ToString("MM");  // e.g., "06"
        var prefix = $"{yearStr}{monthStr}";          // e.g., "202606"

        // Fetch all employees to evaluate existing IDs
        var employees = await repository.GetAll(); 
    
        var lastSequence = employees
            .Where(e =>   e.Id.StartsWith(prefix))
            .Select(e => {
                var sequenceStr = e.Id[6..]; // Extracts the 5-digit string part
                return int.TryParse(sequenceStr, out int result) ? result : 0;
            })
            .DefaultIfEmpty(0)
            .Max();

        var nextSequence = lastSequence + 1;

        // Format: prefix (6 chars) + 5-digit padded number (e.g., 20260600001)
        return $"{prefix}{nextSequence:D5}";
    }
}