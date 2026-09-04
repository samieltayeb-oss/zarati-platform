import { Resend } from 'resend'
import type { WaitlistEntry, WaitlistUserType } from '@/lib/actions/waitlist'

const ROLE_LABELS: Record<WaitlistUserType, { en: string; ar: string }> = {
  farmer:     { en: 'Farmer',          ar: 'مزارع'      },
  trader:     { en: 'Trader',          ar: 'تاجر'       },
  ngo:        { en: 'NGO',             ar: 'منظمة'      },
  government: { en: 'Government Body', ar: 'جهة حكومية' },
  investor:   { en: 'Investor',        ar: 'مستثمر'     },
}

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[Zarati Email] RESEND_API_KEY not set — skipping email.')
    return null
  }
  return new Resend(key)
}

// ── Templates ──────────────────────────────────────────────────────────────

function stepRow(num: string, title: string, body: string, isAr: boolean): string {
  const numTd = `<td style="width:36px;vertical-align:top;${isAr ? 'padding-left:12px' : 'padding-right:12px'};"><div style="background:#0D3B1E;color:#FFFFFF;font-size:12px;font-weight:700;width:28px;height:28px;border-radius:50%;text-align:center;line-height:28px;">${num}</div></td>`
  const textTd = `<td style="vertical-align:top;"><p style="font-size:14px;font-weight:700;color:#212121;margin:0 0 3px;">${title}</p><p style="font-size:13px;color:#616161;margin:0;line-height:1.65;">${body}</p></td>`
  return `<table role="presentation" style="width:100%;margin-bottom:14px;border-collapse:collapse;"><tr>${numTd}${textTd}</tr></table>`
}

