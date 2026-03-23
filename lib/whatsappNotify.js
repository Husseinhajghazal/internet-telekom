import { buildApplicationWhatsAppMessageAr } from "./applicationWhatsAppAr";

const GRAPH_VERSION = "v21.0";
/** WhatsApp text body max length (Cloud API). */
const TEXT_BODY_MAX = 4096;
/** Conservative max for a single template body variable (Meta limits vary). */
const TEMPLATE_PARAM_MAX = 1024;

const DEFAULT_NOTIFY_TO = "905524011140";

function digitsOnlyE164(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * @param {import("@prisma/client").Application} application
 */
export async function notifyApplicationSubmittedWhatsApp(application) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const to = digitsOnlyE164(
    process.env.WHATSAPP_NOTIFY_TO?.trim() || DEFAULT_NOTIFY_TO,
  );

  if (!token || !phoneNumberId) {
    console.warn(
      "[whatsapp] Notify skipped: set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to enable.",
    );
    return;
  }

  if (!to || to.length < 8) {
    console.warn("[whatsapp] Notify skipped: invalid WHATSAPP_NOTIFY_TO.");
    return;
  }

  let body = buildApplicationWhatsAppMessageAr(application);
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
  const templateLang =
    process.env.WHATSAPP_TEMPLATE_LANG?.trim() || "ar";

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;

  let payload;
  if (templateName) {
    if (body.length > TEMPLATE_PARAM_MAX) {
      body =
        body.slice(0, TEMPLATE_PARAM_MAX - 20) +
        "\n…(مختصر — راجع لوحة الإدارة)";
    }
    payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: templateLang },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: body }],
          },
        ],
      },
    };
  } else {
    if (body.length > TEXT_BODY_MAX) {
      body = body.slice(0, TEXT_BODY_MAX - 30) + "\n…(مختصر)";
    }
    payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { preview_url: false, body },
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(
      data?.error?.message || `WhatsApp API HTTP ${res.status}`,
    );
    err.details = data;
    throw err;
  }
}
