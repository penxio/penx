export enum ContributionType {
  DEVELOPMENT = 'DEVELOPMENT',
  CONTENT = 'CONTENT',
  CURATE = 'CURATE',
  OTHER = 'OTHER',
}

export enum Platform {
  GITHUB = 'GITHUB',
  X = 'X',
  DISCORD = 'DISCORD',
  FARCASTER = 'FARCASTER',
  OTHER = 'OTHER',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum PlanType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PRO = 'PRO',
  TEAM = 'TEAM',
  BELIEVER = 'BELIEVER',
}

export enum BillingCycle {
  NONE = 'NONE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  BELIEVER = 'BELIEVER',
  COUPON = 'COUPON',
}

export enum StripeType {
  NONE = 'NONE',
  OWN = 'OWN',
  PLATFORM = 'PLATFORM',
}

export enum ProviderType {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  WALLET = 'WALLET',
  FARCASTER = 'FARCASTER',
  PASSWORD = 'PASSWORD',
  EMAIL = 'EMAIL',
}

export enum ChargeMode {
  NONE = 'NONE',
  FREE = 'FREE',
  PAID_ONE_TIME = 'PAID_ONE_TIME',
  PAID_MONTHLY = 'PAID_MONTHLY',
  PAID_YEARLY = 'PAID_YEARLY',
}

export enum AreaType {
  SUBJECT = 'SUBJECT',
  COLUMN = 'COLUMN',
  BOOK = 'BOOK',
}

export enum ProductType {
  COMMON = 'COMMON',
  COLUMN = 'COLUMN',
  BOOK = 'BOOK',
  COURSE = 'COURSE',
  TIER = 'TIER',
  AMA = 'AMA',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PayoutType {
  COMMISSION = 'COMMISSION',
  SITE_INCOME = 'SITE_INCOME',
}

export enum TransferMethod {
  NONE = 'NONE',
  WALLET = 'WALLET',
  BLANK = 'BLANK',
  PAYPAL = 'PAYPAL',
}

export enum InvoiceType {
  NONE = 'NONE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PENX_SUBSCRIPTION = 'PENX_SUBSCRIPTION',
  SITE_SUBSCRIPTION = 'SITE_SUBSCRIPTION',
  CAMPAIGN = 'CAMPAIGN',
  PRODUCT = 'PRODUCT',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
}

export enum GateType {
  FREE = 'FREE',
  PAID = 'PAID',
  MEMBER_ONLY = 'MEMBER_ONLY',
}

export enum CreationStatus {
  PUBLISHED = 'PUBLISHED',
  CONTRIBUTED = 'CONTRIBUTED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export enum CommentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum CollaboratorRole {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export enum ChannelType {
  TEXT = 'TEXT',
}

export enum SubdomainType {
  None = 'None',
  Custom = 'Custom',
  EnsName = 'EnsName',
  Address = 'Address',
  UserId = 'UserId',
}

export enum NewsletterStatus {
  DRAFT = 'DRAFT',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
}

export enum SubscriberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  COMPLAINED = 'COMPLAINED',
}

export enum SystemEmailType {
  SUBSCRIPTION_CONFIRM = 'SUBSCRIPTION_CONFIRM',
  RESET_PASSWORD = 'RESET_PASSWORD',
  NOTIFICATION = 'NOTIFICATION',
}

export enum SystemEmailStatus {
  PENDING = 'PENDING',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export enum PledgeStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
