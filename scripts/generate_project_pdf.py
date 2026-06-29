"""Generate Smart Healthcare project description PDF."""

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT_PATH = r"c:\Users\kasuk\Desktop\projects\HealthCare\Smart-Healthcare-Project-Description.pdf"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=styles["Title"],
            fontSize=28,
            leading=34,
            textColor=colors.HexColor("#0F4C81"),
            alignment=TA_CENTER,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSubtitle",
            parent=styles["Normal"],
            fontSize=14,
            leading=20,
            textColor=colors.HexColor("#444444"),
            alignment=TA_CENTER,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionH1",
            parent=styles["Heading1"],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0F4C81"),
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionH2",
            parent=styles["Heading2"],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#1A5276"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletItem",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            leftIndent=18,
            bulletIndent=6,
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Footer",
            parent=styles["Normal"],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER,
        )
    )
    return styles


def bullet(story, styles, text):
    story.append(Paragraph(f"&bull; {text}", styles["BulletItem"]))


def table(story, headers, rows, col_widths=None):
    data = [headers] + rows
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F4C81")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CCCCCC")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F5F8FA")]),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 8))


def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.grey)
    canvas.drawCentredString(
        letter[0] / 2,
        0.45 * inch,
        f"Smart Healthcare - Project Description  |  Page {doc.page}",
    )
    canvas.restoreState()


