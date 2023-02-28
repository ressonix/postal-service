import { ImapFlow } from 'imapflow'
import type { NextApiRequest, NextApiResponse } from 'next'

async function migrateMessages(
  sourceClient: ImapFlow,
  destinationClient: ImapFlow,
  destinationFolder: string,
  batchSize: number
): Promise<void> {
  const results = await sourceClient.search({ all: true })
  let messagesCount = results.length
  let messagesProcessed = 0

  while (messagesProcessed < messagesCount) {
    const batchResults = sourceClient.fetch(
      results.slice(messagesProcessed, messagesProcessed + batchSize),
      { source: true, flags: true }
    )

    for await (const message of batchResults) {
      let buffer = Buffer.from(message.source)
      await destinationClient.append(destinationFolder, buffer)
    }

    messagesProcessed += batchSize
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    sourceServer,
    sourcePort,
    sourceUsername,
    sourcePassword,
    sourceSecure,
    sourceFolder,
    destinationServer,
    destinationPort,
    destinationUsername,
    destinationPassword,
    destinationSecure,
    destinationFolder
  } = req.body

  let sourceClient: ImapFlow | null = null
  let destinationClient: ImapFlow | null = null

  try {
    sourceClient = new ImapFlow({
      host: sourceServer,
      port: sourcePort,
      secure: sourceSecure,
      auth: {
        user: sourceUsername,
        pass: sourcePassword
      }
    })

    destinationClient = new ImapFlow({
      host: destinationServer,
      port: destinationPort,
      secure: destinationSecure,
      auth: {
        user: destinationUsername,
        pass: destinationPassword
      }
    })

    const checkAndCreateMailbox = async (destinationClient: ImapFlow) => {
      try {
        await destinationClient.getMailboxLock(destinationFolder)
      } catch {
        await destinationClient.mailboxCreate(destinationFolder)
        await destinationClient.getMailboxLock(destinationFolder)
      }
    }

    await sourceClient.connect()
    await sourceClient.getMailboxLock(sourceFolder)

    await destinationClient.connect()
    await checkAndCreateMailbox(destinationClient)

    const batchSize = 25
    await migrateMessages(sourceClient, destinationClient, destinationFolder, batchSize)

    res.status(200).json({ message: 'Emails migrated successfully.' })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ message: `An error occurred: ${error.message}` })
  } finally {
    if (sourceClient) {
      await sourceClient.logout()
    }
    if (destinationClient) {
      await destinationClient.logout()
    }
  }
}
