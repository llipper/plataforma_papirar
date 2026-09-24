/**
 * Sanitizador seguro de HTML para questões da plataforma Papirar.
 * Garante proteção contra injeção de scripts (XSS), iframes maliciosos e
 * manipuladores de eventos inline, permitindo apenas marcações pedagógicas seguras.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "span",
  "div",
  "blockquote",
  "pre",
  "code",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "sub",
  "sup",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
  "a",
])

const ALLOWED_ATTRS = new Set([
  "class",
  "className",
  "id",
  "href",
  "src",
  "alt",
  "title",
  "target",
  "rel",
  "width",
  "height",
  "colspan",
  "rowspan",
])

const SAFE_URL_PROTOCOL = /^(https?:\/\/|\/|mailto:)/i

export function sanitizeHtml(htmlString?: string | null): string {
  if (!htmlString || typeof htmlString !== "string") {
    return ""
  }

  // Se estiver rodando no navegador (lado do cliente), usamos o DOMParser para análise rigorosa
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, "text/html")
      cleanNode(doc.body)
      return doc.body.innerHTML
    } catch {
      // Fallback para caso ocorra erro no parser nativo
    }
  }

  // Fallback seguro para SSR / Node.js
  return sanitizeFallback(htmlString)
}

function cleanNode(node: Node) {
  const children = Array.from(node.childNodes)

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as HTMLElement
      const tagName = element.tagName.toLowerCase()

      // Remover tag não permitida mantendo ou descartando seus filhos conforme o risco
      if (!ALLOWED_TAGS.has(tagName)) {
        if (
          [
            "script",
            "style",
            "iframe",
            "object",
            "embed",
            "applet",
            "link",
            "meta",
            "form",
            "input",
            "button",
          ].includes(tagName)
        ) {
          element.remove()
          continue
        } else {
          // Desembrulhar elemento não reconhecido mas inofensivo
          while (element.firstChild) {
            element.parentNode?.insertBefore(element.firstChild, element)
          }
          element.remove()
          continue
        }
      }

      // Limpar atributos
      const attrs = Array.from(element.attributes)
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase()

        // Remove manipuladores on* (onclick, onload, onerror...)
        if (attrName.startsWith("on") || !ALLOWED_ATTRS.has(attrName)) {
          element.removeAttribute(attr.name)
          continue
        }

        // Validação de URLs seguras em href e src
        if (attrName === "href" || attrName === "src") {
          const val = attr.value.trim()
          if (!SAFE_URL_PROTOCOL.test(val)) {
            element.removeAttribute(attr.name)
          } else if (attrName === "href" && element.getAttribute("target") === "_blank") {
            element.setAttribute("rel", "noopener noreferrer")
          }
        }
      }

      // Recursão para nós filhos
      cleanNode(element)
    } else if (child.nodeType === Node.COMMENT_NODE) {
      // Remove comentários HTML
      child.remove()
    }
  }
}

function sanitizeFallback(value: string): string {
  // Remove blocos de script, style, iframe, object, embed
  let cleaned = value.replace(
    /<\s*(script|style|iframe|object|embed|form|input|button)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ""
  )
  // Remove tags auto-fechadas perigosas
  cleaned = cleaned.replace(
    /<\s*(script|style|iframe|object|embed|link|meta|base|input|button)[^>]*\/?>/gi,
    ""
  )
  // Remove atributos de eventos inline e styles
  cleaned = cleaned.replace(/\s(?:on\w+|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
  // Remove URLs perigosas em src e href (javascript:, data:text/html)
  cleaned = cleaned.replace(
    /\s(?:href|src)\s*=\s*(?:"\s*(?:javascript:|data:text\/html|vbscript:)[^"]*"|'\s*(?:javascript:|data:text\/html|vbscript:)[^']*'|(?:javascript:|data:text\/html|vbscript:)[^\s>]*)/gi,
    ""
  )
  return cleaned
}
