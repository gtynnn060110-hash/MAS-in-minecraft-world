'use strict'

const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder } = require('mineflayer-pathfinder')
const { plugin: pvp } = require('mineflayer-pvp')

const host = process.env.MC_HOST || 'localhost'
const port = Number(process.env.MC_PORT || 25565)
const username = process.env.MC_USERNAME || 'CourseAgent'
const auth = process.env.MC_AUTH || 'offline'
const viewerPort = Number(process.env.VIEWER_PORT || 3007)
const targetPlayer = process.env.TARGET_PLAYER

console.log(
  `Connecting ${username} to ${host}:${port} ` +
  `(auth=${auth}, target=${targetPlayer || 'nearest player'})...`
)

const bot = mineflayer.createBot({
  host,
  port,
  username,
  auth,
  // Mineflayer detects the server's Minecraft version automatically.
  version: false
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

let viewerStarted = false

function stopMoving () {
  for (const control of [
    'forward',
    'back',
    'left',
    'right',
    'jump',
    'sprint',
    'sneak'
  ]) {
    bot.setControlState(control, false)
  }
}

function findTarget () {
  if (targetPlayer) return bot.players[targetPlayer]?.entity

  const candidates = Object.values(bot.players)
    .map(player => player.entity)
    .filter(entity => entity && entity.username !== bot.username)

  candidates.sort((left, right) => {
    const leftDistance = bot.entity.position.distanceTo(left.position)
    const rightDistance = bot.entity.position.distanceTo(right.position)
    return leftDistance - rightDistance
  })
  return candidates[0]
}

function attackTarget () {
  const target = findTarget()
  if (!target) {
    console.log(
      targetPlayer
        ? `Waiting for target player: ${targetPlayer}`
        : 'Waiting for another player...'
    )
    return
  }
  console.log(`Attacking player: ${target.username}`)
  bot.pvp.attack(target)
}

bot.once('spawn', () => {
  console.log('Bot spawned in Minecraft.')

  if (!viewerStarted) {
    mineflayerViewer(bot, {
      port: viewerPort,
      firstPerson: true,
      viewDistance: 6
    })
    viewerStarted = true
    console.log(`First-person view: http://localhost:${viewerPort}`)
  }

  bot.chat('Mineflayer agent is online!')
  setTimeout(attackTarget, 1500)
})

bot.on('playerJoined', player => {
  if (!bot.pvp.target && (!targetPlayer || player.username === targetPlayer)) {
    setTimeout(attackTarget, 500)
  }
})

bot.on('entityGone', entity => {
  if (bot.pvp.target === entity) {
    bot.pvp.stop()
    console.log(`Target disappeared: ${entity.username}`)
  }
})

bot.on('entitySpawn', entity => {
  if (
    entity.type === 'player' &&
    entity.username !== bot.username &&
    !bot.pvp.target &&
    (!targetPlayer || entity.username === targetPlayer)
  ) {
    setTimeout(attackTarget, 500)
  }
})

bot.on('health', () => {
  console.log(`health=${bot.health} food=${bot.food}`)
})

bot.on('kicked', reason => {
  console.error('Kicked from server:', reason)
})

bot.on('error', error => {
  console.error('Connection error:', error.message)
})

bot.on('end', reason => {
  stopMoving()
  console.log('Disconnected:', reason)
})

function shutdown () {
  console.log('\nStopping bot...')
  bot.pvp.stop()
  stopMoving()
  bot.quit('Demo stopped')
  setTimeout(() => process.exit(0), 500)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
