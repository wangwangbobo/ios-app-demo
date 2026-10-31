import SwiftUI

struct AssistantView: View {
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    @FocusState private var composerFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            header

            ScrollViewReader { proxy in
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(model.chatMessages) { message in
                            messageRow(message)
                        }
                        if model.chatThinking {
                            thinkingRow
                        }
                        if model.chatMessages.count <= 1 {
                            VStack(spacing: 12) {
                                ZStack {
                                    Circle().fill(Palette.limeSoft)
                                        .frame(width: 64, height: 64)
                                    Circle().strokeBorder(Palette.ink.opacity(0.35), style: StrokeStyle(lineWidth: 1.2, dash: [4, 4]))
                                        .frame(width: 64, height: 64)
                                    Image(systemName: "sparkles")
                                        .font(.system(size: 23, weight: .semibold))
                                        .foregroundStyle(Palette.ink.opacity(0.7))
                                }
                                Text("Lucia has read your trip, the weather\nand 4,208 community routes")
                                    .font(.system(size: 10.5, weight: .medium, design: .monospaced))
                                    .foregroundStyle(Palette.ink3)
                                    .multilineTextAlignment(.center)
                                    .lineSpacing(4)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.top, 22)
                            .transition(.opacity)
                        }
                        Color.clear
                            .frame(height: 1)
                            .id("chat-bottom")
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 14)
                    .padding(.bottom, 10)
                }
                .onAppear {
                    proxy.scrollTo("chat-bottom", anchor: .bottom)
                }
                .onChange(of: model.chatMessages.count) { _, _ in
                    withAnimation(.easeOut(duration: 0.25)) {
                        proxy.scrollTo("chat-bottom", anchor: .bottom)
                    }
                }
                .onChange(of: model.chatThinking) { _, _ in
                    withAnimation(.easeOut(duration: 0.25)) {
                        proxy.scrollTo("chat-bottom", anchor: .bottom)
                    }
                }
            }

            composer
        }
        .background(Palette.bg.ignoresSafeArea())
        .onAppear {
            if model.chatMessages.isEmpty {
                model.seedAssistant()
            }
        }
    }

    // MARK: Header

    private var header: some View {
        VStack(spacing: 10) {
            Capsule()
                .fill(Palette.line)
                .frame(width: 36, height: 4)
                .padding(.top, 8)

            HStack(spacing: 10) {
                ZStack {
                    Circle().fill(Palette.lime)
                    Image(systemName: "sparkles")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Palette.ink)
                }
                .frame(width: 39, height: 39)
                .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1.2))

                VStack(alignment: .leading, spacing: 2) {
                    Text("Lucia")
                        .font(.system(size: 18, weight: .semibold, design: .serif))
                        .foregroundStyle(Palette.ink)
                    HStack(spacing: 4) {
                        Circle().fill(Palette.ok).frame(width: 5, height: 5)
                        Text("Looking at · \(model.assistantContext)")
                            .font(.system(size: 9, weight: .medium, design: .monospaced))
                            .foregroundStyle(Palette.ink3)
                            .lineLimit(1)
                            .minimumScaleFactor(0.8)
                    }
                }
                Spacer()
                Button {
                    model.resetChat()
                } label: {
                    Image(systemName: "arrow.counterclockwise")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(Palette.ink)
                        .frame(width: 33, height: 33)
                        .background(Circle().fill(Palette.paper))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1.1))
                }
                .buttonStyle(PressableButtonStyle())

                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 11, weight: .black))
                        .foregroundStyle(Palette.ink)
                        .frame(width: 33, height: 33)
                        .background(Circle().fill(Palette.paper))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1.1))
                }
                .buttonStyle(PressableButtonStyle())
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 10)
        .background(Palette.bg)
        .overlay(alignment: .bottom) {
            SoftDivider()
        }
    }

    // MARK: Messages

    private func messageRow(_ message: ChatMessage) -> some View {
        Group {
            if message.role == .assistant {
                HStack(alignment: .top, spacing: 8) {
                    ZStack {
                        Circle().fill(Palette.lime)
                        Image(systemName: "sparkles")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundStyle(Palette.ink)
                    }
                    .frame(width: 27, height: 27)
                    .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))

                    VStack(alignment: .leading, spacing: 9) {
                        Text(message.text)
                            .font(.system(size: 12))
                            .foregroundStyle(Palette.ink2)
                            .lineSpacing(3)
                            .fixedSize(horizontal: false, vertical: true)

                        if let card = message.card {
                            cardView(card)
                        }
                    }
                    .padding(12)
                    .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Palette.paper))
                    .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).strokeBorder(Palette.ink.opacity(0.7), lineWidth: 1.1))
                    .frame(maxWidth: .infinity, alignment: .leading)

                    Spacer(minLength: 18)
                }
            } else {
                HStack(alignment: .top, spacing: 8) {
                    Spacer(minLength: 46)
                    Text(message.text)
                        .font(.system(size: 12))
                        .foregroundStyle(Palette.paper)
                        .lineSpacing(2)
                        .padding(.horizontal, 13)
                        .padding(.vertical, 10)
                        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Palette.ink))
                        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1))
                }
            }
        }
    }

    private var thinkingRow: some View {
        HStack(spacing: 8) {
            ZStack {
                Circle().fill(Palette.lime)
                Image(systemName: "sparkles")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(Palette.ink)
            }
            .frame(width: 27, height: 27)
            .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))

            HStack(spacing: 6) {
                ProgressView()
                    .tint(Palette.ink3)
                    .scaleEffect(0.7)
                Text("Thinking…")
                    .font(.system(size: 10.5, weight: .medium, design: .monospaced))
                    .foregroundStyle(Palette.ink3)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 9)
            .background(Capsule().fill(Palette.paper))
            .overlay(Capsule().strokeBorder(Palette.ink.opacity(0.6), lineWidth: 1))

            Spacer()
        }
    }

    // MARK: Cards

    @ViewBuilder
    private func cardView(_ kind: AssistantCardKind) -> some View {
        switch kind {
        case .ticket:
            ticketCard
        case .hotels:
            hotelsCard
        case .checklist:
            checklistCard
        case .route:
            routeCard
        case .translate:
            translateCard
        }
    }

    private var ticketCard: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack(spacing: 8) {
                IconBadge(icon: "building.columns", tint: Palette.accent, background: Palette.accentSoft.opacity(0.6), size: 32)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Forbidden City")
                        .font(.system(size: 11.5, weight: .semibold))
                        .foregroundStyle(Palette.ink)
                    Text("10/15 09:00 · 2 adults")
                        .font(.system(size: 9.5))
                        .foregroundStyle(Palette.ink3)
                }
                Spacer()
                Text("¥120")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Palette.ink)
            }
            HStack(spacing: 5) {
                TagView(text: "812 left", style: .warn)
                TagView(text: "ID required", style: .neutral)
                TagView(text: "Scan ID to enter", style: .soft)
            }
            Button {
                model.bookForbiddenCity()
                confirm("Seats locked for 10/15 09:00 — 2 adults. Your QR code is in Me · Bookings.")
            } label: {
                Text("Lock seats")
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(Palette.paper)
                    .frame(maxWidth: .infinity)
                    .frame(height: 32)
                    .background(Capsule().fill(Palette.ink))
            }
            .buttonStyle(PressableButtonStyle())
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.paperWarm))
        .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous).strokeBorder(Palette.ink.opacity(0.3), lineWidth: 1))
    }

    private var hotelsCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            hotelRow(title: "Wangfujing", price: "From ¥680", note: "12 min walk to the Forbidden City", recommended: true)
            SoftDivider()
            hotelRow(title: "Nanluoguxiang", price: "From ¥520", note: "In the hutongs · quiet at night", recommended: false)
            SoftDivider()
            hotelRow(title: "Guomao", price: "From ¥760", note: "Direct metro · good for business", recommended: false)
            Button {
                model.addToChecklist(title: "Hotel · Wangfujing", meta: "10/15–18 · 3 nights · Breakfast", category: .docs, phase: .before)
                confirm("Wangfujing, 3 nights, added to your prep list.")
            } label: {
                Text("Stay in Wangfujing")
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(Palette.paper)
                    .frame(maxWidth: .infinity)
                    .frame(height: 32)
                    .background(Capsule().fill(Palette.ink))
            }
            .buttonStyle(PressableButtonStyle())
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.paperWarm))
        .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous).strokeBorder(Palette.ink.opacity(0.3), lineWidth: 1))
    }

    private func hotelRow(title: String, price: String, note: String, recommended: Bool) -> some View {
        HStack(spacing: 8) {
            Image(systemName: recommended ? "star.fill" : "circle")
                .font(.system(size: 8, weight: .semibold))
                .foregroundStyle(recommended ? Palette.accent : Palette.ink3)
            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(Palette.ink)
                Text(note)
                    .font(.system(size: 9))
                    .foregroundStyle(Palette.ink3)
            }
            Spacer()
            Text(price)
                .font(.system(size: 9.5, weight: .medium))
                .foregroundStyle(Palette.ink2)
        }
    }

    private var checklistCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            checkRow(title: "eSIM / Chinese number", meta: "3 plans compared · From ¥29")
            SoftDivider()
            checkRow(title: "Install a VPN", meta: "Not on China's app stores")
            SoftDivider()
            checkRow(title: "Forbidden City tickets", meta: "10/15 09:00 · 812 left")
            Button {
                model.addToChecklist(title: "eSIM / Chinese number", meta: "3 plans compared · From ¥29", category: .connectivity, phase: .arrival)
                model.addToChecklist(title: "Install a VPN", meta: "Set up before you fly · Works on arrival", category: .connectivity, phase: .arrival)
                model.addToChecklist(title: "Forbidden City tickets · 10/15", meta: "2 adults · ID booking", category: .tickets, phase: .before)
                confirm("3 items added to your prep list — tick them off under Trip.")
            } label: {
                Text("Add all to list")
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(Palette.paper)
                    .frame(maxWidth: .infinity)
                    .frame(height: 32)
                    .background(Capsule().fill(Palette.ink))
            }
            .buttonStyle(PressableButtonStyle())
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.paperWarm))
        .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous).strokeBorder(Palette.ink.opacity(0.3), lineWidth: 1))
    }

    private func checkRow(title: String, meta: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: "circle.dashed")
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(Palette.accent)
            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.system(size: 10.5, weight: .medium))
                    .foregroundStyle(Palette.ink)
                Text(meta)
                    .font(.system(size: 9))
                    .foregroundStyle(Palette.ink3)
            }
            Spacer()
        }
    }

    private var routeCard: some View {
        VStack(alignment: .leading, spacing: 9) {
            MiniRouteMap(points: model.stops.map { CGPoint(x: $0.x, y: $0.y) })
                .frame(height: 96)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))

            HStack(spacing: 5) {
                TagView(text: "1.2 km less", style: .accent)
                TagView(text: "6 stops", style: .neutral)
                TagView(text: "~5 hr", style: .neutral)
            }
            Text("Tiananmen Square → Forbidden City → Shichahai → Jingshan → Nanluoguxiang → Drum & Bell Towers")
                .font(.system(size: 10))
                .foregroundStyle(Palette.ink2)
                .lineSpacing(2)

            Button {
                model.applyRouteSuggestion()
                model.tab = .plan
                confirm("New order applied — 1.2 km shorter. The map is updated.")
            } label: {
                Text("Apply changes")
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(Palette.paper)
                    .frame(maxWidth: .infinity)
                    .frame(height: 32)
                    .background(Capsule().fill(Palette.ink))
            }
            .buttonStyle(PressableButtonStyle())
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.paperWarm))
        .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous).strokeBorder(Palette.ink.opacity(0.3), lineWidth: 1))
    }

    private var translateCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("我食物过敏，需要去医院。")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(Palette.ink)
            Text("I have a food allergy and need a hospital.")
                .font(.system(size: 9.5))
                .foregroundStyle(Palette.ink3)

            HStack(spacing: 8) {
                Button {
                    SpeechService.shared.speak("我食物过敏，需要去医院。")
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "speaker.wave.2.fill")
                            .font(.system(size: 9, weight: .semibold))
                        Text("Play")
                            .font(.system(size: 10, weight: .medium))
                    }
                    .foregroundStyle(Palette.ink)
                    .frame(maxWidth: .infinity)
                    .frame(height: 31)
                    .background(Capsule().fill(Palette.paper))
                    .overlay(Capsule().strokeBorder(Palette.line, lineWidth: 0.8))
                }
                .buttonStyle(PressableButtonStyle())

                Button {
                    model.translateMode = .offline
                    model.scenario = .medical
                    model.tab = .translate
                    dismiss()
                } label: {
                    Text("Open phrase pack")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundStyle(Palette.paper)
                        .frame(maxWidth: .infinity)
                        .frame(height: 31)
                        .background(Capsule().fill(Palette.ink))
                }
                .buttonStyle(PressableButtonStyle())
            }
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.paperWarm))
        .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous).strokeBorder(Palette.ink.opacity(0.3), lineWidth: 1))
    }

    // MARK: Composer

    private var composer: some View {
        VStack(spacing: 9) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(model.quickPrompts, id: \.self) { prompt in
                        Button {
                            composerFocused = false
                            model.sendChat(prompt)
                        } label: {
                            Text(prompt)
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundStyle(Palette.ink)
                                .padding(.horizontal, 11)
                                .frame(height: 30)
                                .background(Capsule().fill(Palette.paper))
                                .overlay(Capsule().strokeBorder(Palette.ink.opacity(0.65), lineWidth: 1))
                        }
                        .buttonStyle(PressableButtonStyle(scale: 0.96))
                    }
                }
                .padding(.horizontal, 16)
            }

            HStack(spacing: 8) {
                HStack(spacing: 7) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(Palette.ink2)
                    TextField("Ask Lucia, e.g. “Any breakfast spots nearby?”", text: $model.chatDraft)
                        .font(.system(size: 12))
                        .textFieldStyle(.plain)
                        .focused($composerFocused)
                        .submitLabel(.send)
                        .onSubmit(send)
                }
                .padding(.horizontal, 13)
                .frame(height: 43)
                .background(Capsule().fill(Palette.paper))
                .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.1))

                Button(action: send) {
                    Image(systemName: "arrow.up")
                        .font(.system(size: 13, weight: .black))
                        .foregroundStyle(Palette.ink)
                        .frame(width: 43, height: 43)
                        .background(Circle().fill(Palette.lime))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1.2))
                }
                .buttonStyle(PressableButtonStyle())
                .opacity(model.chatDraft.trimmingCharacters(in: .whitespaces).isEmpty ? 0.55 : 1)
            }
            .padding(.horizontal, 16)
        }
        .padding(.top, 9)
        .padding(.bottom, 10)
        .background(Palette.bg)
        .overlay(alignment: .top) {
            SoftDivider()
        }
    }

    private func send() {
        let text = model.chatDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        composerFocused = false
        model.sendChat(text)
    }

    private func confirm(_ text: String) {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.86)) {
            model.chatMessages.append(ChatMessage(role: .assistant, text: text))
        }
        Haptics.success()
    }
}
