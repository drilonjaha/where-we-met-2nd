import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeServer() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST() {
  const stripe = getStripeServer();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Where We Met — HD Poster",
            description:
              "High-resolution A4 poster (2480×3508px) of your special place",
          },
          unit_amount: 499, // $4.99
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://wherewemet.web.app"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://wherewemet.web.app"}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}
