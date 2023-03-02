import { ImapFlow } from 'imapflow'
import type { NextApiRequest, NextApiResponse } from 'next'

async function migrateMessages(
  sourceClient: ImapFlow,
  destinationClient: ImapFlow,
  destinationFolder: string,
  batchSize: number
): Promise<void> {
  const results = await sourceClient.search({ all: true })
  for (let i = 0; i < results.length; i += batchSize) {
    const batchResults = await sourceClient.fetch(
      results.slice(i, i + batchSize),
      { source: true, flags: true }
    );

    for await (const message of batchResults) {
      const { source } = message;
      const buffer = Buffer.from(source);
      await destinationClient.append(destinationFolder, buffer);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
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
    destinationServer,
    destinationPort,
    destinationUsername,
    destinationPassword,
    destinationSecure,
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

    const batchSize = 25

    const checkAndCreateMailbox = async (destinationClient: ImapFlow, sourceClient: ImapFlow) => {
      let list = await sourceClient.list();
      for (const mailbox of list) {
        try {
          await destinationClient.mailboxOpen(mailbox.path);
        } catch {
          await destinationClient.mailboxCreate(mailbox.path);
        } finally {
          await destinationClient.mailboxClose();
        }
      }
    };


    const checkAndMoveMail = async (destinationClient: ImapFlow, sourceClient: ImapFlow, batchSize: number) => {
      let list = await sourceClient.list();
      await Promise.all(
        list.map(async (mailbox) => {
          try {
            let sourceLock = await sourceClient.getMailboxLock(mailbox.path);
            let destinationLock = await destinationClient.getMailboxLock(mailbox.path);
            await migrateMessages(sourceClient, destinationClient, mailbox.path, batchSize);
            await sourceLock.release();
            await destinationLock.release();
          } catch (err) {
            console.error(`Error migrating messages for ${mailbox.path}: ${err}`);
          }
        })
      );
    };

    await sourceClient.connect()
    await destinationClient.connect()
    await checkAndCreateMailbox(destinationClient, sourceClient)
    await checkAndMoveMail(destinationClient, sourceClient, batchSize)

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
