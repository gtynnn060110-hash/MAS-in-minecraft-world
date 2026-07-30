# Mineflayer PvP Agent Demo

这是一个最小的 Minecraft Java Edition agent。它使用 Mineflayer 连接一个已经存在的 Minecraft 服务器，并自动追踪、接近和持续攻击指定玩家。

当前实现包含：

- 连接 Minecraft Java 服务器或本地 LAN 世界；
- 自动识别服务器协议版本；
- 使用 `TARGET_PLAYER` 指定攻击目标；
- 未指定目标时选择距离最近的其他玩家；
- 使用 Pathfinder 自动追踪目标；
- 使用 PvP 插件持续攻击目标；
- 目标消失或重生后重新锁定；
- 在浏览器显示 bot 的第一人称画面；
- 在终端输出连接、目标、生命值和食物值；
- Windows 一键启动脚本。

## 1. 项目结构

```text
final project/
├── bot.js
├── package.json
├── package-lock.json
├── start-windows.bat
└── README.md
```

核心运行结构：

```text
已有 Minecraft Java Server / LAN 世界
                  ↕
        Mineflayer PvP Agent
                  ↓
       http://localhost:3007
        第一人称浏览器画面
```

Mineflayer 是无界面 Minecraft 客户端。它不会启动官方 Minecraft 游戏窗口，因此必须先有一个可以连接的 Minecraft Java 服务器或 LAN 世界。

## 2. 环境要求

- Windows、macOS 或 Linux；
- Node.js 18 以上，推荐 Node.js 20 LTS；
- npm，通常随 Node.js 一起安装；
- 一个允许 bot 加入的 Minecraft Java 服务器；
- 第一次执行 `npm install` 时需要网络。

检查 Node.js 和 npm：

```bash
node --version
npm --version
```

## 3. 安装依赖

进入项目目录：

```bash
cd "final project"
```

安装：

```bash
npm install
```

`package.json` 当前包含：

- `mineflayer`：Minecraft bot 客户端；
- `mineflayer-pathfinder`：追踪玩家和自动寻路；
- `mineflayer-pvp`：持续攻击；
- `prismarine-viewer`：浏览器第一人称画面；
- `canvas`：Viewer 使用的图形能力。

验证：

```bash
npm list --depth=0
```

## 4. 准备 Minecraft 世界

### 方式 A：连接已有服务器

需要知道：

- 服务器 IP 或域名；
- 服务器端口；
- 服务器是否启用正版账号验证；
- 服务器是否允许 bot。

本项目默认使用离线认证，只适合自己控制的本地或可信测试服务器。

### 方式 B：使用 Minecraft Java 单人 LAN 世界

1. 启动 Minecraft Launcher；
2. 选择 `Minecraft: Java Edition`；
3. 进入一个单人世界；
4. 按 `Esc`；
5. 点击“对局域网开放 / Open to LAN”；
6. 点击“创建一个局域网世界 / Start LAN World”；
7. 记下聊天栏显示的端口，例如 `5091`。

退出单人世界后 LAN 服务会关闭。再次开放时端口可能改变。

## 5. Windows 一键启动

双击：

```text
start-windows.bat
```

脚本会：

1. 自动进入项目目录；
2. 检查 Node.js 和 npm；
3. 缺少依赖时运行 `npm install`；
4. 询问服务器地址；
5. 询问服务器端口；
6. 询问 bot 名称；
7. 询问目标玩家名；
8. 启动 agent。

连接本机 LAN 世界的输入示例：

```text
Server address [localhost]:
Server port [25565]: 5091
Bot name [CourseAgent]:
Target player name (required): Steve
```

方括号中的内容是默认值。服务器地址和 bot 名称可直接按回车；LAN 端口需要填写游戏聊天栏显示的实际端口。

停止 agent：

```text
Ctrl+C
```

## 6. 命令行启动

### Windows PowerShell

```powershell
cd "C:\项目路径\final project"
$env:MC_PORT="5091"
$env:TARGET_PLAYER="Steve"
npm start
```

### Windows CMD

```bat
cd /d "C:\项目路径\final project"
set MC_PORT=5091
set TARGET_PLAYER=Steve
npm start
```

