namespace TjipeTouchscreenWinUI.Models;

public sealed class DashboardCard
{
    public string Glyph { get; init; } = "";
    public string Eyebrow { get; init; } = "";
    public string Title { get; init; } = "";
    public string Summary { get; init; } = "";
    public string Metric { get; init; } = "";
    public string Footer { get; init; } = "";
}

public sealed class QuickAction
{
    public string Glyph { get; init; } = "";
    public string Title { get; init; } = "";
    public string Description { get; init; } = "";
    public string Status { get; init; } = "";
}

public sealed class ActivityItem
{
    public string Time { get; init; } = "";
    public string Title { get; init; } = "";
    public string Description { get; init; } = "";
}
