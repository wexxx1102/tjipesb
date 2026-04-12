# TjipeTouchscreenWinUI

这是一个为天津知识产权交易中心触摸屏场景准备的 WinUI 3 首版工程骨架，重点优化了竖版触摸大屏首页体验。

## 当前实现

- 独立的 WinUI 3 `unpackaged` 工程结构
- 适合竖版触摸屏的单列式首页
- Fluent 风格的品牌头图、快捷入口、重点展区与运营提示模块
- 浅色 / 深色主题资源
- 使用现有 `logo-main.png` 作为品牌资产

## 本机限制

当前工作机是 macOS，且没有 `dotnet`、`winget` 和 Windows App SDK，因此这里无法完成以下官方验证步骤：

- `dotnet new winui`
- `dotnet build`
- Windows 环境下的真实窗口启动验证

## 建议在 Windows 机器上做的下一步

1. 安装 Visual Studio 与 WinUI 3 / Windows App SDK 开发组件。
2. 在命令行确认 `dotnet` 可用，并安装 WinUI 模板。
3. 打开 `TjipeTouchscreenWinUI.csproj`。
4. 先恢复 NuGet 包，再构建并运行。
5. 将当前示例数据替换成你现有资源目录和业务入口的真实绑定。