def build_story(styles):
    story = []

    # Cover
    story.append(Spacer(1, 1.6 * inch))
    story.append(Paragraph("Smart Healthcare", styles["CoverTitle"]))
    story.append(Paragraph("Complete Project Description", styles["CoverSubtitle"]))
    story.append(Spacer(1, 0.2 * inch))
    story.append(
        Paragraph(
            "Mobile App Development Reference Document",
            styles["CoverSubtitle"],
        )
    )
    story.append(Spacer(1, 0.4 * inch))
    story.append(HRFlowable(width="60%", thickness=2, color=colors.HexColor("#0F4C81")))
    story.append(Spacer(1, 0.3 * inch))
    story.append(
        Paragraph(
            "Version 0.1.0  |  HealthCare Platform  |  May 2026",
            styles["CoverSubtitle"],
        )
    )
    story.append(PageBreak())

    # 1. Overview
    story.append(Paragraph("1. Product Overview", styles["SectionH1"]))
    story.append(
        Paragraph(
            "Smart Healthcare is a digital health platform that connects patients with AI-assisted "
            "symptom analysis, virtual doctor-style chat, online pharmacy, clinic and hospital "
            "discovery with maps, appointment booking, and profile management. The product is branded "
            "<b>Smart Healthcare</b> in the user interface.",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "<b>Tagline:</b> Healthcare Made Simple - instant health insights, doctor consultations, "
            "medicine orders, and nearby clinics in one trusted platform.",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 6))

    # 2. Two apps
    story.append(Paragraph("2. Two Applications in One Repository", styles["SectionH1"]))
    table(
        story,
        ["App", "Path", "Dev URL", "Audience"],
        [
            ["Patient Portal", "Root (app/, components/)", "localhost:3000", "Patients"],
            ["Provider Portal", "provider-portal/", "localhost:3001", "Staff (admin, doctor, clinic, pharmacy)"],
        ],
        col_widths=[1.2 * inch, 1.8 * inch, 1.2 * inch, 1.8 * inch],
    )
    story.append(
        Paragraph(
            "For a patient mobile app, focus on the main application and its API routes. "
            "A provider mobile app would be a separate product using the provider-portal APIs.",
            styles["Body"],
        )
    )

    # 3. User roles
    story.append(Paragraph("3. User Roles", styles["SectionH1"]))
    table(
        story,
        ["Role", "Purpose"],
        [
            ["patient", "Default role; uses all patient-facing features"],
            ["doctor", "Provider portal - appointments, consultations"],
            ["clinic", "Clinic management operations"],
            ["pharmacy", "Inventory and order management"],
            ["admin", "Users, facilities, hospitals, stats, map administration"],
        ],
        col_widths=[1.2 * inch, 4.8 * inch],
    )

    # 4. Patient screens
    story.append(Paragraph("4. Patient App - Screens and Flows", styles["SectionH1"]))
    story.append(Paragraph("4.1 Public (Unauthenticated)", styles["SectionH2"]))
    table(
        story,
        ["Screen", "Route", "Behavior"],
        [
            ["Landing", "/", "Marketing, feature cards, live AI symptom demo (no login)"],
            ["Login", "/auth/login", "Email and password authentication"],
            ["Signup", "/auth/signup", "New user registration"],
            ["Signup Success", "/auth/signup-success", "Confirmation page"],
            ["Auth Error", "/auth/error", "Error display"],
        ],
        col_widths=[1.1 * inch, 1.4 * inch, 3.5 * inch],
    )

    story.append(Paragraph("4.2 Authenticated App Shell (/app/*)", styles["SectionH2"]))
    table(
        story,
        ["Menu Item", "Route", "Purpose"],
        [
            ["Dashboard", "/app", "Home - stats, wellness chart, quick actions"],
            ["Symptom Checker", "/app/symptom-checker", "AI symptom analysis"],
            ["Doctor Chat", "/app/doctor-chat", "Streaming AI virtual doctor"],
            ["Pharmacy", "/app/pharmacy", "Medicine catalog and shopping cart"],
            ["My Orders", "/app/orders", "Order history and tracking"],
            ["Find Clinics", "/app/clinics", "Facility list and interactive map"],
            ["Appointments", "/app/appointments", "Book and manage appointments"],
            ["My Profile", "/app/profile", "Personal and medical information"],
        ],
        col_widths=[1.2 * inch, 1.6 * inch, 3.2 * inch],
    )
    story.append(PageBreak())

    # 5. Feature details
    story.append(Paragraph("5. Feature Details (Mobile Implementation)", styles["SectionH1"]))

    story.append(Paragraph("5.1 AI Symptom Checker", styles["SectionH2"]))
    bullet(story, styles, "API: POST /api/symptom-check")
    bullet(story, styles, "Auth: Not required on landing demo; same endpoint when logged in")
    bullet(story, styles, "AI Engine: Groq via Vercel AI SDK, streaming text response")
    bullet(story, styles, "Request: symptoms, duration, severity (1-10), conversationHistory, isFollowUp")
    bullet(story, styles, "Response: Streamed markdown-style sections (assessment, condition likelihood, severity, follow-ups)")
    bullet(story, styles, "UX: Multi-turn conversation with follow-up questions")
    bullet(story, styles, "Disclaimer: Educational only - not a medical diagnosis")

    story.append(Paragraph("5.2 Doctor Chat (AI Assistant)", styles["SectionH2"]))
    bullet(story, styles, "API: POST /api/chat (requires authentication)")
    bullet(story, styles, "Request body: message, conversationId")
    bullet(story, styles, "Response: Streamed text from Groq llama-3.3-70b-versatile")
    bullet(story, styles, "Backend: Upserts consultations collection in MongoDB")
    bullet(story, styles, "Note: HTTP streaming AI, not WebSocket or live human doctors")

    story.append(Paragraph("5.3 Pharmacy", styles["SectionH2"]))
    bullet(story, styles, "List medicines: GET /api/pharmacy/medicines (public)")
    bullet(story, styles, "Checkout: POST /api/pharmacy/checkout (auth required)")
    bullet(story, styles, "Medicine fields: name, description, price, stock, category, imageUrl")
    bullet(story, styles, "Cart stored client-side in localStorage key smarthealthcare_cart")
    bullet(story, styles, "Checkout sends items array and total; server decrements stock")
    bullet(story, styles, "Categories: Cold and Flu, Pain Relief, Antibiotics, Vitamins, Digestive Health")

    story.append(Paragraph("5.4 Orders", styles["SectionH2"]))
    bullet(story, styles, "API: GET /api/user/orders (auth required)")
    bullet(story, styles, "Returns: id (ORD-XXXXXX), order_date, total_amount, status, items")
    bullet(story, styles, "Statuses: pending, confirmed, processing, shipped, delivered, cancelled")

    story.append(Paragraph("5.5 Find Clinics / Facilities", styles["SectionH2"]))
    bullet(story, styles, "API: GET /api/facilities (public)")
    bullet(story, styles, "Data: Hospitals and clinics (seed data: Andhra Pradesh, India)")
    bullet(story, styles, "Fields: name, facility_type, address, city, state, phone, rating, lat/lng")
    bullet(story, styles, "UI: Search, filters, list view, Leaflet map integration")
    bullet(story, styles, "Mobile: Use Google Maps, Mapbox, or react-native-maps")

    story.append(Paragraph("5.6 Appointments", styles["SectionH2"]))
    bullet(story, styles, "List: GET /api/appointments (auth)")
    bullet(story, styles, "Create: POST /api/appointments with clinic_id, appointment_date, appointment_time, reason")
    bullet(story, styles, "Status on create: pending (UI also shows confirmed, cancelled)")

    story.append(Paragraph("5.7 Profile and Health Data", styles["SectionH2"]))
    bullet(story, styles, "API: GET/PUT /api/user/profile (auth)")
    bullet(story, styles, "Fields: email, first_name, last_name, phone, date_of_birth, medical_history")
    bullet(story, styles, "Note: GET /api/health is a server ping only, not patient health records")
    story.append(PageBreak())

    # 6. Authentication
    story.append(Paragraph("6. Authentication (Critical for Mobile)", styles["SectionH1"]))
    story.append(
        Paragraph(
            "Current implementation uses MongoDB collections (users, sessions), bcrypt password "
            "hashing, and HTTP-only cookie sessionToken (UUID). Login returns id, email, role and "
            "sets a cookie. Current user via GET /api/auth/me.",
            styles["Body"],
        )
    )
    story.append(Paragraph("Mobile auth options:", styles["SectionH2"]))
    bullet(story, styles, "Add Bearer token auth - return sessionToken in login response, accept Authorization header")
    bullet(story, styles, "Use WebView with cookie jar (fragile on native apps)")
    bullet(story, styles, "Migrate to Supabase Auth or Firebase and align backend")
    story.append(
        Paragraph(
            "<b>Important:</b> README mentions Supabase, but patient auth in production paths uses "
            "MongoDB and cookies, not Supabase JWT.",
            styles["Body"],
        )
    )

    # 7. Backend
    story.append(Paragraph("7. Backend and Data Architecture", styles["SectionH1"]))
    story.append(Paragraph("7.1 Technology Stack", styles["SectionH2"]))
    table(
        story,
        ["Layer", "Technology"],
        [
            ["Frontend", "Next.js 16, React 19, TypeScript"],
            ["Styling", "Tailwind CSS 4, Radix UI, Framer Motion"],
            ["API", "Next.js Route Handlers (app/api/*)"],
            ["Database (runtime)", "MongoDB (MONGODB_URI, db: smarthealthcare)"],
            ["AI", "Vercel AI SDK + Groq (GROQ_API_KEY)"],
            ["Reference schema", "Supabase PostgreSQL in scripts/001_initial_schema.sql"],
        ],
        col_widths=[1.5 * inch, 4.5 * inch],
    )

    story.append(Paragraph("7.2 MongoDB Collections (In Use)", styles["SectionH2"]))
    table(
        story,
        ["Collection", "Purpose"],
        [
            ["users", "email, passwordHash, role, profile fields"],
            ["sessions", "token, userId, createdAt"],
            ["appointments", "User appointment bookings"],
            ["medicines", "Pharmacy product catalog"],
            ["orders", "Pharmacy order records"],
            ["facilities", "Hospitals and clinics"],
            ["consultations", "Chat session metadata"],
        ],
        col_widths=[1.3 * inch, 4.7 * inch],
    )

    # 8. API reference
    story.append(Paragraph("8. Complete API Reference (Patient App)", styles["SectionH1"]))
    story.append(
        Paragraph("Base URL: NEXT_PUBLIC_APP_URL (e.g. http://localhost:3000)", styles["Body"])
    )
    table(
        story,
        ["Method", "Endpoint", "Auth", "Description"],
        [
            ["POST", "/api/auth/login", "No", "User login"],
            ["POST", "/api/auth/signup", "No", "User registration"],
            ["POST", "/api/auth/logout", "Cookie", "Logout"],
            ["GET", "/api/auth/me", "Cookie", "Current user"],
            ["GET", "/api/appointments", "Yes", "List appointments"],
            ["POST", "/api/appointments", "Yes", "Book appointment"],
            ["POST", "/api/symptom-check", "No*", "AI symptoms (stream)"],
            ["POST", "/api/chat", "Yes", "AI doctor chat (stream)"],
            ["GET", "/api/pharmacy/medicines", "No", "Medicine catalog"],
            ["POST", "/api/pharmacy/checkout", "Yes", "Place order"],
            ["GET", "/api/user/orders", "Yes", "Order history"],
            ["GET", "/api/facilities", "No", "Clinics and hospitals"],
            ["GET", "/api/user/profile", "Yes", "Get profile"],
            ["PUT", "/api/user/profile", "Yes", "Update profile"],
            ["GET", "/api/health", "No", "API health ping only"],
        ],
        col_widths=[0.55 * inch, 1.65 * inch, 0.55 * inch, 2.25 * inch],
    )
    story.append(PageBreak())

    # 9. Provider portal
    story.append(Paragraph("9. Provider Portal (Separate Mobile App Option)", styles["SectionH1"]))
    bullet(story, styles, "/login - Staff authentication")
    bullet(story, styles, "/doctor - Appointments, messages, patient workspace")
    bullet(story, styles, "/clinic - Clinic operations")
    bullet(story, styles, "/pharmacy - Orders dashboard")
    bullet(story, styles, "/admin - Stats, users, hospitals, facilities, map, settings")
    story.append(Spacer(1, 6))
    story.append(Paragraph("Admin API examples:", styles["SectionH2"]))
    bullet(story, styles, "GET /api/admin/stats - User counts, sessions, recent users")
    bullet(story, styles, "GET/POST /api/admin/users, /api/admin/facilities, /api/admin/hospitals")
    bullet(story, styles, "POST /api/admin/create-staff")
    bullet(story, styles, "GET /api/pharmacy/orders, /api/pharmacy/dashboard")

    # 10. Environment
    story.append(Paragraph("10. Environment Variables", styles["SectionH1"]))
    for line in [
        "MONGODB_URI=your_mongodb_connection_string",
        "MONGODB_DB=smarthealthcare",
        "GROQ_API_KEY=your_groq_api_key",
        "GOOGLE_GENERATIVE_AI_API_KEY=optional",
        "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    ]:
        bullet(story, styles, line)

    # 11. Mobile structure
    story.append(Paragraph("11. Suggested Mobile App Structure (MVP)", styles["SectionH1"]))
    screens = [
        "Onboarding - splash and value proposition",
        "Auth - login, signup (forgot password not yet on web)",
        "Home - quick actions mirroring /app dashboard",
        "Symptom Checker - chat-style AI with streaming",
        "Doctor Chat - authenticated AI assistant",
        "Pharmacy - grid, search, filters, cart, checkout",
        "Orders - list, detail, status tracking",
        "Clinics - list, map, call and directions",
        "Appointments - list and booking form",
        "Profile - edit fields, logout, privacy links",
    ]
    for i, s in enumerate(screens, 1):
        bullet(story, styles, f"{i}. {s}")

    story.append(Paragraph("Nice-to-have (not fully built on web):", styles["SectionH2"]))
    for item in [
        "Push notifications (appointments, order shipped)",
        "Real human telemedicine (video/voice)",
        "Prescription upload",
        "Payment gateway integration",
        "Offline cart sync",
        "Biometric login",
    ]:
        bullet(story, styles, item)

    # 12. Tech recommendations
    story.append(Paragraph("12. Mobile Technology Recommendations", styles["SectionH1"]))
    table(
        story,
        ["Concern", "Recommendation"],
        [
            ["Framework", "React Native (Expo) or Flutter"],
            ["Maps", "react-native-maps / Google Maps SDK"],
            ["Streaming AI", "fetch with readable stream or SSE client"],
            ["Auth", "Implement Bearer token on backend first"],
            ["State", "React Query / TanStack Query"],
            ["Cart", "AsyncStorage + sync on checkout"],
            ["UI", "Match Smart Healthcare branding - primary blue, cards, lucide-style icons"],
        ],
        col_widths=[1.3 * inch, 4.7 * inch],
    )

    # 13. Legal
    story.append(Paragraph("13. Legal and Compliance", styles["SectionH1"]))
    story.append(
        Paragraph(
            "Landing page references Terms, Privacy, Cookie Policy, and HIPAA compliance (links are "
            "placeholders). AI features include disclaimers that output is not medical advice. "
            "For production, implement proper privacy policy, data retention, and regional compliance "
            "(HIPAA, GDPR, India DPDP, etc.).",
            styles["Body"],
        )
    )

    # 14. Gaps
    story.append(Paragraph("14. Gaps Between README and Code", styles["SectionH1"]))
    table(
        story,
        ["README Claim", "Actual Behavior"],
        [
            ["Supabase auth", "MongoDB + session cookies"],
            ["WebSocket doctor chat", "HTTP streaming AI (Groq)"],
            ["Health records API", "Profile medical_history field only"],
            ["Google AI for symptoms", "Groq is primary engine"],
            ["PUT/DELETE appointments", "Only GET + POST exist"],
        ],
        col_widths=[2.0 * inch, 4.0 * inch],
    )

    # 15. Elevator pitch
    story.append(Paragraph("15. Elevator Pitch", styles["SectionH1"]))
    story.append(
        Paragraph(
            "Smart Healthcare is an all-in-one patient platform: describe symptoms and get AI-powered "
            "analysis, chat with an AI health assistant, book clinic appointments, find hospitals on a "
            "map, order medicines from an online pharmacy, and manage your profile and orders - backed "
            "by a Next.js API and MongoDB, with a separate web portal for doctors, pharmacies, "
            "clinics, and administrators.",
            styles["Body"],
        )
    )

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CCCCCC")))
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "Document generated from HealthCare project codebase analysis. "
            "For mobile development, prioritize Bearer token authentication before building native clients.",
            styles["Footer"],
        )
    )

    return story


def main():
    styles = build_styles()
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="Smart Healthcare - Project Description",
        author="HealthCare Platform",
    )
    story = build_story(styles)
    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    print(f"PDF created: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
