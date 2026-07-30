# Mineflayer Minecraft Agent：完整安装与运行指南

本项目演示一个最小的 Minecraft agent：

- 使用 Mineflayer 作为无界面 Minecraft Java 客户端；
- 使用 Docker 在本机运行免费的 Minecraft Java Server；
- agent 进入服务器后自动追踪并持续攻击指定玩家；
- 使用 Prismarine Viewer 在浏览器显示 agent 的第一人称画面；
- 不需要购买或安装 Minecraft Java Edition 客户端。

> 本项目用于本地教学演示。服务器仅监听本机端口，且关闭了正版账号验证，请不要直接暴露到公网。

## 1. 系统结构

```text
浏览器
  │
  │ http://localhost:3007
  ▼
Prismarine Viewer
  │
Mineflayer Agent
  │
  │ Minecraft protocol: localhost:25565
  ▼
Docker 中的 Minecraft Java Server
```

Mineflayer 本身不渲染官方 Minecraft 游戏窗口。浏览器里的 Prismarine Viewer 会根据服务器数据渲染 agent 的第一人称世界。

## 2. 前置条件

需要安装：

- macOS、Windows 或 Linux；
- Docker Desktop；
- Node.js 18 或以上，推荐 Node.js 20 LTS；
- npm，通常随 Node.js 一起安装；
- 至少约 4 GB 可用内存；
- 第一次安装时需要互联网连接，用于下载 Docker 镜像和 npm 包。

不需要：

- Minecraft 付费账号；
- Minecraft Launcher；
- Python 或 Conda；
- MineRL、MineDojo；
- 手动安装 Java。Minecraft Server 使用的 Java 已包含在 Docker 镜像中。

## 3. 获取项目

项目目录应包含：

```text
final project/
├── bot.js
├── compose.yaml
├── package.json
└── README.md
```

进入项目：

```bash
cd "/Users/gtynnn/Documents/Learning/UK_summer/learning/final project"
```

如果项目位于其他位置，请将路径替换成实际路径。

## 4. 安装 Docker Desktop

### macOS

使用 Homebrew：

```bash
brew install --cask docker
```

也可以从 Docker 官方网站下载 Docker Desktop。

安装后必须从“应用程序”中打开 Docker，并等待菜单栏显示 Docker 已运行。

验证：

```bash
docker --version
docker compose version
```

### Windows

1. 安装 Docker Desktop；
2. 根据安装提示启用 WSL 2；
3. 启动 Docker Desktop；
4. 在 PowerShell 中验证：

```powershell
docker --version
docker compose version
```

### Linux

安装 Docker Engine 和 Docker Compose Plugin，然后验证：

```bash
docker --version
docker compose version
```

## 5. 安装 Node.js

推荐 Node.js 20 LTS。

### macOS

```bash
brew install node@20
```

如果 Homebrew 提示 `node@20` 未链接：

```bash
brew link --overwrite --force node@20
```

### 使用 nvm

如果已经安装 nvm：

```bash
nvm install 20
nvm use 20
```

验证：

```bash
node --version
npm --version
```

Node.js 应显示 `v20.x.x`。Node 18、20 和部分更新版本也可运行，但 Node 20 LTS 通常兼容性最好。

## 6. 安装 Agent 依赖

在项目目录执行：

```bash
npm install
```

它会安装：

- `mineflayer`：Minecraft bot API；
- `mineflayer-pathfinder`：追踪目标时自动寻路；
- `mineflayer-pvp`：玩家追踪和持续攻击；
- `prismarine-viewer`：浏览器第一人称画面。

验证依赖：

```bash
npm list mineflayer mineflayer-pathfinder mineflayer-pvp prismarine-viewer
```

## 7. 启动本地 Minecraft Server

项目通过 `compose.yaml` 启动 Paper Minecraft Server 1.21.1。

```bash
docker compose up -d
```

第一次运行需要下载镜像、Minecraft Server 和世界文件，可能需要几分钟。

实时查看日志：

```bash
docker compose logs -f minecraft
```

当日志出现以下内容时，服务器已经准备好：

```text
Done (...)! For help, type "help"
```

按 `Ctrl+C` 只会退出日志查看，不会关闭服务器。

查看服务器状态：

```bash
docker compose ps
```

服务器地址为：

```text
localhost:25565
```

## 8. 启动 Mineflayer Agent

另外打开一个终端，进入项目目录：

```bash
cd "/Users/gtynnn/Documents/Learning/UK_summer/learning/final project"
npm start
```

默认配置：

```text
服务器：localhost
端口：25565
bot 名称：CourseAgent
认证模式：offline
Viewer 端口：3007
```

连接成功后终端会显示：

```text
Bot spawned in Minecraft.
First-person view: http://localhost:3007
```

如果不设置目标，agent 会选择距离最近的其他玩家并持续追击。推荐明确指定目标玩家名：

macOS、Linux 或 Git Bash：

