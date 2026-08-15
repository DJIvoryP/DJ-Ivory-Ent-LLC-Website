// Supabase Edge Function: send-booking-email
//
// Called directly by the booking form (client-side, via
// supabaseClient.functions.invoke) right after a new row is inserted into
// booking_requests, and emails the submission through Resend.
//
// Setup:
// 1. Supabase Dashboard -> Edge Functions -> Create function -> name it
//    "send-booking-email" -> paste this file's contents -> Deploy.
// 2. Supabase Dashboard -> Edge Functions -> Secrets -> add:
//      RESEND_API_KEY = <your Resend API key>

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "DJ Ivory Ent LLC <bookings@djivoryentllc.com>";
const TO_EMAIL = "ilewisII@djivoryentllc.com";
const CC_EMAIL = "djivoryentllc@gmail.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const payload = await req.json();
    const record = payload.record ?? {};

    const fields: [string, string | null][] = [
      ["Name", record.full_name],
      ["Contact", record.contact],
      ["Event Type", record.event_type],
      ["Event Date", record.event_date],
      ["Venue", record.venue],
      ["Guest Count", record.guest_count],
      ["Requested Host", record.requested_host],
      ["Budget Range", record.budget_range],
      ["Message", record.message],
    ];

    const rows = fields
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top;">${label}</td><td style="padding:6px 12px;">${value || "—"}</td></tr>`
      )
      .join("");

    const html = `
      <h2>New booking request</h2>
      <table style="border-collapse:collapse;">${rows}</table>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        cc: [CC_EMAIL],
        subject: `New booking request from ${record.full_name ?? "website"}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
