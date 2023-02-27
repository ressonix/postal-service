import { ImapFlow } from 'imapflow';
import type { NextApiRequest, NextApiResponse } from 'next';

async function migrateMessages(sourceClient: ImapFlow, destinationClient: ImapFlow, batchSize: number): Promise<void> {
    const results = await sourceClient.search({ all: true });
    let messagesCount = results.length;
    let messagesProcessed = 0;

    while (messagesProcessed < messagesCount) {
        const batchResults = sourceClient.fetch(
            results.slice(messagesProcessed, messagesProcessed + batchSize),
            { source: true, flags: true }
        );

        for await (const message of batchResults) {
            let buffer = Buffer.from(message.source);
            await destinationClient.append('INBOX', buffer);
        }

        messagesProcessed += batchSize;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        destinationSecure
    } = req.body;

    let sourceClient: ImapFlow | null = null;
    let destinationClient: ImapFlow | null = null;

    try {
        sourceClient = new ImapFlow({
            host: sourceServer,
            port: sourcePort,
            secure: sourceSecure,
            auth: {
                user: sourceUsername,
                pass: sourcePassword
            }
        });

        destinationClient = new ImapFlow({
            host: destinationServer,
            port: destinationPort,
            secure: destinationSecure,
            auth: {
                user: destinationUsername,
                pass: destinationPassword
            }
        });

        await sourceClient.connect();
        await sourceClient.getMailboxLock('INBOX');

        await destinationClient.connect();
        await destinationClient.getMailboxLock('INBOX');

        const batchSize = 25;
        await migrateMessages(sourceClient, destinationClient, batchSize)

        res.status(200).json({ message: 'Emails migrated successfully.' });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    } finally {
        if (sourceClient) {
            sourceClient.logout();
        }
        if (destinationClient) {
            destinationClient.logout();
        }
    }
}