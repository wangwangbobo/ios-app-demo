import SwiftUI

enum LegalKind: String, Identifiable {
    case privacy, terms
    var id: String { rawValue }
    var title: String { self == .privacy ? "Privacy policy" : "Terms of service" }
}

struct MeView: View {
    @EnvironmentObject private var model: AppModel
    @State private var legal: LegalKind? = nil
    @State private var externalOpen = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                header
                statsCard
                tripCard
                reservationsSection
                servicesSection
                externalSection
                settingsSection
                legalSection
                footer
            }
            .padding(.horizontal, 20)
            .padding(.top, 10)
            .padding(.bottom, 130)
        }
        .sheet(item: $legal) { kind in
            LegalSheet(kind: kind)
                .presentationDetents([.medium, .large])
                .presentationCornerRadius(28)
                .presentationBackground(Palette.bg)
        }
    }

    // MARK: Header

    private var header: some View {
        HStack(alignment: .center, spacing: 14) {
            ZStack {
                Circle()
                    .fill(Palette.lime)
                    .frame(width: 64, height: 64)
                Text("W")
                    .font(.system(size: 27, weight: .semibold, design: .serif))
                    .foregroundStyle(Palette.ink)
                Circle()
                    .strokeBorder(Palette.ink, lineWidth: 1.4)
                    .frame(width: 64, height: 64)
            }
            .compositingGroup()
            .shadow(color: Palette.ink.opacity(0.12), radius: 0, x: 0, y: 3)

            VStack(alignment: .leading, spacing: 5) {
                Eyebrow(text: "ME / PROFILE")
                Text("Wang Bo")
                    .font(.system(size: 31, weight: .black))
                    .tracking(-0.5)
                    .foregroundStyle(Palette.ink)
                HStack(spacing: 5) {
                    TagView(text: "RoamChina member", style: .accent)
                    TagView(text: "12th city", style: .soft)
                }
            }
            Spacer()
            IconCircleButton(icon: "gearshape", size: 37) {
                model.openAssistant("Me · Settings & preferences")
            }
        }
    }

    private var statsCard: some View {
        HStack(spacing: 8) {
            statBlock(value: "12", label: "Cities visited", fill: Palette.mustardSoft)
            statBlock(value: "46", label: "Saved places", fill: Palette.pinkSoft)
            statBlock(value: "3", label: "Shared routes", fill: Palette.mintSoft)
        }
    }

    private func statBlock(value: String, label: String, fill: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value)
                .font(.system(size: 34, weight: .black).width(.condensed))
                .foregroundStyle(Palette.ink)
            Text(label)
                .font(.system(size: 9, weight: .semibold, design: .monospaced))
                .foregroundStyle(Palette.ink2)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 13)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(RoundedRectangle(cornerRadius: 17, style: .continuous).fill(fill))
        .overlay(RoundedRectangle(cornerRadius: 17, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.2))
        .compositingGroup()
        .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2.5)
    }

    // MARK: Current trip

    private var tripCard: some View {
        ZStack(alignment: .topTrailing) {
            Circle()
                .fill(Palette.lime.opacity(0.18))
                .frame(width: 220, height: 220)
                .offset(x: 84, y: -100)

            DoodleView(kind: .sparkle, color: Palette.paper.opacity(0.5))
                .frame(width: 26, height: 26)
                .offset(x: -78, y: 92)

            VStack(alignment: .leading, spacing: 11) {
                HStack {
                    TagView(text: "Leaves in 3 days", style: .accent)
                    Spacer()
                    Text("10/15 – 10/18")
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundStyle(Palette.paper.opacity(0.55))
                }
                Text("Beijing · 4 days, 3 nights")
                    .font(.system(size: 27, weight: .black))
                    .tracking(-0.4)
                    .foregroundStyle(Palette.paper)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
                Text("Wangfujing · 2 adults · Central Axis, slowly")
                    .font(.system(size: 9.5, weight: .medium, design: .monospaced))
                    .foregroundStyle(Palette.paper.opacity(0.55))

                HStack(spacing: 8) {
                    AvatarStack(names: ["L", "Z"], size: 22)
                    Text("With Lina & Zhou")
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(Palette.paper.opacity(0.5))
                    Spacer()
                    Button {
                        Haptics.tap()
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                            model.tab = .trip
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Text("View trip")
                                .font(.system(size: 10, weight: .bold))
                            Image(systemName: "arrow.right")
                                .font(.system(size: 8, weight: .black))
                        }
                        .foregroundStyle(Palette.ink)
                        .padding(.horizontal, 12)
                        .frame(height: 30)
                        .background(Capsule().fill(Palette.lime))
                        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1))
                    }
                    .buttonStyle(PressableButtonStyle())
                }
                .padding(.top, 2)

                HStack(spacing: 8) {
                    Button {
                        model.checklistOpen = true
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: "checklist")
                                .font(.system(size: 9, weight: .bold))
                            Text("Prep \(model.doneCount)/\(model.totalCount)")
                                .font(.system(size: 9.5, weight: .semibold))
                        }
                        .foregroundStyle(Palette.paper.opacity(0.85))
                        .padding(.horizontal, 10)
                        .frame(height: 28)
                        .background(Capsule().fill(Palette.paper.opacity(0.14)))
                        .overlay(Capsule().strokeBorder(Palette.paper.opacity(0.2), lineWidth: 0.8))
                    }
                    .buttonStyle(PressableButtonStyle())

                    Button {
                        model.tab = .plan
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: "map")
                                .font(.system(size: 9, weight: .bold))
                            Text("Open route")
                                .font(.system(size: 9.5, weight: .semibold))
                        }
                        .foregroundStyle(Palette.paper.opacity(0.85))
                        .padding(.horizontal, 10)
                        .frame(height: 28)
                        .background(Capsule().fill(Palette.paper.opacity(0.14)))
                        .overlay(Capsule().strokeBorder(Palette.paper.opacity(0.2), lineWidth: 0.8))
                    }
                    .buttonStyle(PressableButtonStyle())
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(RoundedRectangle(cornerRadius: 26, style: .continuous).fill(Palette.ink))
        .overlay(RoundedRectangle(cornerRadius: 26, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.4))
        .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        .compositingGroup()
        .shadow(color: Palette.ink.opacity(0.16), radius: 0, x: 0, y: 4)
    }

    // MARK: Attraction reservations

    private var reservationsSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            SectionHeading(
                title: "Attraction bookings",
                index: "01",
                trailing: "\(model.bookedAttractionCount)/\(model.attractions.count) booked"
            )

            VStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 7) {
                    HStack(alignment: .firstTextBaseline) {
                        Text("\(model.bookedAttractionCount) / \(model.attractions.count)")
                            .font(.system(size: 25, weight: .black).width(.condensed))
                            .foregroundStyle(Palette.ink)
                        Text("sights booked")
                            .font(.system(size: 9.5, weight: .semibold))
                            .foregroundStyle(Palette.ink2)
                        Spacer()
                        Text("\(Int(model.attractionProgress * 100))%")
                            .font(.system(size: 10, weight: .bold, design: .monospaced))
                            .foregroundStyle(Palette.ink2)
                    }
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Capsule().fill(Palette.cream)
                            Capsule()
                                .fill(Palette.lime)
                                .frame(width: max(6, geo.size.width * CGFloat(model.attractionProgress)))
                        }
                    }
                    .frame(height: 8)
                    .overlay(Capsule().strokeBorder(Palette.ink.opacity(0.25), lineWidth: 0.8))
                }
                .padding(.top, 10)
                .padding(.bottom, 7)

                SoftDivider()

                ForEach(Array(model.attractions.enumerated()), id: \.element.id) { index, attraction in
                    attractionRow(attraction)
                    if index != model.attractions.count - 1 {
                        SoftDivider().padding(.leading, 50)
                    }
                }

                Button {
                    if model.pendingAttractions.isEmpty {
                        model.toast("All sights booked · Passes ready", icon: "checkmark.seal.fill")
                    } else {
                        model.bookAllAttractions()
                    }
                } label: {
                    HStack(spacing: 5) {
                        Image(systemName: model.pendingAttractions.isEmpty ? "checkmark.seal.fill" : "ticket.fill")
                            .font(.system(size: 10, weight: .bold))
                        Text(model.pendingAttractions.isEmpty
                             ? "All sights booked · View passes"
                             : "Book remaining \(model.pendingAttractions.count) sights")
                            .font(.system(size: 11.5, weight: .bold))
                    }
                    .foregroundStyle(model.pendingAttractions.isEmpty ? Palette.ink2 : Palette.ink)
                    .frame(maxWidth: .infinity)
                    .frame(height: 40)
                    .background(Capsule().fill(model.pendingAttractions.isEmpty ? Palette.paperWarm : Palette.lime))
                    .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.1))
                }
                .buttonStyle(PressableButtonStyle())
                .padding(.vertical, 10)

                HStack(spacing: 5) {
                    Image(systemName: "info.circle")
                        .font(.system(size: 9, weight: .bold))
                    Text("Show your pass at the gate and scan your ID to enter.")
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(Palette.ink3)
                    Spacer(minLength: 0)
                }
            }
            .padding(.horizontal, 13)
            .padding(.vertical, 4)
            .background(RoundedRectangle(cornerRadius: 21, style: .continuous).fill(Palette.paper))
            .overlay(RoundedRectangle(cornerRadius: 21, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.2))
            .compositingGroup()
            .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2.5)
        }
    }

    private func attractionRow(_ attraction: AttractionBooking) -> some View {
        Button {
            if attraction.booked {
                model.toast("Pass \(attraction.code ?? "ready") · Scan ID at the gate", icon: "ticket.fill")
            } else {
                model.bookAttraction(attraction)
            }
        } label: {
            HStack(spacing: 10) {
                IconBadge(icon: attraction.symbol, tint: Palette.ink, background: attractionFill(attraction.tint), size: 37)

                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 5) {
                        Text(attraction.title)
                            .font(.system(size: 12.5, weight: .bold))
                            .foregroundStyle(Palette.ink)
                        if attraction.booked {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundStyle(Palette.ok)
                        }
                    }
                    Text("\(attraction.date) · \(attraction.time)")
                        .font(.system(size: 9, weight: .medium, design: .monospaced))
                        .foregroundStyle(Palette.ink3)
                    Text(attraction.price)
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(Palette.ink2)
                }

                Spacer(minLength: 4)

                if attraction.booked {
                    TagView(text: "Booked", style: .ok)
                } else {
                    Text("Book")
                        .font(.system(size: 9.5, weight: .bold))
                        .foregroundStyle(Palette.ink)
                        .padding(.horizontal, 11)
                        .frame(height: 29)
                        .background(Capsule().fill(Palette.lime))
                        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1))
                }
            }
            .padding(.vertical, 9)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func attractionFill(_ tint: Int) -> Color {
        [Palette.pinkSoft, Palette.skySoft, Palette.mintSoft, Palette.mustardSoft, Palette.periwinkleSoft, Palette.limeSoft][tint % 6]
    }

    // MARK: Services

    private var servicesSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            SectionHeading(title: "Trip services", index: "02")
            VStack(spacing: 0) {
                serviceRow(icon: "waveform", tint: Palette.lime, title: "Offline phrase pack", detail: "Beijing · 86 phrases · 4.2 MB") {
                    model.translateMode = .offline
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                        model.tab = .translate
                    }
                }
                SoftDivider().padding(.leading, 50)
                serviceRow(icon: "doc.richtext", tint: Palette.periwinkle, title: "Export trip", detail: "PDF / link · With map") {
                    model.toast("PDF trip created", icon: "doc.richtext.fill")
                }
                SoftDivider().padding(.leading, 50)
                serviceRow(icon: "phone.badge.waveform", tint: Palette.pink, title: "Emergency contacts", detail: "120 / 110 · 24h Chinese support") {
                    model.translateMode = .offline
                    model.scenario = .emergency
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                        model.tab = .translate
                    }
                }
                SoftDivider().padding(.leading, 50)
                serviceRow(icon: "questionmark.bubble", tint: Palette.mustard, title: "Help & feedback", detail: "FAQs · Chat with Pico") {
                    model.openAssistant("Me · Help & feedback")
                }
            }
            .padding(.horizontal, 13)
            .padding(.vertical, 4)
            .background(RoundedRectangle(cornerRadius: 21, style: .continuous).fill(Palette.paper))
            .overlay(RoundedRectangle(cornerRadius: 21, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.2))
            .compositingGroup()
            .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2.5)
        }
    }

    private func serviceRow(icon: String, tint: Color, title: String, detail: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 10) {
                IconBadge(icon: icon, tint: Palette.ink, background: tint, size: 37)
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(.system(size: 12.5, weight: .bold))
                        .foregroundStyle(Palette.ink)
                    Text(detail)
                        .font(.system(size: 9.5, weight: .medium))
                        .foregroundStyle(Palette.ink3)
                }
                Spacer(minLength: 4)
                Image(systemName: "chevron.right")
                    .font(.system(size: 9, weight: .black))
                    .foregroundStyle(Palette.ink2)
            }
            .padding(.vertical, 9)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    // MARK: External info

    private var externalSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            SectionHeading(title: "External info", index: "03", trailing: "Optional")

            VStack(spacing: 0) {
                Button {
                    Haptics.tap()
                    withAnimation(.spring(response: 0.36, dampingFraction: 0.86)) {
                        externalOpen.toggle()
                    }
                } label: {
                    HStack(spacing: 10) {
                        IconBadge(icon: "link", tint: Palette.ink2, background: Palette.cream, size: 34)
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Flights & hotels")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundStyle(Palette.ink2)
                            Text("Synced externally · Reference only, trip unchanged")
                                .font(.system(size: 9, weight: .medium))
                                .foregroundStyle(Palette.ink3)
                        }
                        Spacer(minLength: 4)
                        TagView(text: "Synced", style: .soft)
                        Image(systemName: "chevron.down")
                            .font(.system(size: 9, weight: .black))
                            .foregroundStyle(Palette.ink3)
                            .rotationEffect(.degrees(externalOpen ? 180 : 0))
                    }
                    .padding(.vertical, 10)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if externalOpen {
                    SoftDivider().padding(.leading, 50)

                    externalRow(icon: "airplane", title: "Air China CA182", detail: "10/15 08:45 → 11:20 · Capital T3", status: "Ticketed") {
                        model.toast("Flight details opened", icon: "airplane")
                    }
                    SoftDivider().padding(.leading, 50)
                    externalRow(icon: "building.2", title: "Mandarin Oriental Wangfujing", detail: "10/15 – 10/18 · 3 nights · King room", status: "Confirmed") {
                        model.toast("Hotel confirmation opened", icon: "building.2.fill")
                    }

                    Text("From airline and hotel confirmations · Reference only; not used for alerts or bookings.")
                        .font(.system(size: 8.5, weight: .medium))
                        .foregroundStyle(Palette.ink3)
                        .padding(.vertical, 9)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding(.horizontal, 13)
            .padding(.vertical, 2)
            .background(RoundedRectangle(cornerRadius: 21, style: .continuous).fill(Palette.paperWarm))
            .dashedBorder(color: Palette.ink.opacity(0.4), radius: 21)
        }
    }

    private func externalRow(icon: String, title: String, detail: String, status: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 10) {
                IconBadge(icon: icon, tint: Palette.ink3, background: Palette.cream, size: 33)
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(.system(size: 11.5, weight: .semibold))
                        .foregroundStyle(Palette.ink2)
                    Text(detail)
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(Palette.ink3)
                }
                Spacer(minLength: 4)
                TagView(text: status, style: .soft)
            }
            .padding(.vertical, 8)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    // MARK: Settings

    private var settingsSection: some View {
        VStack(alignment: .leading, spacing: 9) {
            SectionHeading(title: "Notifications & preferences", index: "04")
            VStack(spacing: 0) {
                HStack(spacing: 10) {
                    IconBadge(icon: "bell", tint: Palette.ink, background: Palette.accentSoft, size: 37)
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Notifications & Live Activities")
                            .font(.system(size: 12.5, weight: .bold))
                            .foregroundStyle(Palette.ink)
                        Text("Flight, ticket and nearby event alerts")
                            .font(.system(size: 9.5, weight: .medium))
                            .foregroundStyle(Palette.ink3)
                    }
                    Spacer(minLength: 4)
                    Toggle("", isOn: $model.notificationsOn)
                        .labelsHidden()
                        .tint(Palette.ink)
                        .scaleEffect(0.82)
                }
                .padding(.vertical, 9)

                SoftDivider().padding(.leading, 50)

                HStack(spacing: 10) {
                    IconBadge(icon: "globe.asia.australia", tint: Palette.ink, background: Palette.periwinkleSoft, size: 37)
                    Text("Language")
                        .font(.system(size: 12.5, weight: .bold))
                        .foregroundStyle(Palette.ink)
                    Spacer()
                    Text("English")
                        .font(.system(size: 10, weight: .medium, design: .monospaced))
                        .foregroundStyle(Palette.ink2)
                }
                .padding(.vertical, 9)
            }
            .padding(.horizontal, 13)
            .padding(.vertical, 4)
            .background(RoundedRectangle(cornerRadius: 21, style: .continuous).fill(Palette.paper))
            .overlay(RoundedRectangle(cornerRadius: 21, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.2))
            .compositingGroup()
            .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2.5)
        }
    }

    // MARK: Legal

    private var legalSection: some View {
        VStack(spacing: 0) {
            legalRow(title: "Privacy policy") { legal = .privacy }
            SoftDivider().padding(.leading, 16)
            legalRow(title: "Terms of service") { legal = .terms }
        }
        .padding(.horizontal, 13)
        .background(RoundedRectangle(cornerRadius: 19, style: .continuous).fill(Palette.paper))
        .overlay(RoundedRectangle(cornerRadius: 19, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.1))
    }

    private func legalRow(title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Text(title)
                    .font(.system(size: 11.5, weight: .medium))
                    .foregroundStyle(Palette.ink2)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 9, weight: .black))
                    .foregroundStyle(Palette.ink2)
            }
            .padding(.vertical, 12)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private var footer: some View {
        VStack(spacing: 6) {
            DoodleView(kind: .squiggle, color: Palette.ink.opacity(0.28), lineWidth: 1.2)
                .frame(width: 40, height: 9)
            Text("RoamChina · v1.0")
                .font(.system(size: 9.5, weight: .bold, design: .monospaced))
                .foregroundStyle(Palette.ink3)
            Text("Made for slow travel · In Beijing")
                .font(.system(size: 10.5, weight: .medium, design: .serif).italic())
                .foregroundStyle(Palette.ink3.opacity(0.9))
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 10)
        .padding(.bottom, 4)
    }
}
