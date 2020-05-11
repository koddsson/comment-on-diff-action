import {readFileSync} from 'fs'

import {getInput, debug, setFailed} from '@actions/core'
import {GitHub} from '@actions/github'

function getGitHubEvent(): {
  repository: {owner: string; name: string}
  pull_request: {number: number}
} {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH!, 'utf8'))
}

async function run(): Promise<void> {
  try {
    const pattern = getInput('pattern')
    debug(`Got pattern: ${pattern}`)

    const token = getInput('gh-token')
    const octokit = new GitHub(token)
    const event = getGitHubEvent()
    const {data: pullRequest} = await octokit.pulls.get({
      owner: event.repository.owner,
      repo: event.repository.name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      pull_number: event.pull_request.number,
      mediaType: {
        format: 'diff'
      }
    })

    debug(JSON.stringify(pullRequest))
  } catch (error) {
    setFailed(error.message)
  }
}

run()
