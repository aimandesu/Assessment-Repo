namespace BE_.NET.Helpers;

public static class EnumHelper
{
    public static T ParseEnumOrThrow<T>(string value, bool ignoreCase = true)
            where T : struct, Enum
        {
            if (Enum.TryParse(value, ignoreCase, out T result))
                return result;

            throw new ArgumentException($"Invalid value '{value}' for enum {typeof(T).Name}");
        }
}