# Design System Extraction — Mockup "Luxury / Travel" (Pinterest)

## Origem e por que isso NÃO é uma extração no sentido da skill `extract-design-system`

A skill `extract-design-system` foi escrita para rodar **Playwright contra uma URL pública**, lendo CSS computado real (cor, fonte, radius, sombra via DOM). Nenhuma das três URLs do Pinterest fornecidas neste chat era acessível:

| Tentativa | URL | Resultado |
|---|---|---|
| 1 | `pin.it/53aEoukg0` | `ROBOTS_DISALLOWED` |
| 2 | `.../pin/.../sent/?invite_code=...` | `ROBOTS_DISALLOWED` (link de convite privado) |
| 3 | `.../pin/.../feedback/?invite_code=...` | mesma causa raiz, nem tentado de novo |

Causa raiz: Pinterest bloqueia fetchers headless via `robots.txt` e os links eram de compartilhamento privado (`invite_code`), não páginas públicas indexáveis. Nenhuma variante de URL do domínio `pinterest.com` resolveria isso.

**Conclusão:** o que segue é **extração por amostragem de pixel** sobre o screenshot original que você enviou — um método diferente, com garantias diferentes.

## Metodologia real usada

1. Crop da região dos dois mockups via PIL.
2. Zoom em sub-regiões críticas (botão pill, tab bar, badge).
3. `Image.getpixel()` em coordenadas dentro de áreas de fill sólido identificadas visualmente.

## Tabela de confiança

| Categoria | Confiança | Por quê |
|---|---|---|
| Cores sólidas (navy, peach, tan, bg) | **Alta** | Pixel real lido diretamente do bitmap |
| Cores de texto | **Baixa** | JPEG de baixa resolução + anti-aliasing corrompem a amostra; valores são estimativa |
| Border-radius | **Baixa** | Não existe medição de raio em um bitmap rasterizado sem acesso ao vetor original — são proporções estimadas visualmente |
| Tipografia (font-family) | **Nenhuma** | Pixel sampling não extrai fontes. Isso exigiria a fonte/arquivo original ou uma ferramenta de font-matching (ex. WhatTheFont), não executada |
| Spacing scale | **Nenhuma** | Mesma limitação do radius |

## Recomendação antes de usar isso em produção (Pella Bethânia / FlowMail)

1. **Não copiar os valores de baixa/nenhuma confiança para `tokens.css` de um projeto real.** Eles são placeholders, não verdade extraída.
2. Se esse mockup for referência de estilo válida, vale achar a fonte original (provável Dribbble/Behance, já que o texto é lorem ipsum tipo placeholder de portfólio) e rodar a extração de verdade — ou abrir no Figma se houver link de Community.
3. Considerar que reproduzir 1:1 um mockup de portfólio de terceiros como design system de produto comercial é zona cinzenta de propriedade — pelo menos tratar como "moodboard de referência", não como sistema a clonar.

## Arquivos gerados

- `tokens.json` — tokens com flag de confiança por valor
- `tokens.css` — variáveis CSS correspondentes
