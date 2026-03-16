import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !message)
    return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 })

  const { error } = await resend.emails.send({
    from: "Pixel by Aarya <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: subject ? `[PBA] ${subject}` : `[PBA] New message from ${name}`,
    html: `
      <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #cccccc; padding: 2rem; border: 2px solid #c8a96e;">
        <h1 style="font-size: 2rem; color: #c8a96e; letter-spacing: 0.1em; margin: 0 0 0.25rem;">
          NEW MESSAGE
        </h1>
        <p style="color: #666; font-size: 0.75rem; letter-spacing: 0.2em; margin: 0 0 2rem;">
          PIXEL BY AARYA — CONTACT FORM
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
          <tr>
            <td style="padding: 0.5rem 0; border-bottom: 1px solid #222; color: #666; font-size: 0.75rem; letter-spacing: 0.15em; width: 30%;">FROM</td>
            <td style="padding: 0.5rem 0; border-bottom: 1px solid #222;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; border-bottom: 1px solid #222; color: #666; font-size: 0.75rem; letter-spacing: 0.15em;">EMAIL</td>
            <td style="padding: 0.5rem 0; border-bottom: 1px solid #222;">
              <a href="mailto:${email}" style="color: #c8a96e;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; border-bottom: 1px solid #222; color: #666; font-size: 0.75rem; letter-spacing: 0.15em;">SUBJECT</td>
            <td style="padding: 0.5rem 0; border-bottom: 1px solid #222;">${subject || "—"}</td>
          </tr>
        </table>

        <div style="background: #111; border-left: 3px solid #c8a96e; padding: 1rem 1.25rem; margin-bottom: 2rem;">
          <p style="color: #666; font-size: 0.7rem; letter-spacing: 0.15em; margin: 0 0 0.5rem;">MESSAGE</p>
          <p style="margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="color: #444; font-size: 0.7rem; text-align: center; margin: 0;">
          Reply directly to this email to respond to ${name}
        </p>
      </div>
    `,
  })

  if (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}