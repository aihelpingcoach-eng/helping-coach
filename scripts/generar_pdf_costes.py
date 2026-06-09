"""
Genera el PDF de análisis de costes de IA y revenue por anuncios para Helping Coach.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import KeepTogether
import os

# ─── Colores ────────────────────────────────────────────────────────────────
PURPLE      = colors.HexColor('#7C3AED')
PURPLE_LIGHT= colors.HexColor('#A78BFA')
PURPLE_DARK = colors.HexColor('#4C1D95')
BG_DARK     = colors.HexColor('#0F0F1A')
BG_CARD     = colors.HexColor('#1A1A2E')
BG_TABLE    = colors.HexColor('#16213E')
TEXT_WHITE  = colors.HexColor('#F8F8FF')
TEXT_GRAY   = colors.HexColor('#A0A0B8')
GREEN       = colors.HexColor('#10B981')
GREEN_LIGHT = colors.HexColor('#6EE7B7')
AMBER       = colors.HexColor('#F59E0B')
RED         = colors.HexColor('#EF4444')
CYAN        = colors.HexColor('#06B6D4')
GROQ_COLOR  = colors.HexColor('#FF6B35')
GEMINI_COLOR= colors.HexColor('#4285F4')
ANTHRO_COLOR= colors.HexColor('#CC785C')

# ─── Estilos ─────────────────────────────────────────────────────────────────
def make_styles():
    base = getSampleStyleSheet()

    title_main = ParagraphStyle('TitleMain',
        fontSize=26, fontName='Helvetica-Bold',
        textColor=TEXT_WHITE, alignment=TA_CENTER,
        spaceAfter=4, leading=32)

    subtitle = ParagraphStyle('Subtitle',
        fontSize=13, fontName='Helvetica',
        textColor=PURPLE_LIGHT, alignment=TA_CENTER,
        spaceAfter=2)

    section_header = ParagraphStyle('SectionHeader',
        fontSize=15, fontName='Helvetica-Bold',
        textColor=PURPLE_LIGHT, spaceBefore=14, spaceAfter=6,
        borderPad=4)

    body = ParagraphStyle('Body',
        fontSize=9.5, fontName='Helvetica',
        textColor=TEXT_GRAY, spaceAfter=5, leading=15)

    body_white = ParagraphStyle('BodyWhite',
        fontSize=9.5, fontName='Helvetica',
        textColor=TEXT_WHITE, spaceAfter=5, leading=15)

    callout = ParagraphStyle('Callout',
        fontSize=10, fontName='Helvetica-Bold',
        textColor=GREEN, spaceAfter=6, leading=14)

    caption = ParagraphStyle('Caption',
        fontSize=8, fontName='Helvetica',
        textColor=TEXT_GRAY, alignment=TA_CENTER, spaceAfter=3)

    tag = ParagraphStyle('Tag',
        fontSize=8, fontName='Helvetica-Bold',
        textColor=PURPLE_LIGHT, spaceAfter=2)

    footer_style = ParagraphStyle('Footer',
        fontSize=8, fontName='Helvetica',
        textColor=TEXT_GRAY, alignment=TA_CENTER)

    return {
        'title_main': title_main, 'subtitle': subtitle,
        'section_header': section_header, 'body': body,
        'body_white': body_white, 'callout': callout,
        'caption': caption, 'tag': tag, 'footer': footer_style,
    }

# ─── Tabla helper ────────────────────────────────────────────────────────────
def make_table(data, col_widths, header_bg=PURPLE_DARK, alt_bg=BG_TABLE,
               font_size=8.5):
    style = TableStyle([
        ('BACKGROUND',  (0,0), (-1,0),  header_bg),
        ('TEXTCOLOR',   (0,0), (-1,0),  TEXT_WHITE),
        ('FONTNAME',    (0,0), (-1,0),  'Helvetica-Bold'),
        ('FONTSIZE',    (0,0), (-1,0),  font_size),
        ('ALIGN',       (0,0), (-1,0),  'CENTER'),
        ('BOTTOMPADDING',(0,0),(-1,0),  7),
        ('TOPPADDING',  (0,0), (-1,0),  7),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[BG_CARD, alt_bg]),
        ('TEXTCOLOR',   (0,1), (-1,-1), TEXT_WHITE),
        ('FONTNAME',    (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE',    (0,1), (-1,-1), font_size),
        ('ALIGN',       (1,1), (-1,-1), 'CENTER'),
        ('ALIGN',       (0,1), (0,-1),  'LEFT'),
        ('BOTTOMPADDING',(0,1),(-1,-1), 5),
        ('TOPPADDING',  (0,1), (-1,-1), 5),
        ('LINEBELOW',   (0,0), (-1,0),  0.8, PURPLE),
        ('GRID',        (0,0), (-1,-1), 0.3, colors.HexColor('#2A2A4A')),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING',(0,0), (-1,-1), 7),
        ('ROUNDEDCORNERS', [4]),
    ])
    t = Table(data, colWidths=col_widths)
    t.setStyle(style)
    return t

# ─── Fondo de página ─────────────────────────────────────────────────────────
def draw_background(canvas, doc):
    w, h = A4
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    # Franja superior degradada simulada
    canvas.setFillColor(PURPLE_DARK)
    canvas.rect(0, h - 18*mm, w, 18*mm, fill=1, stroke=0)
    # Línea accent inferior
    canvas.setFillColor(PURPLE)
    canvas.rect(0, 0, w, 1.5*mm, fill=1, stroke=0)
    # Número de página
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(TEXT_GRAY)
    canvas.drawCentredString(w/2, 6*mm, f"Helping Coach · Análisis Económico · Página {doc.page}")
    canvas.restoreState()

# ─── GENERADOR PRINCIPAL ─────────────────────────────────────────────────────
def generate():
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'recursos')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'analisis-costes-ia.pdf')

    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=22*mm, bottomMargin=16*mm,
        title='Helping Coach — Análisis de Costes IA y Revenue',
        author='Helping Coach',
    )

    S = make_styles()
    story = []
    W = A4[0] - 36*mm   # ancho útil

    # ══════════════════════════════════════════════════════════════════════
    # PORTADA
    # ══════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 14*mm))
    story.append(Paragraph("⚽  HELPING COACH", S['title_main']))
    story.append(Paragraph("Análisis de Costes de IA y Revenue por Anuncios", S['subtitle']))
    story.append(Spacer(1, 3*mm))
    story.append(HRFlowable(width=W, thickness=1.5, color=PURPLE, spaceAfter=6))

    intro = (
        "Este documento analiza el coste real de cada función de inteligencia artificial "
        "en Helping Coach (Groq, Gemini, Anthropic), proyecta el gasto mensual según el "
        "número de usuarios activos y cuantifica los ingresos esperados por anuncio "
        "Rewarded para diseñar el modelo Free + Pro que hace la app sostenible."
    )
    story.append(Paragraph(intro, S['body']))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 1 — TOKENS POR FUNCIÓN
    # ══════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1 · Funciones de IA y Tokens Estimados", S['section_header']))
    story.append(Paragraph(
        "Cada llamada a la IA consume tokens de entrada (prompt + contexto) "
        "y de salida (respuesta generada). Los valores siguientes son estimaciones "
        "basadas en el tamaño real de los prompts del sistema y las respuestas típicas.",
        S['body']
    ))
    story.append(Spacer(1, 2*mm))

    tok_data = [
        ["Función", "Tokens\nEntrada", "Tokens\nSalida", "Total\nTokens", "Frecuencia\nestimada"],
        ["Análisis de sinergias",        "800",   "1.500", "2.300", "Alta"],
        ["Asesor de formaciones",        "600",   "800",   "1.400", "Media"],
        ["Informe de partido (IA)",      "700",   "1.000", "1.700", "Media"],
        ["Coach Chat (por mensaje)",     "400",   "400",   "800",   "Muy alta"],
        ["Análisis de jugador (al crear)","300",  "200",   "500",   "Alta"],
        ["Análisis del rival (futuro)",  "900",   "1.200", "2.100", "Media"],
        ["ADN del equipo",               "—",     "—",     "0",     "Sin coste (local)"],
    ]
    story.append(make_table(tok_data,
        [W*0.34, W*0.13, W*0.13, W*0.13, W*0.27]))
    story.append(Paragraph(
        "* El ADN del equipo se calcula localmente (sin IA) — coste cero.",
        S['caption']))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 2 — PRECIOS POR PROVEEDOR
    # ══════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2 · Precios por Proveedor", S['section_header']))

    # Tabla de tarifas
    tarifa_data = [
        ["Proveedor", "Modelo", "Precio entrada\n($/1M tokens)", "Precio salida\n($/1M tokens)", "Plan gratuito"],
        ["Groq\n(actual)", "llama-3.3-70b-versatile", "$0,59", "$0,79", "14.400 req/día\nSin coste"],
        ["Gemini", "gemini-2.5-flash", "$0,15", "$0,60", "1.500 req/día\nSin coste"],
        ["Anthropic", "claude-haiku-4-5", "$0,80", "$4,00", "Sin plan\ngratuito"],
        ["Anthropic", "claude-sonnet-4-6", "$3,00", "$15,00", "Sin plan\ngratuito"],
    ]
    story.append(make_table(tarifa_data,
        [W*0.15, W*0.28, W*0.17, W*0.17, W*0.23]))
    story.append(Spacer(1, 4*mm))

    # Tabla de coste por función por proveedor
    story.append(Paragraph("Coste por uso (en dólares) según proveedor:", S['body_white']))
    story.append(Spacer(1, 2*mm))

    cost_data = [
        ["Función", "Groq\n(actual)", "Gemini\n2.5 Flash", "Anthropic\nHaiku"],
        ["Análisis de sinergias",         "$0,00166", "$0,00102", "$0,00664"],
        ["Asesor de formaciones",         "$0,00099", "$0,00057", "$0,00368"],
        ["Informe de partido",            "$0,00120", "$0,00071", "$0,00456"],
        ["Coach Chat (1 mensaje)",        "$0,00055", "$0,00030", "$0,00192"],
        ["Análisis de jugador",           "$0,00034", "$0,00017", "$0,00104"],
        ["Análisis del rival (futuro)",   "$0,00148", "$0,00086", "$0,00552"],
    ]
    story.append(make_table(cost_data,
        [W*0.40, W*0.20, W*0.20, W*0.20]))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "Groq es actualmente el proveedor más barato con modelos de alta calidad. "
        "Gemini 2.5 Flash es aún más económico en entrada pero tiene peor rendimiento "
        "en análisis complejos. Anthropic ofrece la mayor calidad al mayor precio.",
        S['body']))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 3 — ESCENARIOS DE USUARIOS
    # ══════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph("3 · Escenarios de Coste Mensual por Usuarios", S['section_header']))
    story.append(Paragraph(
        "Uso estimado por usuario activo al día: 1 análisis de sinergias + "
        "0,5 asesores de formación + 0,5 informes + 3 mensajes de chat + "
        "1 análisis de jugador. Total: ~5 llamadas IA/día.",
        S['body']
    ))
    story.append(Spacer(1, 2*mm))

    # Coste diario por usuario:
    # Groq: 0.00166 + 0.5*0.00099 + 0.5*0.00120 + 3*0.00055 + 0.00034 = 0.00166+0.00050+0.00060+0.00165+0.00034 = 0.00475
    # Gemini: 0.00102 + 0.5*0.00057 + 0.5*0.00071 + 3*0.00030 + 0.00017 = 0.00102+0.00029+0.00036+0.00090+0.00017 = 0.00274
    # Haiku: 0.00664 + 0.5*0.00368 + 0.5*0.00456 + 3*0.00192 + 0.00104 = 0.00664+0.00184+0.00228+0.00576+0.00104 = 0.01756

    esc_data = [
        ["Escenario", "Usuarios\nactivos", "Coste/mes\nGroq", "Coste/mes\nGemini", "Coste/mes\nHaiku"],
        ["App personal / prueba",   "10",     "$1,43",    "$0,82",    "$5,27"],
        ["Lanzamiento inicial",     "500",    "$71,25",   "$41,10",   "$263,40"],
        ["Crecimiento",             "5.000",  "$712,50",  "$411,00",  "$2.634,00"],
        ["Escala",                  "50.000", "$7.125,00","$4.110,00","$26.340,00"],
    ]
    story.append(make_table(esc_data,
        [W*0.32, W*0.13, W*0.16, W*0.16, W*0.16],
        font_size=9))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "Cálculo: 5 llamadas IA/día × 30 días = 150 llamadas/mes/usuario. "
        "Groq coste diario/usuario: $0,00475 → mensual: $0,1425.",
        S['caption']))
    story.append(Spacer(1, 3*mm))

    # Plan gratuito cubre...
    free_data = [
        ["Proveedor", "Límite gratuito/día", "Usuarios cubiertos\n(5 req/usuario/día)", "Coste al superarlo"],
        ["Groq",   "14.400 requests", "~2.880 usuarios", "Pago por uso"],
        ["Gemini", "1.500 requests",  "~300 usuarios",   "Pago por uso"],
        ["Anthropic","Sin plan gratis","0 usuarios",      "Siempre de pago"],
    ]
    story.append(Paragraph("Capacidad del plan gratuito:", S['body_white']))
    story.append(Spacer(1, 2*mm))
    story.append(make_table(free_data,
        [W*0.22, W*0.25, W*0.28, W*0.25]))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "Con Groq gratuito puedes soportar hasta ~2.880 usuarios activos diarios sin coste. "
        "Es suficiente para la fase de lanzamiento.",
        S['callout']))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 4 — REVENUE POR ANUNCIOS
    # ══════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4 · Revenue por Anuncio Rewarded", S['section_header']))
    story.append(Paragraph(
        "Los anuncios Rewarded son el formato que mejor paga: el usuario elige ver "
        "el anuncio a cambio de una acción premium (usar la IA). Tasas de finalización "
        "del 85–95%, mucho más altas que banners o interstitials.",
        S['body']
    ))
    story.append(Spacer(1, 2*mm))

    rev_data = [
        ["Mercado", "Revenue por anuncio\ncompletado", "eCPM\n(por 1.000 vistas)", "Notas"],
        ["España",          "$0,02 – $0,06", "$20 – $60",  "Mercado medio"],
        ["Latinoamérica",   "$0,01 – $0,03", "$10 – $30",  "Mercado bajo-medio"],
        ["USA / UK",        "$0,05 – $0,20", "$50 – $200", "Mercado premium"],
        ["Media global\n(herramientas)", "$0,02 – $0,08", "$20 – $80", "Referencia apps utilitarias"],
    ]
    story.append(make_table(rev_data,
        [W*0.23, W*0.25, W*0.20, W*0.32]))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 5 — AMORTIZACIÓN
    # ══════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5 · Amortización: ¿Cuántos anuncios cubre el coste de IA?", S['section_header']))
    story.append(Paragraph(
        "Usando $0,03 como revenue medio por anuncio y Groq como proveedor:",
        S['body']))
    story.append(Spacer(1, 2*mm))

    amort_data = [
        ["Función IA", "Coste IA\n(Groq)", "Anuncios para\ncubrir el coste", "Revenue generado\n(150 usos/mes)"],
        ["Análisis de sinergias",   "$0,00166", "0,06 anuncios",  "$4,50"],
        ["Asesor de formaciones",   "$0,00099", "0,03 anuncios",  "$4,50"],
        ["Informe de partido",      "$0,00120", "0,04 anuncios",  "$4,50"],
        ["Coach Chat (5 msg/día)",  "$0,00275", "0,09 anuncios",  "$4,50"],
        ["TOTAL mensual/usuario",   "$0,14",    "5 anuncios",     "$13,50"],
    ]
    story.append(make_table(amort_data,
        [W*0.32, W*0.17, W*0.22, W*0.29]))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "Un usuario que usa la IA 150 veces al mes ve 150 anuncios Rewarded "
        "y genera $4,50 de revenue de anuncios, cubriendo 32x el coste de IA ($0,14). "
        "El margen por usuario Free es muy positivo.",
        S['callout']))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 6 — MODELO FREE + PRO
    # ══════════════════════════════════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph("6 · Modelo de Negocio Recomendado: Free + Pro", S['section_header']))

    planes_data = [
        ["", "Plan FREE", "Plan PRO — 4,99€/mes"],
        ["Tácticas, entrenamiento,\nlesiones, progresión", "✓  Ilimitado", "✓  Ilimitado"],
        ["Calendario de partidos", "✓  Ilimitado", "✓  Ilimitado"],
        ["Análisis de sinergias", "1 anuncio Rewarded\npor uso", "✓  Sin anuncio"],
        ["Asesor de formaciones", "1 anuncio Rewarded\npor uso", "✓  Sin anuncio"],
        ["Coach Chat", "5 mensajes/día gratis\nluego anuncio por bloque", "✓  Ilimitado"],
        ["Informe de partido (IA)", "1 anuncio Rewarded\npor informe", "✓  Sin anuncio"],
        ["Análisis del rival (futuro)", "1 anuncio Rewarded\npor análisis", "✓  Sin anuncio"],
        ["ADN del equipo", "✓  Siempre gratis\n(cálculo local)", "✓  Siempre gratis"],
        ["Revenue estimado/usuario/mes", "~$4,50 (ads)", "~$5,49 (suscripción)"],
        ["Coste IA estimado/usuario/mes", "~$0,14 (Groq)", "~$0,36 (Groq, uso mayor)"],
        ["Margen estimado", "~$4,36", "~$5,13"],
    ]

    plan_style = TableStyle([
        ('BACKGROUND',    (0,0),  (-1,0),  PURPLE_DARK),
        ('TEXTCOLOR',     (0,0),  (-1,0),  TEXT_WHITE),
        ('FONTNAME',      (0,0),  (-1,0),  'Helvetica-Bold'),
        ('FONTSIZE',      (0,0),  (-1,-1), 9),
        ('ALIGN',         (0,0),  (-1,-1), 'CENTER'),
        ('ALIGN',         (0,1),  (0,-1),  'LEFT'),
        ('ROWBACKGROUNDS',(0,1),  (-1,-1), [BG_CARD, BG_TABLE]),
        ('TEXTCOLOR',     (0,1),  (-1,-1), TEXT_WHITE),
        ('FONTNAME',      (0,1),  (-1,-1), 'Helvetica'),
        ('BACKGROUND',    (1,9),  (1,9),   colors.HexColor('#1A3A2A')),
        ('TEXTCOLOR',     (1,9),  (1,9),   GREEN_LIGHT),
        ('FONTNAME',      (1,9),  (1,9),   'Helvetica-Bold'),
        ('BACKGROUND',    (2,9),  (2,9),   colors.HexColor('#1A2A3A')),
        ('TEXTCOLOR',     (2,9),  (2,9),   CYAN),
        ('FONTNAME',      (2,9),  (2,9),   'Helvetica-Bold'),
        ('BACKGROUND',    (1,11), (-1,11), colors.HexColor('#1A3A1A')),
        ('TEXTCOLOR',     (1,11), (-1,11), GREEN),
        ('FONTNAME',      (1,11), (-1,11), 'Helvetica-Bold'),
        ('LINEBELOW',     (0,0),  (-1,0),  1, PURPLE),
        ('GRID',          (0,0),  (-1,-1), 0.3, colors.HexColor('#2A2A4A')),
        ('LEFTPADDING',   (0,0),  (-1,-1), 8),
        ('RIGHTPADDING',  (0,0),  (-1,-1), 8),
        ('TOPPADDING',    (0,0),  (-1,-1), 6),
        ('BOTTOMPADDING', (0,0),  (-1,-1), 6),
        ('FONTSIZE',      (0,0),  (0,-1),  8.5),
    ])
    t = Table(planes_data, colWidths=[W*0.38, W*0.31, W*0.31])
    t.setStyle(plan_style)
    story.append(t)
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 7 — BREAK-EVEN Y PROYECCIÓN
    # ══════════════════════════════════════════════════════════════════════
    story.append(Paragraph("7 · Proyección de Ingresos vs Costes", S['section_header']))

    proy_data = [
        ["Usuarios", "Mix\nFree/Pro", "Ingresos\nads (Free)", "Ingresos\nsuscripción (Pro)", "Coste\nIA total", "Beneficio\nestimado/mes"],
        ["100 usuarios",   "80% / 20%", "$288",   "$100",  "$14,25",  "+$374"],
        ["500 usuarios",   "75% / 25%", "$1.350", "$624",  "$71,25",  "+$1.903"],
        ["2.000 usuarios", "70% / 30%", "$4.725", "$2.994","$285,00", "+$7.434"],
        ["10.000 usuarios","65% / 35%", "$19.500","$17.465","$1.425", "+$35.540"],
    ]
    story.append(make_table(proy_data,
        [W*0.17, W*0.13, W*0.16, W*0.22, W*0.14, W*0.18],
        font_size=8.5))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "Proyección conservadora: ads a $0,03/vw media, Pro a 4,99€ (~$5,49). "
        "El punto de equilibrio se alcanza con menos de 5 usuarios.",
        S['caption']))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # SECCIÓN 8 — REQUISITOS TÉCNICOS
    # ══════════════════════════════════════════════════════════════════════
    story.append(Paragraph("8 · Requisitos para Implementar la Monetización", S['section_header']))

    req_data = [
        ["Componente", "Descripción", "Coste"],
        ["Dominio propio",        "helpingcoach.app (requerido por AdSense/AdMob)", "~12€/año"],
        ["Google AdMob",          "Anuncios Rewarded para web/app nativa",          "Gratis"],
        ["Stripe",                "Pagos recurrentes para el plan Pro",             "2,9% + 0,30€/transacción"],
        ["Capacitor (futuro)",    "Envolver la PWA para Play Store / App Store",    "Gratis (open source)"],
        ["Google Play Console",   "Publicar en Android",                            "25€ único"],
        ["Apple Developer (futuro)","Publicar en iOS",                              "99€/año"],
        ["Campo plan en Supabase","Columna plan='free'|'pro' en coach_profiles",    "Sin coste adicional"],
    ]
    story.append(make_table(req_data,
        [W*0.27, W*0.48, W*0.25]))
    story.append(Spacer(1, 4*mm))

    # ══════════════════════════════════════════════════════════════════════
    # CONCLUSIÓN
    # ══════════════════════════════════════════════════════════════════════
    story.append(HRFlowable(width=W, thickness=1, color=PURPLE, spaceAfter=4))
    story.append(Paragraph("Conclusión", S['section_header']))

    concl = (
        "El modelo Free + Anuncios Rewarded + Pro es el más adecuado para Helping Coach. "
        "El coste de IA por usuario es mínimo (~$0,14/mes con Groq) y un solo anuncio "
        "Rewarded cubre el coste de 18 llamadas a la IA. Con 500 usuarios y una conversión "
        "al 25% en Pro, la app genera más de $1.900/mes de beneficio. "
        "Groq es el proveedor recomendado para empezar: plan gratuito generoso, "
        "alta calidad y menor coste en producción."
    )
    story.append(Paragraph(concl, S['body_white']))
    story.append(Spacer(1, 3*mm))

    pasos = [
        "1. Adquirir dominio propio (helpingcoach.app) — requisito para AdSense/AdMob",
        "2. Implementar campo 'plan' en coach_profiles y lógica de AdGate en la app",
        "3. Integrar Stripe para suscripciones Pro",
        "4. Registrar cuenta AdMob y obtener ID de anuncio Rewarded",
        "5. Envolver con Capacitor para Android cuando la web esté estable",
    ]
    for paso in pasos:
        story.append(Paragraph(paso, S['callout']))
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph(
        "Fuentes de precios: groq.com/pricing · ai.google.dev/pricing · anthropic.com/pricing "
        "· admob.google.com · stripe.com/pricing  |  Junio 2026",
        S['caption']))

    # ─── BUILD ───────────────────────────────────────────────────────────
    doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background)
    print(f"PDF generado: {os.path.abspath(output_path)}")


if __name__ == '__main__':
    generate()
