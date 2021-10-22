import { clipboard } from 'electron'
import robotjs from 'robotjs'
import { config } from './config'

const PLACEHOLDER_LAST = '@last'
const AUTO_CLEAR = [
  '#', // Global
  '%', // Party
  '@', // Whisper
  '$', // Trade
  '&', // Guild
  '/' // Command
]

export function typeInChat (text: string, send: boolean) {
  const saved = clipboard.readText()

  // Modifier keys have to be one of this set:
  // http://robotjs.io/docs/syntax#keytapkey-modifier
  // Modifier keys are translated by code here:
  // https://github.com/octalmage/robotjs/blob/v0.6.0/src/robotjs.cc#L425
  const modifiers = process.platform === 'darwin' ? ['command'] : ['control'];

  if (text.startsWith(PLACEHOLDER_LAST)) {
    text = text.substr(`${PLACEHOLDER_LAST} `.length)
    clipboard.writeText(text)
    robotjs.keyTap('Enter', modifiers)
  } else if (text.endsWith(PLACEHOLDER_LAST)) {
    text = text.slice(0, -PLACEHOLDER_LAST.length)
    clipboard.writeText(text)
    robotjs.keyTap('Enter', modifiers)
    robotjs.keyTap('Home')
    robotjs.keyTap('Delete')
  } else {
    clipboard.writeText(text)
    robotjs.keyTap('Enter')
    if (!AUTO_CLEAR.includes(text[0])) {
      robotjs.keyTap('A', modifiers)
    }
  }

  robotjs.keyTap('V', modifiers)

  if (send) {
    robotjs.keyTap('Enter')
    // restore the last chat
    robotjs.keyTap('Enter')
    robotjs.keyTap('ArrowUp')
    robotjs.keyTap('ArrowUp')
    robotjs.keyTap('Escape')
  }

  if (config.get('restoreClipboard')) {
    setTimeout(() => {
      clipboard.writeText(saved)
    }, 120)
  }
}