function welcomeHtml(name: string, userType: WaitlistUserType, isAr: boolean): string {
  const role = ROLE_LABELS[userType]
  const base = (process.env.SITE_URL ?? 'https://zarati-platform.vercel.app').replace(/\/$/, '')

  if (isAr) {
    const steps =
      stepRow('١', 'إشعار الإطلاق',    'سيصلك بريد إلكتروني فور انطلاق زرعتي. لا رسائل غير ضرورية — فقط اللحظة التي تنتظرها.', true) +
      stepRow('٢', 'وصول مبكر',        'أعضاء القائمة يحظون بأولوية الدخول قبل الإطلاق العام للجميع.', true) +
      stepRow('٣', 'رأيك يبني المنصة', 'اختيارك لدورك يساعدنا في بناء الأدوات الصحيحة — للمزارع والتاجر والجميع.', true)

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>مرحباً بك في زرعتي</title>
  <style>
    @media only screen and (max-width:600px){
      .wr{padding:0!important}
      .hd,.ft{border-radius:0!important;padding:20px!important}
      .bd{padding:24px 20px 20px!important}
      .ht{font-size:22px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#EEF3EE;-webkit-font-smoothing:antialiased;">
  <div class="wr" style="padding:28px 16px;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
    <table role="presentation" style="max-width:560px;margin:0 auto;width:100%;border-collapse:collapse;">
      <tr>
        <td class="hd" style="background:#0D3B1E;border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
          <table role="presentation" style="margin:0 auto 10px;" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#FFFFFF;border-radius:8px;padding:6px 10px;"><img src="${base}/logo.png" alt="Zarati Logo" width="120" style="height:auto;display:block;"/></td></tr></table>
          <p style="color:#FFFFFF;font-size:18px;font-weight:800;margin:0 0 4px;">زرعتي</p>
          <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0;letter-spacing:0.8px;">منصة السودان الزراعية الذكية</p>
        </td>
      </tr>
      <tr>
        <td class="bd" style="background:#FFFFFF;padding:36px 36px 28px;">
          <h1 class="ht" style="color:#0D3B1E;font-size:26px;font-weight:800;margin:0 0 14px;line-height:1.35;">
            أهلاً وسهلاً، ${escapeHtml(name)}! 🌱
          </h1>
          <p style="font-size:15px;color:#424242;line-height:1.8;margin:0 0 8px;">
            انضممت إلى قائمة انتظار <strong style="color:#0D3B1E;">زرعتي</strong> بصفتك
            <strong style="color:#0D3B1E;">${role.ar}</strong> — يسعدنا وجودك معنا.
          </p>
          <p style="font-size:15px;color:#616161;line-height:1.8;margin:0 0 28px;">
            نبني منصة السودان الزراعية الذكية — تربط المزارعين بالأسواق بأسعار آنية وأدوات ذكاء اصطناعي تساعد على اتخاذ القرار في الوقت الصحيح. سنُعلمك في اللحظة التي ننطلق فيها.
          </p>
          <div style="background:#EFF7EF;border-radius:12px;padding:20px 20px 6px;margin-bottom:28px;">
            <p style="font-size:11px;font-weight:700;color:#0D3B1E;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">الخطوات القادمة</p>
            ${steps}
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="text-align:center;">
                <a href="${base}/ar" style="display:inline-block;background:#0D3B1E;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;">
                  &#x2190; اكتشف زرعتي
                </a>
              </td>
            </tr>
          </table>
          <p style="font-size:12px;color:#9E9E9E;margin:0;text-align:center;">
            هل لديك سؤال؟ راسلنا على
            <a href="mailto:sam@nexorayyc.io" style="color:#0D3B1E;text-decoration:none;font-weight:600;">sam@nexorayyc.io</a>
          </p>
        </td>
      </tr>
      <tr>
        <td class="ft" style="background:#F5FAF5;border-radius:0 0 16px 16px;padding:18px 36px;text-align:center;border-top:1px solid #DFF0DF;">
          <p style="font-size:12px;color:#9E9E9E;margin:0 0 6px;">&#169; 2026 Zarati &middot; زرعتي &mdash; السودان</p>
          <p style="font-size:11px;color:#BDBDBD;margin:0;">
            <a href="${base}/ar/privacy" style="color:#BDBDBD;text-decoration:underline;">الخصوصية</a>
            &nbsp;&middot;&nbsp;
            <a href="${base}/ar/contact" style="color:#BDBDBD;text-decoration:underline;">تواصل معنا</a>
            &nbsp;&middot;&nbsp;
            <a href="${base}/ar" style="color:#BDBDBD;text-decoration:underline;">الموقع</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`
  }

  // ── English ──────────────────────────────────────────────────────────────
  const steps =
    stepRow('1', 'Launch notification', "You'll get an email the moment Zarati goes live. No newsletters, no noise — just the one announcement that matters.", false) +
    stepRow('2', 'Early access',        'Waitlist members get priority access before the public launch.', false) +
    stepRow('3', 'Help shape it',       'Your role tells us what to build first — the right tools for your side of the market.', false)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Welcome to Zarati</title>
  <style>
    @media only screen and (max-width:600px){
      .wr{padding:0!important}
      .hd,.ft{border-radius:0!important;padding:20px!important}
      .bd{padding:24px 20px 20px!important}
      .ht{font-size:22px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#EEF3EE;-webkit-font-smoothing:antialiased;">
  <div class="wr" style="padding:28px 16px;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
    <table role="presentation" style="max-width:560px;margin:0 auto;width:100%;border-collapse:collapse;">
      <tr>
        <td class="hd" style="background:#0D3B1E;border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
          <table role="presentation" style="margin:0 auto 10px;" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#FFFFFF;border-radius:8px;padding:6px 10px;"><img src="${base}/logo.png" alt="Zarati Logo" width="120" style="height:auto;display:block;"/></td></tr></table>
          <p style="color:#FFFFFF;font-size:18px;font-weight:800;margin:0 0 4px;">Zarati</p>
          <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0;letter-spacing:0.8px;">Sudan's Smart Agriculture Platform</p>
        </td>
      </tr>
      <tr>
        <td class="bd" style="background:#FFFFFF;padding:36px 36px 28px;">
          <h1 class="ht" style="color:#0D3B1E;font-size:26px;font-weight:800;margin:0 0 14px;line-height:1.35;">
            You're on the list, ${escapeHtml(name)}! 🌱
          </h1>
          <p style="font-size:15px;color:#424242;line-height:1.8;margin:0 0 8px;">
            You've joined the Zarati waitlist as a <strong style="color:#0D3B1E;">${role.en}</strong>. Really glad to have you.
          </p>
          <p style="font-size:15px;color:#616161;line-height:1.8;margin:0 0 28px;">
            We're building Sudan's smart agriculture platform — connecting farmers and traders with real-time market prices, weather intelligence, and AI tools that help you make better decisions. You'll be the first to know when we go live.
          </p>
          <div style="background:#EFF7EF;border-radius:12px;padding:20px 20px 6px;margin-bottom:28px;">
            <p style="font-size:11px;font-weight:700;color:#0D3B1E;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">What happens next</p>
            ${steps}
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="text-align:center;">
                <a href="${base}/en" style="display:inline-block;background:#0D3B1E;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;">
                  Explore Zarati &rarr;
                </a>
              </td>
            </tr>
          </table>
          <p style="font-size:12px;color:#9E9E9E;margin:0;text-align:center;">
            Questions? Reach us at
            <a href="mailto:sam@nexorayyc.io" style="color:#0D3B1E;text-decoration:none;font-weight:600;">sam@nexorayyc.io</a>
          </p>
        </td>
      </tr>
      <tr>
        <td class="ft" style="background:#F5FAF5;border-radius:0 0 16px 16px;padding:18px 36px;text-align:center;border-top:1px solid #DFF0DF;">
          <p style="font-size:12px;color:#9E9E9E;margin:0 0 6px;">&#169; 2026 Zarati &middot; زرعتي &mdash; Sudan</p>
          <p style="font-size:11px;color:#BDBDBD;margin:0;">
            <a href="${base}/en/privacy" style="color:#BDBDBD;text-decoration:underline;">Privacy</a>
            &nbsp;&middot;&nbsp;
            <a href="${base}/en/contact" style="color:#BDBDBD;text-decoration:underline;">Contact</a>
            &nbsp;&middot;&nbsp;
            <a href="${base}/en" style="color:#BDBDBD;text-decoration:underline;">Website</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`
}

function adminHtml(entry: WaitlistEntry, timestamp: string): string {
  const role = ROLE_LABELS[entry.userType]
  const rows = [
    ['Name',      escapeHtml(entry.name)],
    ['Email',     escapeHtml(entry.email)],
    ['Role',      `${role.en} / ${role.ar}`],
    ['Language',  entry.locale.toUpperCase()],
    ['Signed up', timestamp],
  ]
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#757575;font-weight:600;white-space:nowrap;border-bottom:1px solid #EEEEEE;">${label}</td>
      <td style="padding:10px 16px;font-size:13px;color:#212121;border-bottom:1px solid #EEEEEE;">${value}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <h2 style="color:#0D3B1E;font-size:18px;margin:0 0 4px;">New Waitlist Signup</h2>
    <p style="color:#757575;font-size:13px;margin:0 0 24px;">A new user has joined the Zarati waitlist.</p>
    <div style="background:#FFFFFF;border-radius:12px;border:1px solid #EEEEEE;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
    </div>
    <p style="font-size:11px;color:#BDBDBD;margin-top:24px;">Zarati Admin Notification</p>
  </div>
</body>
</html>`
}

// Prevent XSS in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Public API ─────────────────────────────────────────────────────────────

const FROM = () => process.env.RESEND_FROM ?? 'Zarati <sam@nexorayyc.io>'

export async function sendWelcomeEmail(entry: WaitlistEntry): Promise<void> {
  const resend = getClient()
  if (!resend) return

  const isAr = entry.locale === 'ar'
  const subject = isAr
    ? `مرحباً بك في زرعتي — ${entry.name}`
    : `Welcome to Zarati — ${entry.name}`

  try {
    await resend.emails.send({
      from: FROM(),
      to: [entry.email.toLowerCase()],
      subject,
      html: welcomeHtml(entry.name, entry.userType, isAr),
    })
  } catch (err) {
    console.error('[Zarati Email] Welcome email failed:', err)
  }
}

export async function sendAdminNotification(entry: WaitlistEntry): Promise<void> {
  const resend = getClient()
  if (!resend) return

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.warn('[Zarati Email] ADMIN_EMAIL not set — skipping admin notification.')
    return
  }

  try {
    await resend.emails.send({
      from: FROM(),
      to: [adminEmail],
      subject: `[Zarati] New signup: ${entry.name} (${ROLE_LABELS[entry.userType].en})`,
      html: adminHtml(entry, new Date().toISOString()),
    })
  } catch (err) {
    console.error('[Zarati Email] Admin notification failed:', err)
  }
}
