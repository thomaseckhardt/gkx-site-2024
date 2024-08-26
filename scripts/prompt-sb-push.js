// prompt.js
import readline from 'readline'
import { execSync } from 'child_process'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question(
  `Are you sure you want to push your components to Storyblok?\nType YES to continue: `,
  (answer) => {
    if (answer === 'YES') {
      execSync(
        `storyblok push-components storyblok/components.289689.json --space 289689`,
        { stdio: 'inherit' },
      )
    } else {
      console.log('Script execution cancelled.')
    }
    rl.close()
  },
)
