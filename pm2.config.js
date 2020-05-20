/* replace <name> with dev | test | staging | production */
module.exports = {
  apps: [
    {
      name: '<name>',
      script: 'ts-node',
      args: '--project nodetsconfig.json ./server/server.ts',

      instances: 1,
      max_memory_restart: '1G',
      autorestart: true,
      restart_delay: 100,
      error_file: '/home/zz/app_logs/<name>/error.log',
      out_file: '/home/zz/app_logs/<name>/out.log',
      watch: true,
      ignore_watch: [
        '.circle',
        '.idea',
        '.storybook',
        '.vscode',
        '.zeplin',
        'build',
        'cypress',
        'node_modules',
        'public',
        'scenarios',
        'src',
        '.gitignore',
        '.prettierignore',
        'cypress.json',
        'nodemon.json',
        'package.json',
        'README.md',
        'tsconfig.json',
        'yarn.lock',
      ],
    },
  ],
};
