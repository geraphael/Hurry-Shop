export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED'
export type ListingType = 'FIXED_PRICE' | 'NEGOTIABLE' | 'BIDDING'
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Used'
export type SellerVerificationStatus = 'NOT_VERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'
export type UserRole = 'user' | 'seller' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  campus: string
  bio: string
  role: UserRole
  verification_status: SellerVerificationStatus
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  created_at: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  campus_location: string
  condition: Condition
  listing_type: ListingType
  status: ListingStatus
  cover_url?: string | null
  image_urls?: string[] | null
  seller: UserProfile
  category: Category
  created_at: string
  updated_at: string
  views: number
}

export interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  amount: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  message?: string | null
  created_at: string
  buyer?: UserProfile
  listing?: Listing
}

export interface Conversation {
  id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  listing: Listing
  sender?: UserProfile
  receiver?: UserProfile
  messages?: Array<{ body: string; created_at: string }>
  last_message: string | null
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  read: boolean
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  listing_id?: string | null
  reported_user_id?: string | null
  reason: string
  details?: string | null
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED'
  created_at: string
  reporter?: {
    id: string
    full_name: string
    email: string
  }
  reported_user?: {
    id: string
    full_name: string
    email: string
  }
  listing?: {
    id: string
    title: string
  }
}
