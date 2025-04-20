import { prisma } from '@penx/db'
import {
  DeliveryStatus,
  NewsletterStatus,
  SubscriberStatus,
} from '@prisma/client'

/**
 * Creates a newsletter and its associated delivery records for a post
 *
 * @param params - Parameters for creating the newsletter
 * @param params.siteId - The ID of the site
 * @param params.creationId - The ID of the creation to create newsletter for
 * @param params.title - The title of the newsletter
 * @param params.content - The content of the newsletter
 * @param params.creatorId - The ID of the user creating the newsletter
 *
 * @returns The created or existing newsletter
 *
 * @remarks
 * - If a newsletter already exists for the given post, returns the existing one
 * - Creates delivery records for all active subscribers of the site
 * - Uses a transaction to ensure data consistency
 */
export async function createNewsletterWithDelivery(params: {
  siteId: string
  creationId: string
  title: string
  content: string
  creatorId: string
}) {
  const { siteId, creationId, title, content, creatorId } = params

  // Check if newsletter already exists for this post
  const existingNewsletter = await prisma.newsletter.findFirst({
    where: { creationId },
  })

  if (existingNewsletter) {
    return existingNewsletter
  }

  return prisma.$transaction(async (tx) => {
    // Create Newsletter record
    const newsletter = await tx.newsletter.create({
      data: {
        siteId,
        creationId,
        title,
        subject: 'POST',
        content,
        status: NewsletterStatus.SENDING,
        creatorId,
      },
    })

    // Get active subscribers
    const subscribers = await tx.subscriber.findMany({
      where: {
        siteId,
        status: SubscriberStatus.ACTIVE,
      },
    })

    if (subscribers.length > 0) {
      // Create Delivery records
      await tx.delivery.createMany({
        data: subscribers.map((subscriber) => ({
          siteId,
          newsletterId: newsletter.id,
          subscriberId: subscriber.id,
          status: DeliveryStatus.PENDING,
          unSubscribeUrl: `${process.env.NEXT_PUBLIC_URL}/api/newsletter/unsubscribe/${subscriber.unsubscribeCode}`,
        })),
      })
    }

    return newsletter
  })
}
