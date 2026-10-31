import SwiftUI

private struct TravelPersona {
    let title: String
    let icon: String
    let meta: String
    let fit: String
}

struct TripView: View {
    @EnvironmentObject private var model: AppModel
    @State private var expandedPlan = 0
    @State private var quizDays: String? = nil
    @State private var quizStyle: String? = nil
    @State private var quizTheme: String? = nil
    @State private var heroIndex = 0

    private let heroPhotos: [(image: String, name: String, credit: String)] = [
        ("today-hero", "Hall of Supreme Harmony", "Photo N509FZ / CC BY-SA 4.0"),
        ("hero-2", "Forbidden City from Jingshan", "Photo EditQ / CC BY-SA 4.0"),
        ("hero-3", "Houhai after dark", "Photo Morio / CC BY-SA 4.0"),
        ("hero-4", "Drum Tower, 17:30 stop", "Photo Marek Śliwecki / CC BY-SA 4.0"),
        ("hero-5", "Corner Tower in moonlight", "Photo Morio / CC BY-SA 4.0")
    ]

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 20) {
                    header
                    todaySection
                    quizSection
                    plansSection
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 130)
            }
            .onChange(of: answeredCount) { _, count in
                guard count == 3 else { return }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) {
                    withAnimation(.easeInOut(duration: 0.35)) {
                        proxy.scrollTo("quiz-result", anchor: .center)
                    }
                }
            }
        }
        #if DEBUG
        .onAppear {
            guard ProcessInfo.processInfo.arguments.contains("-quizdone") else { return }
            quizDays = quizDays ?? "4–5 days"
            quizStyle = quizStyle ?? "Food first"
            quizTheme = quizTheme ?? "Hutongs & coffee"
        }
        #endif
    }

    // MARK: Header

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Eyebrow(text: "MY TRIP / BEIJING")
                    DoodleView(kind: .sparkle, color: Palette.accent)
                        .frame(width: 9, height: 9)
                }
                HStack(alignment: .firstTextBaseline, spacing: 9) {
                    Text("Beijing")
                        .font(.system(size: 44, weight: .black))
                        .tracking(-1)
                        .foregroundStyle(Palette.ink)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                    TagView(text: "4 days · 3 nights", style: .accent)
                }
                Text("10/15 – 10/18 · 2 travelers")
                    .font(.system(size: 10.5, weight: .medium, design: .monospaced))
                    .foregroundStyle(Palette.ink2)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 8) {
                HStack(spacing: 7) {
                    IconCircleButton(icon: "bell", size: 36) {
                        model.openAssistant("Trip · Alerts & reminders")
                    }
                    .overlay(alignment: .topTrailing) {
                        Circle()
                            .fill(Palette.accent)
                            .frame(width: 8, height: 8)
                            .overlay(Circle().strokeBorder(Palette.paper, lineWidth: 1))
                            .offset(x: -3, y: 2)
                    }
                    AvatarView(name: "W", size: 36, fill: Palette.lime)
                }
                Text("Today · Day 1")
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundStyle(Palette.ink2)
            }
        }
    }

    // MARK: Today

    private var todaySection: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeading(title: "Today at a glance", index: "01", trailing: "10/15 · Wed")

            VStack(spacing: 0) {
                ZStack(alignment: .topLeading) {
                    TabView(selection: $heroIndex) {
                        ForEach(Array(heroPhotos.enumerated()), id: \.offset) { index, photo in
                            GeometryReader { geo in
                                Image(photo.image)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: geo.size.width, height: 196)
                                    .clipped()
                            }
                            .tag(index)
                        }
                    }
                    .tabViewStyle(.page(indexDisplayMode: .never))
                    .frame(height: 196)
                    .accessibilityLabel("Today's photos")
                    .accessibilityHint("Swipe left or right for more photos")

                    LinearGradient(
                        colors: [
                            Palette.ink.opacity(0.24),
                            .clear,
                            .clear,
                            Palette.ink.opacity(0.48)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 196)
                    .allowsHitTesting(false)

                    HStack(alignment: .top) {
                        HStack(spacing: 5) {
                            Image(systemName: "sun.max.fill")
                                .font(.system(size: 11))
                                .foregroundStyle(Palette.accent)
                            Text("22°")
                                .font(.system(size: 12, weight: .black))
                            Text("Clear · 11–22°")
                                .font(.system(size: 9.5, weight: .medium))
                                .opacity(0.7)
                        }
                        .foregroundStyle(Palette.ink)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 7)
                        .background(Capsule().fill(Palette.paper))
                        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.1))

                        Spacer()

                        TagView(text: "Day 1 of 4", style: .dark)
                    }
                    .padding(12)
                    .allowsHitTesting(false)

                    VStack {
                        Spacer()
                        HStack(alignment: .bottom) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(heroPhotos[heroIndex].name.uppercased())
                                    .font(.system(size: 8, weight: .heavy, design: .monospaced))
                                    .tracking(0.5)
                                    .foregroundStyle(Palette.paper)
                                Text(heroPhotos[heroIndex].credit.uppercased())
                                    .font(.system(size: 6.5, weight: .semibold, design: .monospaced))
                                    .tracking(0.4)
                                    .foregroundStyle(Palette.paper.opacity(0.74))
                            }
                            .shadow(color: Palette.ink.opacity(0.55), radius: 2, y: 1)

                            Spacer()

                            HStack(spacing: 6) {
                                Text("\(heroIndex + 1) / \(heroPhotos.count)")
                                    .font(.system(size: 7.5, weight: .bold, design: .monospaced))
                                    .foregroundStyle(Palette.paper.opacity(0.84))
                                    .shadow(color: Palette.ink.opacity(0.5), radius: 2, y: 1)
                                HStack(spacing: 3) {
                                    ForEach(heroPhotos.indices, id: \.self) { i in
                                        Capsule()
                                            .fill(i == heroIndex ? Palette.paper : Palette.paper.opacity(0.45))
                                            .frame(width: i == heroIndex ? 13 : 5, height: 5)
                                            .animation(.easeInOut(duration: 0.2), value: heroIndex)
                                    }
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 12)
                    .padding(.bottom, 9)
                    .frame(height: 196, alignment: .bottom)
                    .allowsHitTesting(false)
                }
                .frame(height: 196)
                .clipped()

                HStack(alignment: .center, spacing: 12) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Central Axis · Palace & hutongs")
                            .font(.system(size: 17, weight: .heavy))
                            .foregroundStyle(Palette.ink)
                        HStack(spacing: 12) {
                            Label("6 stops", systemImage: "mappin.and.ellipse")
                            Label("4.2 km", systemImage: "figure.walk")
                            Label("~5 hr", systemImage: "clock")
                        }
                        .font(.system(size: 9.5, weight: .semibold, design: .monospaced))
                        .foregroundStyle(Palette.ink2)
                    }
                    Spacer()
                    Button {
                        Haptics.tap()
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                            model.tab = .plan
                        }
                    } label: {
                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 14, weight: .black))
                            .foregroundStyle(Palette.ink)
                            .frame(width: 40, height: 40)
                            .background(Circle().fill(Palette.lime))
                            .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1.3))
                            .compositingGroup()
                            .shadow(color: Palette.ink.opacity(0.16), radius: 0, x: 0, y: 2)
                    }
                    .buttonStyle(PressableButtonStyle())
                }
                .padding(.horizontal, 15)
                .padding(.vertical, 14)
                .background(Palette.paper)

                Rectangle()
                    .fill(Palette.ink.opacity(0.9))
                    .frame(height: 1.1)

                HStack(spacing: 0) {
                    todayFact(icon: "ticket", title: "Forbidden City", detail: "09:00 · Meridian") {
                        model.openAssistant("Ticket · Forbidden City 10/15 09:00")
                    }
                    factDivider
                    todayFact(icon: "sun.max", title: "11° – 22°", detail: "11°C day–night") {
                        model.openAssistant("Weather · Beijing 10/15")
                    }
                    factDivider
                    todayFact(icon: "clock", title: "Sunset 17:18", detail: "Wanchun Pavilion") {
                        model.openAssistant("Trip · Sunset today 17:18")
                    }
                }
                .background(Palette.paperWarm)
            }
            .background(Palette.paper)
            .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 26, style: .continuous)
                    .strokeBorder(Palette.ink, lineWidth: 1.4)
            )
            .compositingGroup()
            .shadow(color: Palette.ink.opacity(0.15), radius: 0, x: 0, y: 4)
            .shadow(color: Palette.ink.opacity(0.06), radius: 18, x: 0, y: 12)
        }
    }

    private func todayFact(icon: String, title: String, detail: String, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.tap()
            action()
        } label: {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(Palette.ink)
                    .frame(width: 13)
                VStack(alignment: .leading, spacing: 1.5) {
                    Text(title)
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(Palette.ink)
                        .lineLimit(1)
                        .minimumScaleFactor(0.82)
                    Text(detail)
                        .font(.system(size: 7.5, weight: .medium, design: .monospaced))
                        .foregroundStyle(Palette.ink3)
                        .lineLimit(1)
                }
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 9)
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private var factDivider: some View {
        Rectangle()
            .fill(Palette.ink.opacity(0.16))
            .frame(width: 1, height: 28)
    }

    // MARK: Travel style check

    private var answeredCount: Int {
        [quizDays, quizStyle, quizTheme].compactMap { $0 }.count
    }

    private var quizPersona: TravelPersona? {
        guard let days = quizDays, let style = quizStyle, let theme = quizTheme else { return nil }
        let map: [String: (String, String)] = [
            "Slow culture": ("The Slow Culture Wanderer", "safari"),
            "Food first": ("The Table-First Wanderer", "fork.knife"),
            "Outdoors": ("The Open-Air Rambler", "figure.walk"),
            "Night owl": ("The After-Dark Flâneur", "star.fill")
        ]
        let base = map[style] ?? ("The Slow Culture Wanderer", "safari")
        let fit = (theme == "Imperial history" || theme == "Hutongs & coffee") ? "Central Axis" : "Imperial Gardens"
        return TravelPersona(title: base.0, icon: base.1, meta: "\(days) · \(style) · \(theme)", fit: fit)
    }

    private var quizSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeading(title: "Travel style check", index: "02", trailing: "\(answeredCount) / 3")

            VStack(alignment: .leading, spacing: 11) {
                HStack(spacing: 8) {
                    TagView(text: "Trip match", style: .accent)
                    Spacer()
                    if quizPersona == nil {
                        Text("Answer all three for your title")
                            .font(.system(size: 8, weight: .medium, design: .monospaced))
                            .foregroundStyle(Palette.ink3)
                    } else {
                        Button {
                            resetQuiz()
                        } label: {
                            HStack(spacing: 3) {
                                Text("Retake")
                                Image(systemName: "arrow.up.right")
                                    .font(.system(size: 6, weight: .black))
                            }
                            .font(.system(size: 8, weight: .bold, design: .monospaced))
                            .foregroundStyle(Palette.ink2)
                            .padding(.horizontal, 8)
                            .frame(height: 23)
                            .background(Capsule().fill(Palette.paper))
                            .overlay(Capsule().strokeBorder(Palette.ink.opacity(0.35), lineWidth: 0.9))
                        }
                        .buttonStyle(PressableButtonStyle(scale: 0.95))
                    }
                }

                if let persona = quizPersona {
                    personaBanner(persona)
                        .transition(.opacity)
                } else {
                    quizQuestion("How many days do you like?", options: ["2–3 days", "4–5 days", "6+ days"], selection: $quizDays)
                    quizQuestion("Your kind of holiday", options: ["Slow culture", "Food first", "Outdoors", "Night owl"], selection: $quizStyle)
                    quizQuestion("A theme, or none?", options: ["Imperial history", "Hutongs & coffee", "Art & design", "No theme"], selection: $quizTheme)

                    HStack(spacing: 5) {
                        Image(systemName: "info.circle")
                            .font(.system(size: 9, weight: .bold))
                        Text("Pick one per question — it only changes your suggestion, never the plan.")
                            .font(.system(size: 9, weight: .medium))
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .foregroundStyle(Palette.ink3)
                }
            }
            .padding(13)
            .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Palette.paper))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .strokeBorder(Palette.ink, lineWidth: 1.2)
            )
            .compositingGroup()
            .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2.5)
        }
    }

    private func personaBanner(_ persona: TravelPersona) -> some View {
        HStack(spacing: 9) {
            Image(systemName: persona.icon)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Palette.ink)
                .frame(width: 30, height: 30)
                .background(Circle().fill(Palette.lime))
                .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))
            VStack(alignment: .leading, spacing: 1) {
                Text("YOUR TRAVEL TITLE")
                    .font(.system(size: 7, weight: .bold, design: .monospaced))
                    .tracking(0.8)
                    .foregroundStyle(Palette.ink3)
                Text(persona.title)
                    .font(.system(size: 13, weight: .black))
                    .tracking(-0.2)
                    .foregroundStyle(Palette.ink)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                Text(persona.meta)
                    .font(.system(size: 8, weight: .semibold, design: .monospaced))
                    .foregroundStyle(Palette.ink2)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 4)
            Button {
                Haptics.tap()
                withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                    model.tab = .plan
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: "map")
                        .font(.system(size: 8, weight: .black))
                    Text(persona.fit)
                        .font(.system(size: 9.5, weight: .bold))
                }
                .foregroundStyle(Palette.paper)
                .padding(.horizontal, 10)
                .frame(height: 29)
                .background(Capsule().fill(Palette.ink))
            }
            .buttonStyle(PressableButtonStyle(scale: 0.95))
        }
        .padding(9)
        .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(Palette.paperWarm))
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Palette.ink.opacity(0.35), style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
        )
        .id("quiz-result")
    }

    private func resetQuiz() {
        Haptics.tap()
        withAnimation(.easeOut(duration: 0.2)) {
            quizDays = nil
            quizStyle = nil
            quizTheme = nil
        }
    }

    private func quizQuestion(_ label: String, options: [String], selection: Binding<String?>) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 11, weight: .bold))
                .foregroundStyle(Palette.ink)
            HStack(spacing: 5) {
                ForEach(options, id: \.self) { option in
                    let on = selection.wrappedValue == option
                    Button {
                        Haptics.tap()
                        withAnimation(.easeOut(duration: 0.18)) {
                            selection.wrappedValue = option
                        }
                    } label: {
                        Text(option)
                            .font(.system(size: 9.5, weight: .bold))
                            .lineLimit(1)
                            .minimumScaleFactor(0.68)
                            .padding(.horizontal, 6)
                            .frame(maxWidth: .infinity)
                            .frame(height: 28)
                            .background(Capsule().fill(on ? Palette.ink : Palette.paper))
                            .foregroundStyle(on ? Palette.paper : Palette.ink2)
                            .overlay(
                                Capsule().strokeBorder(on ? Palette.ink : Palette.ink.opacity(0.3), lineWidth: 1)
                            )
                    }
                    .buttonStyle(PressableButtonStyle(scale: 0.96))
                    .accessibilityLabel("\(label): \(option)")
                    .accessibilityAddTraits(on ? .isSelected : [])
                }
            }
        }
    }

    // MARK: Plans

    private var plansSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeading(title: "Your days", index: "03", trailing: "Ask Pico") {
                model.openAssistant("Trip · Adjust the plan")
            }

            VStack(spacing: 9) {
                ForEach(Array(tripPlanDays.enumerated()), id: \.element.id) { index, plan in
                    planCard(plan, index: index)
                }
            }
        }
    }

    private func planCard(_ plan: TripPlanDay, index: Int) -> some View {
        let expanded = expandedPlan == index
        return VStack(spacing: 0) {
            Button {
                Haptics.tap()
                withAnimation(.spring(response: 0.32, dampingFraction: 0.86)) {
                    expandedPlan = expanded ? -1 : index
                }
            } label: {
                HStack(spacing: 10) {
                    VStack(spacing: 2) {
                        Text(plan.date)
                            .font(.system(size: 16, weight: .black))
                            .tracking(-0.4)
                            .foregroundStyle(Palette.ink)
                        Text(plan.week)
                            .font(.system(size: 8.5, weight: .semibold, design: .monospaced))
                            .foregroundStyle(Palette.ink3)
                    }
                    .frame(width: 48)
                    .overlay(alignment: .trailing) {
                        Rectangle()
                            .fill(Palette.ink.opacity(0.16))
                            .frame(width: 1, height: 36)
                            .offset(x: 5)
                    }

                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 5) {
                            Text(String(format: "DAY %02d", plan.day))
                                .font(.system(size: 7.5, weight: .bold, design: .monospaced))
                                .tracking(1)
                                .foregroundStyle(Palette.ink3)
                            TagView(text: plan.tag, style: plan.tagStyle)
                        }
                        Text(plan.title)
                            .font(.system(size: 13.5, weight: .bold))
                            .tracking(-0.2)
                            .foregroundStyle(Palette.ink)
                            .lineLimit(1)
                            .minimumScaleFactor(0.85)
                        Text(plan.meta)
                            .font(.system(size: 8.5, weight: .medium, design: .monospaced))
                            .foregroundStyle(Palette.ink2)
                            .lineLimit(1)
                    }

                    Spacer(minLength: 4)

                    Image(systemName: "chevron.right")
                        .font(.system(size: 9, weight: .black))
                        .foregroundStyle(Palette.ink)
                        .frame(width: 26, height: 26)
                        .background(Circle().fill(expanded ? Palette.lime : Palette.paperWarm))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))
                        .rotationEffect(.degrees(expanded ? 90 : 0))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 11)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)

            if expanded {
                VStack(alignment: .leading, spacing: 8) {
                    VStack(spacing: 5) {
                        ForEach(plan.stops) { stop in
                            HStack(spacing: 7) {
                                Circle()
                                    .fill(Palette.accent)
                                    .frame(width: 5.5, height: 5.5)
                                    .overlay(Circle().strokeBorder(Palette.ink.opacity(0.55), lineWidth: 0.5))
                                Text(stop.name)
                                    .font(.system(size: 10.5, weight: .semibold))
                                    .foregroundStyle(Palette.ink)
                                Spacer(minLength: 6)
                                Text(stop.time)
                                    .font(.system(size: 8, weight: .semibold, design: .monospaced))
                                    .foregroundStyle(Palette.ink3)
                            }
                        }
                    }

                    Text(plan.note)
                        .font(.system(size: 9.5, weight: .medium))
                        .foregroundStyle(Palette.ink2)
                        .lineSpacing(2)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 7)
                        .background(RoundedRectangle(cornerRadius: 9, style: .continuous).fill(Palette.limeSoft))
                        .overlay(
                            RoundedRectangle(cornerRadius: 9, style: .continuous)
                                .strokeBorder(Palette.ink.opacity(0.24), lineWidth: 1)
                        )

                    HStack(spacing: 5) {
                        Button {
                            Haptics.tap()
                            withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                                model.tab = .plan
                            }
                        } label: {
                            HStack(spacing: 3) {
                                Text("Open map")
                                Image(systemName: "arrow.up.right")
                                    .font(.system(size: 8, weight: .black))
                            }
                            .font(.system(size: 9.5, weight: .bold))
                            .foregroundStyle(Palette.paper)
                            .padding(.horizontal, 10)
                            .frame(height: 27)
                            .background(Capsule().fill(Palette.ink))
                        }
                        .buttonStyle(PressableButtonStyle(scale: 0.96))

                        Button {
                            Haptics.tap()
                            model.openAssistant("Trip · \(plan.title)")
                        } label: {
                            HStack(spacing: 3) {
                                Text("Ask Pico")
                                Image(systemName: "sparkles")
                                    .font(.system(size: 8, weight: .black))
                            }
                            .font(.system(size: 9.5, weight: .bold))
                            .foregroundStyle(Palette.ink)
                            .padding(.horizontal, 10)
                            .frame(height: 27)
                            .background(Capsule().fill(Palette.paper))
                            .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1))
                        }
                        .buttonStyle(PressableButtonStyle(scale: 0.96))

                        Spacer(minLength: 0)

                        Text("\(plan.stops.count) stops")
                            .font(.system(size: 7.5, weight: .medium, design: .monospaced))
                            .foregroundStyle(Palette.ink3)
                    }
                }
                .padding(.horizontal, 12)
                .padding(.top, 9)
                .padding(.bottom, 11)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Palette.paperWarm)
                .overlay(alignment: .top) {
                    Rectangle()
                        .fill(Palette.ink.opacity(0.16))
                        .frame(height: 1)
                }
                .transition(.opacity)
            }
        }
        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Palette.paper))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .strokeBorder(Palette.ink, lineWidth: 1.2)
        )
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .compositingGroup()
        .shadow(color: Palette.ink.opacity(0.11), radius: 0, x: 0, y: 2.5)
    }
}

