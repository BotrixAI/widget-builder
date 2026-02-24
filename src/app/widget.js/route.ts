import { NextResponse } from "next/server";
import { platformIconSvgs } from "@/lib/platformIconSvgs";

const brandingLogo =
  process.env.NEXT_PUBLIC_BRANDING_LOGO ||
  "https://dummyimage.com/64x64/0f172a/ffffff&text=B";
const brandingLink =
  process.env.NEXT_PUBLIC_BRANDING_LINK || "https://botrix.ai";
const platformIconUrls = {
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_ICON_URL ||
    "https://dummyimage.com/64x64/25d366/ffffff&text=W",
  telegram:
    process.env.NEXT_PUBLIC_TELEGRAM_ICON_URL ||
    "https://dummyimage.com/64x64/2aabee/ffffff&text=T",
  messenger:
    process.env.NEXT_PUBLIC_MESSENGER_ICON_URL ||
    "https://dummyimage.com/64x64/0084ff/ffffff&text=M",
  email:
    process.env.NEXT_PUBLIC_EMAIL_ICON_URL ||
    "https://dummyimage.com/64x64/0f172a/ffffff&text=E",
};

const widgetScript = `
(() => {
  const scriptTag = document.currentScript || document.querySelector('script[data-widget-id]');
  if (!scriptTag) return;

  const widgetId = scriptTag.getAttribute('data-widget-id');
  if (!widgetId) return;

  const baseUrl = new URL(scriptTag.src).origin;

  const createElement = (tag, attrs = {}) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') {
        el.className = value;
      } else if (key === 'style') {
        Object.assign(el.style, value);
      } else {
        el.setAttribute(key, value);
      }
    });
    return el;
  };

  const buildRedirectUrl = (config, message) => {
    const text = encodeURIComponent(message);
    switch (config.platform) {
      case 'whatsapp':
        return \`https://wa.me/\${config.contact.phone}?text=\${text}\`;
      case 'telegram':
        return \`https://t.me/\${config.contact.username}?text=\${text}\`;
      case 'messenger':
        return \`https://m.me/\${config.contact.pageId}?ref=\${text}\`;
      case 'email':
        return \`mailto:\${config.contact.email}?subject=\${encodeURIComponent(config.contact.subject || 'Hello')}&body=\${text}\`;
      default:
        return '#';
    }
  };

  const normalizeMessage = (defaultMessage, userMessage) => {
    return [defaultMessage, userMessage].filter(Boolean).join(' ').trim();
  };

  const platformIconSvgs = ${JSON.stringify(platformIconSvgs)};

  const createInlineIcon = (platform, color) => {
    const wrapper = document.createElement('span');
    wrapper.innerHTML = platformIconSvgs[platform] || platformIconSvgs.email;
    const svg = wrapper.querySelector('svg');
    if (!svg) {
      return document.createElement('span');
    }
    svg.setAttribute('aria-label', platform + ' icon');
    svg.setAttribute('role', 'img');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.color = color || '#fff';
    return svg;
  };

  const mountWidget = (config) => {
    const host = createElement('div', { class: 'widget-host' });
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    const style = createElement('style');
    style.textContent = \`
      :host, * { box-sizing: border-box; font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif; }
      .bubble { position: fixed; z-index: 2147483000; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; outline: none; padding: 0; box-shadow: none; }
      .bubble:focus { outline: none; box-shadow: none; }
      .bubble:focus-visible { outline: none; box-shadow: none; }
      .panel { position: fixed; z-index: 2147483001; display: none; flex-direction: column; overflow: hidden; border-radius: 16px; background: #fff; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18); max-width: calc(100vw - 32px); max-height: calc(100vh - 120px); }
      .panel.open { display: flex; }
      .header { padding: 16px; display: flex; align-items: center; gap: 12px; color: #fff; }
      .header img { width: 36px; height: 36px; border-radius: 999px; object-fit: cover; background: #fff; }
      .header .icon { width: 36px; height: 36px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); }
      .header svg { width: 22px; height: 22px; }
      .heading { font-weight: 600; margin: 0; font-size: 15px; }
      .status { margin: 2px 0 0; font-size: 12.5px; opacity: 0.85; }
      .body { padding: 16px; font-size: 15px; color: #0f172a; background: #f8fafc; flex: 1; background-size: cover; background-position: center; background-repeat: no-repeat; }
      .bubble-text { padding: 10px 12px; background: #fff; border-radius: 12px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); max-width: 90%; display: flex; flex-direction: column; gap: 6px; }
      .bubble-time { font-size: 11px; color: #94a3b8; text-align: right; }
      .typing { display: inline-flex; align-items: center; gap: 6px; height: 16px; }
      .typing span { width: 6px; height: 6px; border-radius: 999px; background: #cbd5f5; opacity: 0.5; animation: typing 1.2s infinite; }
      .typing span:nth-child(2) { animation-delay: 0.2s; }
      .typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-3px); opacity: 1; } }
      .footer { padding: 2px 12px 0; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; background: #fff; }
      .branding { display: flex; align-items: center; justify-content: center; gap: 1px; padding: 10px 10px 12px; font-size: 12px; color: #94a3b8; background: #fff; border-top: 1px solid #e2e8f0; }
      .branding a { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
      .branding img { width: 64px; height: 24px; object-fit: contain; }
      .bubble img { width: 60%; height: 60%; object-fit: contain; }
      .header .icon img { width: 22px; height: 22px; object-fit: contain; }
      .input { flex: 1; min-width: 0; padding: 10px 12px; border: 1px solid #cbd5f5; border-radius: 50px; font-size: 14.5px; outline: none; margin:4px 0px;}
      .send { border: none; color: #fff; padding: 0 16px; border-radius: 50px; cursor: pointer; font-weight: 600; font-size: 14px; margin:4px 0px; flex-shrink: 0;}
    \`;
    shadow.appendChild(style);

    const bubble = createElement('button', { class: 'bubble', type: 'button' });
    const icon = createElement('span');
    bubble.appendChild(icon);

    const panel = createElement('div', { class: 'panel' });
    const header = createElement('div', { class: 'header' });
    const headerImage = createElement('img', { alt: 'Profile' });
    const headerIcon = createElement('div', { class: 'icon' });
    const headerText = createElement('div');
    const heading = createElement('p', { class: 'heading' });
    const status = createElement('p', { class: 'status' });
    headerText.appendChild(heading);
    headerText.appendChild(status);
    header.appendChild(headerImage);
    header.appendChild(headerIcon);
    header.appendChild(headerText);

    const body = createElement('div', { class: 'body' });
    const greeting = createElement('div', { class: 'bubble-text' });
    const typing = createElement('div', { class: 'typing' });
    typing.appendChild(createElement('span'));
    typing.appendChild(createElement('span'));
    typing.appendChild(createElement('span'));
    const greetingText = createElement('div');
    const greetingTime = createElement('div', { class: 'bubble-time' });
    greeting.appendChild(typing);
    greeting.appendChild(greetingText);
    greeting.appendChild(greetingTime);
    body.appendChild(greeting);

    const footer = createElement('div', { class: 'footer' });
    const input = createElement('input', { class: 'input', type: 'text' });
    const send = createElement('button', { class: 'send', type: 'button' });
    send.textContent = 'Send';
    footer.appendChild(input);
    footer.appendChild(send);

    const branding = createElement('div', { class: 'branding' });
    const brandingText = createElement('span');
    const brandingLink = createElement('a', { target: '_blank', rel: 'noopener' });
    const brandingLogo = createElement('img', { alt: 'Powered by' });
    brandingLink.appendChild(brandingLogo);
    branding.appendChild(brandingText);
    branding.appendChild(brandingLink);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    panel.appendChild(branding);
    shadow.appendChild(bubble);
    shadow.appendChild(panel);

    const setPositions = () => {
      const bubblePos = config.bubble.position;
      const offsetX = config.bubble.offsetX;
      const offsetY = config.bubble.offsetY;
      const right = bubblePos === 'bottom-left' ? 'auto' : \`\${offsetX}px\`;
      const left = bubblePos === 'bottom-left' ? \`\${offsetX}px\` : 'auto';
      bubble.style.right = right;
      bubble.style.left = left;
      bubble.style.bottom = \`\${offsetY}px\`;
      panel.style.right = right;
      panel.style.left = left;
      panel.style.bottom = \`\${offsetY + config.bubble.size.height + 14}px\`;
    };

    let typingTimeout = null;

    const playTyping = () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      typing.style.display = 'inline-flex';
      greetingText.textContent = '';
      greetingTime.textContent = '';
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      typingTimeout = setTimeout(() => {
        typing.style.display = 'none';
        greetingText.textContent = config.widget.greetingText;
        greetingTime.textContent = hours + ':' + minutes;
      }, 700);
    };

    const render = () => {
      bubble.style.width = \`\${config.bubble.size.width}px\`;
      bubble.style.height = \`\${config.bubble.size.height}px\`;
      bubble.style.borderRadius = config.bubble.shape === 'circle' ? '999px' : '18px';
      bubble.style.background = config.bubble.backgroundColor;
      bubble.style.boxShadow = config.bubble.shadow ? '0 12px 24px rgba(15, 23, 42, 0.18)' : 'none';
      icon.innerHTML = '';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      const bubbleImg = createInlineIcon(
        config.platform,
        config.bubble.iconColor
      );
      bubbleImg.style.width = \`\${Number(config.bubble.iconSize)}px\`;
      bubbleImg.style.height = \`\${Number(config.bubble.iconSize)}px\`;
      icon.appendChild(bubbleImg);
      icon.style.fontSize = \`\${config.bubble.iconSize}px\`;
      icon.style.color = config.bubble.iconColor;

      panel.style.width = \`\${config.widget.width}px\`;
      panel.style.height = \`\${config.widget.height}px\`;
      header.style.background = config.widget.headerBgColor;
      body.style.backgroundImage = \`url(\${baseUrl}/chat-bg.jpg)\`;
      heading.textContent = config.widget.headingText;
      status.textContent = config.widget.statusText;
      headerImage.onload = null;
      headerImage.onerror = null;
      headerImage.src = config.widget.profileImage || '';
      headerImage.style.display = config.widget.profileImage ? 'block' : 'none';
      headerIcon.innerHTML = '';
      const headerImg = createInlineIcon(config.platform, '#fff');
      headerImg.style.width = '22px';
      headerImg.style.height = '22px';
      headerIcon.appendChild(headerImg);
      headerIcon.style.display = config.widget.profileImage ? 'none' : 'flex';
      if (config.widget.profileImage) {
        headerImage.onerror = () => {
          headerImage.style.display = 'none';
          headerIcon.style.display = 'flex';
        };
        headerImage.onload = () => {
          headerImage.style.display = 'block';
          headerIcon.style.display = 'none';
        };
      } else {
        headerImage.style.display = 'none';
        headerIcon.style.display = 'flex';
      }
      if (panel.classList.contains('open')) {
        playTyping();
      }
      input.placeholder = config.widget.inputPlaceholder;
      send.style.background = config.widget.buttonColor;
      brandingText.textContent = 'Powered by';
      brandingLogo.src = '${brandingLogo}';
      brandingLink.href = '${brandingLink}';
      branding.style.display = 'flex';
      panel.style.fontSize = \`\${config.widget.fontSize}px\`;

      setPositions();
    };

    bubble.addEventListener('click', () => {
      const willOpen = !panel.classList.contains('open');
      panel.classList.toggle('open');
      if (willOpen) {
        playTyping();
      }
    });

    send.addEventListener('click', () => {
      const message = normalizeMessage(config.defaultMessage, input.value);
      if (!message) return;
      const url = buildRedirectUrl(config, message);
      window.open(url, '_blank', 'noopener');
    });

    render();
    window.addEventListener('resize', setPositions);
  };

  fetch(\`\${baseUrl}/api/public/widgets/\${widgetId}\`)
    .then((res) => res.ok ? res.json() : Promise.reject())
    .then((config) => mountWidget(config))
    .catch(() => {});
})();
`;

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-allow-private-network": "true",
};

export async function GET() {
  return new NextResponse(widgetScript, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control":
        process.env.NODE_ENV === "production"
          ? "public, max-age=3600, stale-while-revalidate=86400"
          : "no-store, max-age=0",
      ...corsHeaders,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

