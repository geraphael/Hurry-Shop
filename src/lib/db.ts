import { supabase } from './supabaseClient'
import type { Category, Listing, Offer, Conversation, Message, UserProfile, ListingStatus, Report } from '../types'

export async function fetchApprovedListings(search?: string, categoryId?: number) {
  let query = supabase
    .from('listings')
    .select('*, seller:profiles(id,full_name,campus,verification_status,avatar_url), category:categories(id,name,slug)')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,campus_location.ilike.%${search}%`)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
  if (error) {
    throw error
  }

  return (data ?? []) as Listing[]
}

export async function fetchFeaturedListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(id,full_name,campus,verification_status,avatar_url), category:categories(id,name,slug)')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    throw error
  }

  return (data ?? []) as Listing[]
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(id,full_name,campus,verification_status,avatar_url), category:categories(id,name,slug)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data as Listing
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) {
    throw error
  }
  return (data ?? []) as Category[]
}

export async function fetchAdminStats() {
  const [usersCount, verifiedSellersCount, pendingSellersCount, activeListingsCount, pendingListingsCount, reportsCount] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).not('role', 'eq', 'admin'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'VERIFIED'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'PENDING'),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'APPROVED'),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'OPEN'),
  ])

  return {
    users: Number(usersCount.count ?? 0),
    verifiedSellers: Number(verifiedSellersCount.count ?? 0),
    pendingSellers: Number(pendingSellersCount.count ?? 0),
    activeListings: Number(activeListingsCount.count ?? 0),
    pendingListings: Number(pendingListingsCount.count ?? 0),
    reports: Number(reportsCount.count ?? 0),
  }
}

export async function fetchPendingSellerRequests() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,full_name,email,campus,verification_status,avatar_url,created_at')
    .eq('verification_status', 'PENDING')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return (data ?? []) as UserProfile[]
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) {
    throw error
  }
  return data as UserProfile
}

export async function fetchUserListings(userId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, category:categories(id,name), seller:profiles(id,full_name,campus,verification_status)')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return (data ?? []) as Listing[]
}

export async function createSellerRequest(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ verification_status: 'PENDING' })
    .eq('id', userId)

  if (error) {
    throw error
  }
  return (data ?? []) as UserProfile[]
}

export async function submitListing(values: {
  title: string
  description: string
  price: number
  category_id: number
  condition: string
  campus_location: string
  listing_type: string
  cover_url?: string
  image_urls?: string[]
  seller_id: string
}) {
  const { data, error } = await supabase.from('listings').insert([
    {
      ...values,
      status: 'PENDING',
    },
  ])

  if (error) {
    throw error
  }

  return (data ?? [])[0] as Listing
}

export async function uploadListingImage(file: File) {
  const id = crypto.randomUUID()
  const path = `listing-images/${id}-${file.name}`
  const { error } = await supabase.storage.from('listing-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    throw error
  }
  const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
  return data.publicUrl
}

export async function fetchPendingListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(id,full_name,campus,verification_status), category:categories(id,name)')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Listing[]
}

export async function approveListing(listingId: string) {
  const { data, error } = await supabase.from('listings').update({ status: 'APPROVED' }).eq('id', listingId)
  if (error) {
    throw error
  }
  return data
}

export async function rejectListing(listingId: string, reason: string) {
  const { data, error } = await supabase
    .from('listings')
    .update({ status: 'REJECTED', rejection_reason: reason })
    .eq('id', listingId)

  if (error) {
    throw error
  }
  return data
}

export async function createOffer(values: {
  listing_id: string
  buyer_id: string
  amount: number
  message?: string
}) {
  const { data, error } = await supabase.from('offers').insert([
    {
      ...values,
      status: 'PENDING',
    },
  ])

  if (error) {
    throw error
  }

  return (data ?? [])[0] as Offer
}

export async function fetchOffersByBuyer(buyerId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*, listing:listing_id(*), buyer:profiles(id,full_name)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return (data ?? []) as Offer[]
}

export async function fetchOpenReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*, reporter:reporter_id(id,full_name,email), listing:listings(id,title), reported_user:reported_user_id(id,full_name,email)')
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Report[]
}

export async function reportListing(values: {
  reporter_id: string
  listing_id: string
  reported_user_id?: string
  reason: string
  details?: string
}) {
  const { data, error } = await supabase.from('reports').insert([
    {
      ...values,
      status: 'OPEN',
    },
  ])

  if (error) {
    throw error
  }

  return (data ?? [])[0] as Report
}

export async function fetchUserConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, listing:listing_id(title,cover_url), sender:sender_id(id,full_name), receiver:receiver_id(id,full_name), messages:messages(body,created_at)')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) {
    throw error
  }
  return (data ?? []) as Conversation[]
}

export async function sendMessage(values: {
  listing_id: string
  sender_id: string
  receiver_id: string
  body: string
}) {
  const { data: existing, error: listError } = await supabase
    .from('conversations')
    .select('*')
    .or(
      `and(sender_id.eq.${values.sender_id},receiver_id.eq.${values.receiver_id},listing_id.eq.${values.listing_id}),and(sender_id.eq.${values.receiver_id},receiver_id.eq.${values.sender_id},listing_id.eq.${values.listing_id})`,
    )
    .limit(1)
    .single()

  if (listError && listError.code !== 'PGRST116') {
    throw listError
  }

  let conversationId = existing?.id
  if (!conversationId) {
    const { data, error } = await supabase.from('conversations').insert([
      {
        listing_id: values.listing_id,
        sender_id: values.sender_id,
        receiver_id: values.receiver_id,
      },
    ])
    if (error) {
      throw error
    }
    const inserted = (data ?? []) as Array<{ id: string }>
    conversationId = inserted[0]?.id
  }

  if (!conversationId) {
    throw new Error('Unable to create conversation')
  }

  const { data: messageData, error: messageError } = await supabase.from('messages').insert([
    {
      conversation_id: conversationId,
      sender_id: values.sender_id,
      body: values.body,
      read: false,
    },
  ])

  if (messageError) {
    throw messageError
  }

  await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)
  return (messageData ?? [])[0] as Message
}