// MARK: - Trip plan data

private struct TripStop: Identifiable {
    let id = UUID()
    let name: String
    let time: String
}

private struct TripPlanDay: Identifiable {
    var id: String { date }
    let date: String
    let week: String
    let day: Int
    let title: String
    let meta: String
    let tag: String
    let tagStyle: TagStyle
    let stops: [TripStop]
    let note: String
}

private let tripPlanDays: [TripPlanDay] = [
    TripPlanDay(
        date: "10/15", week: "Wed", day: 1,
        title: "Central Axis · Palace & hutongs",
        meta: "6 stops · 4.2 km · ~5 hr",
        tag: "Today", tagStyle: .accent,
        stops: [
            TripStop(name: "Tiananmen Square", time: "09:00"),
            TripStop(name: "Forbidden City", time: "09:40"),
            TripStop(name: "Jingshan · Wanchun Pavilion", time: "12:30"),
            TripStop(name: "Shichahai", time: "15:00"),
            TripStop(name: "Nanluoguxiang", time: "16:30"),
            TripStop(name: "Drum & Bell Towers", time: "17:30")
        ],
        note: "Palace booked for 09:00 · in at Meridian Gate, out at Shenwu Gate"
    ),
    TripPlanDay(
        date: "10/16", week: "Thu", day: 2,
        title: "Great Wall day · Badaling",
        meta: "3 stops · private car · full day",
        tag: "Car booked", tagStyle: .blue,
        stops: [
            TripStop(name: "Hotel pickup", time: "07:30"),
            TripStop(name: "Badaling Great Wall", time: "09:00"),
            TripStop(name: "Olympic Forest Park", time: "16:30")
        ],
        note: "Bring your passport · windy up there, pack an extra layer"
    ),
    TripPlanDay(
        date: "10/17", week: "Fri", day: 3,
        title: "Imperial gardens · Palace & museum",
        meta: "4 stops · Metro Line 4 · ~8 hr",
        tag: "Tickets to book", tagStyle: .soft,
        stops: [
            TripStop(name: "Summer Palace", time: "09:00"),
            TripStop(name: "Lunch in Wudaokou", time: "12:30"),
            TripStop(name: "National Museum of China", time: "14:00"),
            TripStop(name: "Qianmen Street", time: "18:00")
        ],
        note: "The National Museum needs a real-name booking; bring your passport"
    ),
    TripPlanDay(
        date: "10/18", week: "Sat", day: 4,
        title: "Slow hutongs · departure",
        meta: "4 stops · 3.1 km walk · ~4 hr",
        tag: "Departure", tagStyle: .ok,
        stops: [
            TripStop(name: "Nanluoguxiang", time: "09:30"),
            TripStop(name: "Drum & Bell Towers", time: "11:00"),
            TripStop(name: "Daoxiangcun run", time: "13:00"),
            TripStop(name: "Beijing Capital Airport", time: "16:00")
        ],
        note: "Flight 18:40 · be at the airport 2.5 hr early"
    )
]
