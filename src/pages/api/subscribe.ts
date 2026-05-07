import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: 'Subscribe is not configured.' },
      { status: 500 },
    );
  }

  let email: string | undefined;
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    email = typeof body.email === 'string' ? body.email : undefined;
  } else {
    const form = await request.formData();
    const value = form.get('email');
    email = typeof value === 'string' ? value : undefined;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { ok: false, error: 'Enter a valid email address.' },
      { status: 400 },
    );
  }

  const res = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (res.ok) return Response.json({ ok: true });

  // Buttondown returns 400 with code "email_already_exists" for duplicate signups —
  // present as success to avoid leaking subscriber state.
  const data = await res.json().catch(() => ({}) as Record<string, unknown>);
  const code = typeof data.code === 'string' ? data.code : '';
  if (code === 'email_already_exists') return Response.json({ ok: true });

  const detail = typeof data.detail === 'string' ? data.detail : 'Subscribe failed. Try again later.';
  return Response.json({ ok: false, error: detail }, { status: res.status });
};