```bash
TARGET_PLAYER=PlayerName npm start
```

Windows PowerShell：

```powershell
$env:TARGET_PLAYER="PlayerName"
npm start
```

Windows CMD：

```bat
set TARGET_PLAYER=PlayerName
npm start
```

将 `PlayerName` 替换成目标玩家在游戏中的准确名称，区分大小写。目标玩家进入服务器后，终端会显示：

```text
Attacking player: PlayerName
```

如果目标玩家死亡并重生，agent 会重新锁定新生成的玩家实体。

停止 agent：

```text
Ctrl+C
```

## 9. 查看 Minecraft 游戏画面

在浏览器打开：

```text
http://localhost:3007
```

这里会显示 `CourseAgent` 的第一人称实时画面。

如果页面刚打开时世界尚未显示：

1. 等待服务器区块生成；
2. 刷新浏览器；
3. 检查 agent 终端是否出现 `Bot spawned in Minecraft`；
4. 检查端口 `3007` 是否被其他程序占用。

## 10. 自定义连接参数

项目使用环境变量配置连接。

### 修改 bot 名称

```bash
MC_USERNAME=MyAgent npm start
```

### 使用不同服务器端口

```bash
MC_PORT=25566 npm start
```

指定服务器端口和攻击目标：

```bash
MC_PORT=25566 TARGET_PLAYER=PlayerName npm start
```

Windows PowerShell：

```powershell
$env:MC_PORT="25566"
$env:TARGET_PLAYER="PlayerName"
npm start
```

### 使用不同 Viewer 端口

```bash
VIEWER_PORT=3008 npm start
```

然后访问：

```text
http://localhost:3008
```

### 连接另一台机器上的服务器

```bash
MC_HOST=192.168.1.100 MC_PORT=25565 npm start
```

只有可信局域网环境才应使用离线认证。不要把当前关闭正版验证的服务器直接开放到公网。

## 11. 服务器管理

### 停止服务器但保留世界

```bash
docker compose stop
```

### 再次启动

```bash
docker compose start
```

### 停止并移除服务器容器

```bash
docker compose down
```

世界数据仍保存在 Docker volume 中。

### 查看日志

```bash
docker compose logs --tail=100 minecraft
```

### 重置世界

以下命令会永久删除当前 Minecraft 世界：

```bash
docker compose down -v
docker compose up -d
```

不要在需要保留世界时使用 `-v`。

## 12. 常见错误

### `Cannot connect to the Docker daemon`

Docker Desktop 尚未启动。打开 Docker Desktop，等待其完成初始化，再执行：

```bash
docker compose up -d
```

### Agent 显示 `ECONNREFUSED`

Minecraft Server 尚未准备好。检查：

```bash
docker compose ps
docker compose logs --tail=100 minecraft
```

等待日志出现 `Done` 后再运行 `npm start`。

### `port is already allocated`

本机的 `25565` 已被占用。编辑 `compose.yaml`：

```yaml
ports:
  - "25566:25565"
```

重启服务器：

```bash
docker compose down
docker compose up -d
```

然后这样启动 agent：

```bash
MC_PORT=25566 npm start
```

### Viewer 的 `3007` 端口被占用

```bash
VIEWER_PORT=3008 npm start
```

访问：

```text
http://localhost:3008
```

### Agent 被踢出并提示认证失败

确认 `compose.yaml` 包含：

```yaml
ONLINE_MODE: "FALSE"
```

然后重建容器：

```bash
docker compose down
docker compose up -d
```

### Minecraft 协议版本不支持

本项目固定服务器版本：

```yaml
VERSION: "1.21.1"
```

不要随意改成 Minecraft 最新快照版本。若修改服务器版本，应先确认当前 Mineflayer 版本支持它。

### Apple Silicon

Docker Desktop 会自动选择兼容的 ARM64 镜像。这个方案不使用旧 MineRL/Forge，因此不需要 Rosetta、Java 8 或 x86 Conda 环境。

## 13. 完整启动顺序

每次演示只需要：

```bash
cd "/Users/gtynnn/Documents/Learning/UK_summer/learning/final project"
docker compose up -d
docker compose logs -f minecraft
```

看到 `Done` 后按 `Ctrl+C` 退出日志，再执行：

```bash
npm start
```

最后在浏览器打开：

```text
http://localhost:3007
```

演示结束：

```text
先在 agent 终端按 Ctrl+C
```

然后停止服务器：

```bash
docker compose stop
```

## 14. EULA 与安全说明

`compose.yaml` 中的：

```yaml
EULA: "TRUE"
```

表示运行者同意 Minecraft End User License Agreement。使用前应自行阅读并确认接受相关条款。

`ONLINE_MODE: "FALSE"` 关闭了 Microsoft/Mojang 账号认证，仅适合本机教学实验。当前配置只映射 Minecraft 游戏端口，不应通过路由器端口转发、云服务器安全组或公网隧道公开该服务。