### macOS、Linux 或 Git Bash

```bash
cd "final project"
MC_PORT=5091 TARGET_PLAYER=Steve npm start
```

连接另一台机器上的服务器：

```bash
MC_HOST=192.168.1.100 \
MC_PORT=25565 \
TARGET_PLAYER=Steve \
npm start
```

## 7. 配置参数

| 环境变量 | 默认值 | 当前作用 |
|---|---|---|
| `MC_HOST` | `localhost` | Minecraft 服务器地址 |
| `MC_PORT` | `25565` | Minecraft 服务器端口 |
| `MC_USERNAME` | `CourseAgent` | bot 名称或登录账号 |
| `MC_AUTH` | `offline` | `offline` 或 `microsoft` |
| `TARGET_PLAYER` | 未设置 | 指定攻击目标 |
| `VIEWER_PORT` | `3007` | 第一人称网页端口 |

如果不设置 `TARGET_PLAYER`，bot 会选择当前距离最近的其他玩家。

## 8. 运行效果

连接成功后终端显示：

```text
Bot spawned in Minecraft.
First-person view: http://localhost:3007
```

锁定目标后显示：

```text
Attacking player: Steve
```

如果目标尚未进入服务器：

```text
Waiting for target player: Steve
```

目标进入或重生后，bot 会再次尝试锁定。

## 9. 查看第一人称画面

浏览器打开：

```text
http://localhost:3007
```

这是 bot 的第一人称实时画面。它由 Prismarine Viewer 根据服务器发送的数据渲染，不是官方 Minecraft 客户端画面。

若 `3007` 被占用，可修改端口。

Windows PowerShell：

```powershell
$env:VIEWER_PORT="3008"
npm start
```

macOS、Linux 或 Git Bash：

```bash
VIEWER_PORT=3008 npm start
```

然后访问：

```text
http://localhost:3008
```

## 10. 正版认证服务器

默认配置：

```text
MC_AUTH=offline
```

它只适合关闭正版验证的本地测试服务器或 LAN 世界。

连接启用正版验证的服务器时，需要使用 Microsoft 登录。

Windows PowerShell：

```powershell
$env:MC_HOST="服务器地址"
$env:MC_PORT="25565"
$env:MC_AUTH="microsoft"
$env:MC_USERNAME="微软账号邮箱"
$env:TARGET_PLAYER="Steve"
npm start
```

首次运行会要求通过浏览器完成设备登录。不要把账号密码写入 `bot.js`。

## 11. 常见错误

### `ECONNREFUSED`

服务器地址或端口错误，或者服务器尚未启动。

LAN 世界需要确认：

- Minecraft 世界仍然打开；
- 已经执行“对局域网开放”；
- 使用聊天栏显示的最新端口。

### `Unsupported protocol version`

服务器的 Minecraft 版本尚未被当前 Mineflayer 支持。升级项目依赖：

```bash
npm update
```

如果仍然失败，需要换用 Mineflayer 支持的 Minecraft Java 版本。

### `Failed to verify username`

服务器启用了正版认证，但 bot 使用了 `offline` 模式。改为 `MC_AUTH=microsoft` 并使用拥有 Minecraft Java Edition 的 Microsoft 账号。

### 找不到目标玩家

确认：

- `TARGET_PLAYER` 与游戏内名称完全一致；
- 名称大小写正确；
- 目标玩家已经进入同一个服务器；
- 目标玩家在 bot 已加载的区域内。

### Viewer 无法打开

先确认终端已经显示：

```text
First-person view: http://localhost:3007
```

若没有，检查 agent 是否成功进入服务器以及终端是否出现错误。

### Windows 安装 `canvas` 失败

优先使用 Node.js 20 LTS，然后删除旧依赖并重新安装：

Windows PowerShell：

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

只有安装仍然失败时才需要执行以上清理操作。

## 12. 安全与使用范围

该 agent 会主动追踪并攻击玩家。只应在自己控制的测试服务器，或所有参与者明确同意的环境中运行。

不要在未经允许的公共服务器使用，也不要尝试绕过服务器认证、反作弊或访问限制。
