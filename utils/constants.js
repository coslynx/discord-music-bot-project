import { playCommand } from './commands/play';
import { skipCommand } from './commands/skip';
import { stopCommand } from './commands/stop';
import { queueCommand } from './commands/queue';
import { searchCommand } from './commands/search';
import { helpCommand } from './commands/help';

export const constants = {
  commands: [
    playCommand,
    skipCommand,
    stopCommand,
    queueCommand,
    searchCommand,
    helpCommand,
  ],
};