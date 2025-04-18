import * as aws from '@aws-sdk/client-ses'
import nodemailer from 'nodemailer'
import type { Options as SESTransportOptions } from 'nodemailer/lib/ses-transport'

// Interface for email content with all possible fields
interface EmailOptions {
  subject: string
  html: string
  text: string
  from: string
  to: string[]
  cc?: string[] // Optional carbon copy addresses
  replyTo?: string[] // Optional reply-to addresses
}

// Create a singleton instance of SES client
const sesClient = new aws.SES({
  region: process.env.AWS_SES_REGION,
})

// Initialize nodemailer transport with SES configuration
const emailTransporter = nodemailer.createTransport({
  SES: {
    ses: sesClient,
    aws,
  },
} as SESTransportOptions)

/**
 * Send email using AWS SES
 * @param options - Email options including recipients and message body
 * @returns Promise with the sent message info
 */
const sendEmail = async (
  options: EmailOptions,
): Promise<nodemailer.SentMessageInfo> => {
  try {
    const mailOptions = {
      from: options.from,
      to: options.to.join(','),
      cc: options.cc?.join(','),
      replyTo: options.replyTo?.join(','),
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    return await emailTransporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export { sendEmail, type EmailOptions }
