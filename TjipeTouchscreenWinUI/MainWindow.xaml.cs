using System.Collections.ObjectModel;
using Microsoft.UI;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Media;
using TjipeTouchscreenWinUI.Models;
using Windows.Graphics;
using WinRT.Interop;

namespace TjipeTouchscreenWinUI;

public sealed partial class MainWindow : Window
{
    private readonly DispatcherQueueTimer _clockTimer;

    public ObservableCollection<QuickAction> QuickActions { get; } =
    [
        new()
        {
            Glyph = "\uE8A7",
            Title = "交易项目查询",
            Description = "进入项目检索、成果筛选与挂牌信息查看。",
            Status = "高频使用"
        },
        new()
        {
            Glyph = "\uE71D",
            Title = "成果展示中心",
            Description = "集中浏览视频、图片、PPT 与 PDF 资料。",
            Status = "大屏首推"
        },
        new()
        {
            Glyph = "\uE8D2",
            Title = "数据知识产权登记",
            Description = "保留登记入口，适合现场导流和业务咨询。",
            Status = "业务入口"
        },
        new()
        {
            Glyph = "\uE714",
            Title = "宣传短片播放",
            Description = "适合待机轮播和参观者自助点播。",
            Status = "自动轮播"
        }
    ];

    public ObservableCollection<DashboardCard> SpotlightCards { get; } =
    [
        new()
        {
            Glyph = "\uE786",
            Eyebrow = "成果专区",
            Title = "媒体内容瀑布卡片",
            Summary = "用大卡片承载视频封面、成果图册与演示文档，减少复杂切换，适合站立式快速浏览。",
            Metric = "4 类",
            Footer = "建议在落地阶段接入本地资源扫描结果。"
        },
        new()
        {
            Glyph = "\uE707",
            Eyebrow = "信息引导",
            Title = "一步到位的入口层级",
            Summary = "首页首屏只保留关键动作，次级内容往下滑动查看，竖屏下阅读和点按都更自然。",
            Metric = "1 屏",
            Footer = "可继续扩展成待机轮播与自动回首页机制。"
        },
        new()
        {
            Glyph = "\uE8FD",
            Eyebrow = "现场体验",
            Title = "适合触摸大屏的可视节奏",
            Summary = "边距更大、按钮更厚、状态更明确，降低误触并增强远距离识别效果。",
            Metric = "32 px",
            Footer = "全局以单列流式布局为主，横向信息只做辅助。"
        }
    ];

    public ObservableCollection<ActivityItem> ActivityFeed { get; } =
    [
        new()
        {
            Time = "09:00",
            Title = "开馆模式",
            Description = "默认展示品牌头图与快捷入口，适合访客刚进入时迅速理解系统用途。"
        },
        new()
        {
            Time = "全天",
            Title = "自动导览",
            Description = "后续可接入待机轮播、无操作回首页与宣传片自动播放逻辑。"
        },
        new()
        {
            Time = "维护",
            Title = "内容替换简化",
            Description = "资源区可继续沿用现有素材目录结构，减少现场维护成本。"
        }
    ];

    public MainWindow()
    {
        InitializeComponent();
        TryConfigurePortraitWindow();
        TryEnableBackdrop();

        _clockTimer = DispatcherQueue.CreateTimer();
        _clockTimer.Interval = TimeSpan.FromSeconds(1);
        _clockTimer.Tick += (_, _) => UpdateClock();
        _clockTimer.Start();
        UpdateClock();
    }

    private void UpdateClock()
    {
        CurrentTimeText.Text = DateTime.Now.ToString("yyyy.MM.dd  HH:mm:ss");
    }

    private void TryConfigurePortraitWindow()
    {
        IntPtr hwnd = WindowNative.GetWindowHandle(this);
        WindowId windowId = Win32Interop.GetWindowIdFromWindow(hwnd);
        AppWindow appWindow = AppWindow.GetFromWindowId(windowId);
        appWindow.Resize(new SizeInt32(1120, 1800));
        appWindow.Title = "天津知识产权交易中心触摸屏";
    }

    private void TryEnableBackdrop()
    {
        SystemBackdrop = new MicaBackdrop
        {
            Kind = MicaKind.BaseAlt
        };
    }
}
