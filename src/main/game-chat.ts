import robotjs from 'robotjs'
import { restoreClipboard } from './clipboard-saver'

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
  restoreClipboard((clipboard) => {
    // Modifier keys have to be one of this set:
    // http://robotjs.io/docs/syntax#keytapkey-modifier
    // Modifier keys are translated by code here:
    // https://github.com/octalmage/robotjs/blob/v0.6.0/src/robotjs.cc#L425
    const modifiers = process.platform === 'darwin' ? ['Cmd'] : ['Ctrl']

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
  })
}
