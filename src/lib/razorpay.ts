import Razorpay from 'razorpay'
import crypto from 'crypto'

export function getRazorpayInstance() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials missing in environment variables.')
  }

  return new Razorpay({
    key_id,
    key_secret,
  })
}

/**
 * Validates Razorpay Payment Signature using HMAC SHA-256
 * Razorpay Signature = HMAC_SHA256(order_id + "|" + razorpay_payment_id, secret)
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  orderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${razorpayPaymentId}`)
    .digest('hex')

  return generatedSignature === razorpaySignature
}
