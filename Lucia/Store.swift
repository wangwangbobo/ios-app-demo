import SwiftUI
import AVFoundation

@MainActor
final class AppModel: ObservableObject {

    // MARK: Navigation
    @Published var tab: Tab = .trip
    @Published var checklistOpen = false
    @Published var assistantOpen = false
    @Published var assistantContext = Tab.trip.assistantContext
    @Published var notesOpen = false

    // MARK: Trip
    @Published var reminderDismissed = false
    @Published var checklist: [ChecklistItem]
    @Published var toast: Toast?

    // MARK: Plan
    @Published var routeName = "Central Axis · Draft"
    @Published var stops: [RouteStop]
    @Published var selectedStopID: UUID?
    @Published var layer: MapLayer = .mine
    @Published var aiSuggestionVisible = true
    @Published var routeApplied = false
    @Published var mapEditMode = false

    // MARK: Forum
    @Published var forumFilter: ForumFilter = .all
    @Published var forumSearch = ""
    @Published var joinedEvent = false
    @Published var joinedEventIDs: Set<UUID> = []
    @Published var savedPlaces: Set<UUID> = []
    @Published var savedPostIDs: Set<UUID> = []
    @Published var localEvents: [LocalEvent]
    @Published var forumPosts: [ForumPost]

    // MARK: Translate
    @Published var translateMode: TranslateMode = .live
    @Published var scenario: Scenario = .medical
    @Published var liveMessages: [LiveMessage]
    @Published var listening = false
    @Published var languageFlipped = false
    @Published var photoSample: PhotoSample = .menu
    @Published var photoScanning = false
    @Published var photoScanned = false

    // MARK: Me
    @Published var notificationsOn = true
    @Published var attractions: [AttractionBooking]

    // MARK: Chat
    @Published var chatMessages: [ChatMessage] = []
    @Published var chatDraft = ""
    @Published var chatThinking = false

    // MARK: Static demo content
    let forumRoutes: [ForumRoute] = [
        ForumRoute(title: "Two days in the hutongs · 8 stops", author: "@Lina", meta: "4.8 · 1.2k saves", tags: ["Easy", "Coffee", "Photo spots"], stops: 8, distance: "6.4 km", likes: "1.2k"),
        ForumRoute(title: "Central Axis · Half day", author: "@Ken", meta: "4.9 · 2.1k saves", tags: ["Classic", "Walk", "Sunset"], stops: 6, distance: "4.2 km", likes: "2.1k"),
        ForumRoute(title: "Drum Tower to Houhai · After dark", author: "@Zhe", meta: "4.7 · 968 saves", tags: ["Night", "Bars", "Easy"], stops: 5, distance: "3.8 km", likes: "968")
    ]

    let forumPlaces: [ForumPlace] = [
        ForumPlace(title: "Siji Minfu · Forbidden City", subtitle: "Arrive before 11:00 · Peking duck", price: "¥150", tags: ["Family", "Local favorite"], kind: .restaurant, likes: "2.3k", symbol: "fork.knife", tint: 0, heat: 96, area: "Dongcheng · Forbidden City", note: "After 3pm there's barely a wait, and the skin stays crisp.", bestTime: "Before 11:00 / after 15:00"),
        ForumPlace(title: "Man Heng Ji · Niujie", subtitle: "Hand-cut lamb · copper-pot hotpot", price: "¥95", tags: ["Local", "Queue"], kind: .restaurant, likes: "1.9k", symbol: "flame", tint: 6, heat: 93, area: "Xicheng · Niujie", note: "Hand-cut lamb with sesame dip — even locals happily queue.", bestTime: "Take a number before 17:00"),
        ForumPlace(title: "Pangmei Noodles · Beixinqiao", subtitle: "Chongqing noodles · crispy pork", price: "¥45", tags: ["Local", "Quick bite"], kind: .restaurant, likes: "886", symbol: "takeoutbag.and.cup.and.straw", tint: 1, heat: 88, area: "Dongcheng · Beixinqiao", note: "Ask for mild heat; the crispy pork is best fresh from the wok.", bestTime: "Weekdays 14:00"),
        ForumPlace(title: "Metal Hands · Qianmen", subtitle: "Hutong coffee · house roast", price: "¥45", tags: ["Coffee", "Quiet"], kind: .restaurant, likes: "1.1k", symbol: "cup.and.saucer.fill", tint: 5, heat: 81, area: "Dongcheng · Qianmen", note: "A quiet café down a side lane, best light in the afternoon.", bestTime: "15:00–17:00"),
        ForumPlace(title: "Daoxiangcun · Local gifts", subtitle: "Skip the gift boxes · 8 picks", price: "¥50–120", tags: ["Gifts", "Check-in"], kind: .gift, likes: "1.7k", symbol: "gift", tint: 2, heat: 86, area: "Branches citywide", note: "Loose pastries beat the gift boxes — check the date.", bestTime: "Morning restock"),
        ForumPlace(title: "Palace Museum Shop · Magnets", subtitle: "Corner-tower series · limited colors", price: "¥39", tags: ["Light", "Limited"], kind: .gift, likes: "604", symbol: "sparkles", tint: 3, heat: 78, area: "Forbidden City · Shenwu Gate", note: "The corner-tower magnet sells out, so buy it on the way in.", bestTime: "1 hr after opening"),
        ForumPlace(title: "Tongrentang · Sour plum mix", subtitle: "Brew a Beijing summer", price: "¥38", tags: ["Check-in", "Light"], kind: .gift, likes: "512", symbol: "leaf", tint: 7, heat: 74, area: "Dongcheng · Dashilar", note: "Brewed at home, it tastes more like Beijing than any bottle.", bestTime: "Any time"),
        ForumPlace(title: "Sunset at Jingshan", subtitle: "Up before 17:00 · Wanchun Pavilion", price: "Free", tags: ["Sunset", "Palace views"], kind: .spot, likes: "3.4k", symbol: "sun.horizon", tint: 4, heat: 94, area: "Dongcheng · Jingshan", note: "Reach Wanchun Pavilion before 17:00 for the full palace view.", bestTime: "40 min before sunset"),
        ForumPlace(title: "Temple of Heaven", subtitle: "Echo Wall · old cypresses", price: "¥34", tags: ["Architecture", "Quiet"], kind: .spot, likes: "2.8k", symbol: "building.columns", tint: 8, heat: 90, area: "Dongcheng · Temple of Heaven", note: "Enter from the south gate; the Echo Wall is best when quiet.", bestTime: "1 hr after opening"),
        ForumPlace(title: "Beihai Park", subtitle: "Boats and the White Dagoba", price: "¥10", tags: ["Family", "Boating"], kind: .spot, likes: "2.1k", symbol: "sailboat", tint: 9, heat: 82, area: "Xicheng · Beihai", note: "Rent a boat — the White Dagoba looks best from the water.", bestTime: "After 15:00")
    ]

    let forumEvent = ForumEvent(
        title: "Hutong Night Market · Free entry",
        subtitle: "Handmade goods, vinyl and snacks from local stalls",
        date: "10/18 Sat · 18:00",
        place: "Drum & Bell Towers square · 35 min from hotel",
        attendees: 128
    )

    let similarRoutes: [SimilarRoute] = [
        SimilarRoute(
            title: "Central Axis · Classic half day",
            author: "@Ken",
            match: 94,
            stops: 6,
            distance: "4.2 km",
            duration: "~5 hr",
            tags: ["Classic", "Walk", "Sunset"],
            highlight: "Matches 5 of your 6 stops, with the palace section in the same order."
        ),
        SimilarRoute(
            title: "Hutong coffee crawl · 8 stops",
            author: "@Lina",
            match: 87,
            stops: 8,
            distance: "6.4 km",
            duration: "~a full day",
            tags: ["Coffee", "Photo spots", "Easy"],
            highlight: "Swaps Nanluoguxiang for three coffee shops — good for an afternoon start."
        ),
        SimilarRoute(
            title: "Jingshan sunset + Shichahai at night",
            author: "@Zhe",
            match: 79,
            stops: 5,
            distance: "3.8 km",
            duration: "~3 hr",
            tags: ["Night", "Sunset", "Local"],
            highlight: "Keeps your Jingshan sunset, then walks back along Shichahai — one backtrack fewer."
        )
    ]

    let phrases: [Phrase] = [
        Phrase(zh: "请问最近的地铁站怎么走？", en: "Where is the nearest subway station?", scenario: .route),
        Phrase(zh: "我迷路了，能帮我看看地图吗？", en: "I'm lost. Could you help me read the map?", scenario: .route),
        Phrase(zh: "我对花生过敏，请确认这道菜不含花生。", en: "I'm allergic to peanuts. Does this dish contain any?", scenario: .dining),
        Phrase(zh: "可以刷卡吗？", en: "Can I pay by card?", scenario: .dining),
        Phrase(zh: "我食物过敏，需要去医院。", en: "I have a food allergy and need a hospital.", scenario: .medical),
        Phrase(zh: "请帮我叫一辆救护车。", en: "Please call an ambulance for me.", scenario: .medical),
        Phrase(zh: "我对青霉素过敏。", en: "I am allergic to penicillin.", scenario: .medical),
        Phrase(zh: "这是我正在服用的药。", en: "This is the medication I am taking.", scenario: .medical),
        Phrase(zh: "请带我去这个地址。", en: "Please take me to this address.", scenario: .taxi),
        Phrase(zh: "大概需要多长时间？", en: "How long will it take?", scenario: .taxi),
        Phrase(zh: "这个多少钱？", en: "How much is this?", scenario: .shopping),
        Phrase(zh: "可以退税吗？", en: "Can I get a tax refund?", scenario: .shopping),
        Phrase(zh: "请帮我报警。", en: "Please help me call the police.", scenario: .emergency),
        Phrase(zh: "我需要中文翻译帮助。", en: "I need help from a Chinese interpreter.", scenario: .emergency)
    ]

    // MARK: Init
    init() {
        checklist = Self.makeChecklist()
        stops = Self.makeStops()
        liveMessages = [
            LiveMessage(zh: "你好，请问最近的地铁站怎么走？", en: "Hello, where is the nearest subway station?", isMine: false),
            LiveMessage(zh: "直走两个路口，在红绿灯处左转。", en: "Go straight for two blocks, then turn left at the lights.", isMine: true)
        ]
        localEvents = Self.makeLocalEvents()
        forumPosts = Self.makeForumPosts()
        attractions = Self.makeAttractions()
        applySavedChecklist()
        applyLaunchScreen()
    }

    // Enables screenshot QA: `simctl launch ... ai.lucia.travel -plan`
    private func applyLaunchScreen() {
        #if DEBUG
        let args = ProcessInfo.processInfo.arguments
        if args.contains("-plan") || args.contains("-similar") { tab = .plan }
        if args.contains("-mapedit") {
            tab = .plan
            mapEditMode = true
            aiSuggestionVisible = false
            selectedStopID = stops.first(where: { $0.name == "Forbidden City" })?.id
        }
        if args.contains("-forum") { tab = .forum }
        if args.contains("-translate") { tab = .translate }
        if args.contains("-me") { tab = .me }
        if args.contains("-offline") {
            tab = .translate
            translateMode = .offline
        }
        if args.contains("-photocam") {
            tab = .translate
            translateMode = .photo
            photoScanned = false
        }
        if args.contains("-photo") {
            tab = .translate
            translateMode = .photo
            photoScanned = true
        }
        if args.contains("-photo-sign") {
            tab = .translate
            translateMode = .photo
            photoSample = .sign
            photoScanned = true
        }
        if args.contains("-restaurant") || args.contains("-spot") || args.contains("-gift")
            || args.contains("-route") || args.contains("-event") || args.contains("-eventcompose") {
            tab = .forum
        }
        if args.contains("-notes") {
            tab = .plan
            notesOpen = true
        }
        if args.contains("-checklist") { checklistOpen = true }
        if args.contains("-assistant") {
            assistantContext = tab.assistantContext
            seedAssistant()
            assistantOpen = true
        }
        if args.contains("-place") || args.contains("-compose") { tab = .forum }
        if args.contains("-reorder") { tab = .plan }
        if args.contains("-bigtype") {
            tab = .translate
            translateMode = .offline
        }
        #endif
    }

    // MARK: Checklist
    var doneCount: Int { checklist.filter { $0.status == .done }.count }
    var totalCount: Int { checklist.count }
    var progress: Double { totalCount == 0 ? 0 : Double(doneCount) / Double(totalCount) }
    var remaining: Int { max(0, totalCount - doneCount) }

    func items(in phase: ChecklistPhase) -> [ChecklistItem] {
        checklist.filter { $0.phase == phase }
    }

    func phaseDone(_ phase: ChecklistPhase) -> Int {
        items(in: phase).filter { $0.status == .done }.count
    }

    func categoryStats(_ category: ChecklistCategory) -> (done: Int, total: Int) {
        let list = checklist.filter { $0.category == category }
        return (list.filter { $0.status == .done }.count, list.count)
    }

    func toggle(_ item: ChecklistItem) {
        guard let index = checklist.firstIndex(where: { $0.id == item.id }) else { return }
        withAnimation(.easeInOut(duration: 0.2)) {
            checklist[index].status = checklist[index].status == .done ? (checklist[index].actionLabel == nil ? .todo : .action) : .done
        }
        Haptics.tap()
        persistChecklist()
    }

    func complete(_ item: ChecklistItem) {
        guard let index = checklist.firstIndex(where: { $0.id == item.id }) else { return }
        withAnimation(.easeInOut(duration: 0.2)) { checklist[index].status = .done }
        Haptics.success()
        persistChecklist()
        toast("Done · \(item.title)", icon: "checkmark.seal.fill")
    }

    func bookForbiddenCity() {
        if let index = checklist.firstIndex(where: { $0.title.hasPrefix("Forbidden City tickets") }) {
            withAnimation { checklist[index].status = .done }
            persistChecklist()
        }
        Haptics.success()
        toast("Booked 10/15 09:00 · 2 adults", icon: "ticket.fill")
    }

    func aiRecheck() {
        let open = checklist.filter { $0.status != .done }.count
        Haptics.success()
        if open == 0 {
            toast("All 12 checks complete", icon: "checkmark.seal.fill")
        } else {
            toast("Recheck done · \(open) to go, reordered", icon: "sparkles")
        }
    }

    func addToChecklist(title: String, meta: String, category: ChecklistCategory = .tickets, phase: ChecklistPhase = .before) {
        guard !checklist.contains(where: { $0.title == title }) else {
            toast("Already on your list", icon: "checkmark.circle.fill")
            return
        }
        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
            checklist.append(
                ChecklistItem(
                    title: title,
                    meta: meta,
                    category: category,
                    phase: phase,
                    status: .action,
                    actionLabel: "View",
                    tag: "New",
                    tagStyle: .accent
                )
            )
        }
        Haptics.success()
        persistChecklist()
        toast("Added to your pre-trip list", icon: "text.badge.plus")
    }

    var checklistSummary: String {
        let lines = checklist.map { item -> String in
            "\(item.status == .done ? "✓" : "○") \(item.title) — \(item.meta)"
        }
        return "Pico · Beijing 4 days, 3 nights · Pre-trip checklist\nProgress \(doneCount)/\(totalCount)\n\n" + lines.joined(separator: "\n")
    }

    private func persistChecklist() {
        let map = Dictionary(uniqueKeysWithValues: checklist.map { ($0.title, $0.status == .done) })
        UserDefaults.standard.set(map, forKey: "lucia.checklist.v1")
    }

    private func applySavedChecklist() {
        guard let saved = UserDefaults.standard.dictionary(forKey: "lucia.checklist.v1") as? [String: Bool] else { return }
        for index in checklist.indices {
            guard let done = saved[checklist[index].title] else { continue }
            if done {
                checklist[index].status = .done
            } else {
                checklist[index].status = checklist[index].actionLabel == nil ? .todo : .action
            }
        }
    }

    // MARK: Plan
    func selectStop(_ stop: RouteStop) {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
            selectedStopID = selectedStopID == stop.id ? nil : stop.id
        }
        Haptics.tap()
    }

    func toggleMapEditMode() {
        withAnimation(.spring(response: 0.34, dampingFraction: 0.84)) {
            mapEditMode.toggle()
        }
        Haptics.tap()
        if mapEditMode {
            toast("Edit stops · drag the numbered pins", icon: "hand.draw.fill")
        }
    }

    func moveStop(_ id: UUID, toX x: CGFloat, toY y: CGFloat) {
        guard let index = stops.firstIndex(where: { $0.id == id }) else { return }
        stops[index].x = min(max(x, 0.06), 0.94)
        stops[index].y = min(max(y, 0.10), 0.90)
    }

    func didFinishMovingStop() {
        Haptics.success()
        toast("Stops updated · route redrawn", icon: "map.fill")
    }

    func applyRouteSuggestion() {
        let order = ["Tiananmen Square", "Forbidden City", "Shichahai", "Jingshan Park", "Nanluoguxiang", "Drum & Bell Towers"]
        let times = ["09:00", "09:40", "13:00", "14:30", "16:00", "17:00"]
        var reordered: [RouteStop] = []
        for (index, name) in order.enumerated() {
            if var stop = stops.first(where: { $0.name == name }) {
                stop.time = times[index]
                reordered.append(stop)
            }
        }
        withAnimation(.spring(response: 0.5, dampingFraction: 0.85)) {
            if reordered.count == stops.count { stops = reordered }
            routeApplied = true
            aiSuggestionVisible = false
        }
        Haptics.success()
        toast("Applied · route recalculated, 1.2 km shorter", icon: "arrow.triangle.swap")
    }

    func moveStops(from source: IndexSet, to destination: Int) {
        stops.move(fromOffsets: source, toOffset: destination)
        renumberStops()
        toast("Order updated", icon: "arrow.up.arrow.down")
    }

    private func renumberStops() {
        var hour = 9
        var minute = 0
        for index in stops.indices {
            stops[index].time = String(format: "%02d:%02d", hour, minute)
            let duration = index == 1 ? 180 : (index == 3 ? 90 : 45)
            minute += duration + 15
            hour += minute / 60
            minute %= 60
        }
    }

    func copyRoute(named name: String) {
        routeName = name + " · Copy"
        routeApplied = false
        aiSuggestionVisible = true
        tab = .plan
        selectedStopID = stops.first?.id
        Haptics.success()
        toast("Copied to your own route", icon: "doc.on.doc.fill")
    }

    func shareRoute() {
        toast("Route link copied", icon: "link")
    }

    var routeSummary: String {
        let lines = stops.enumerated().map { index, stop in
            "\(index + 1). \(stop.name) · \(stop.time) · \(stop.duration)"
        }
        return "\(routeName)\n6 stops · 4.2 km · ~5 hr\n\n" + lines.joined(separator: "\n") + "\n\nFrom Pico · Beijing trip plan"
    }

    // MARK: Forum
    func toggleSaved(_ place: ForumPlace) {
        if savedPlaces.contains(place.id) {
            savedPlaces.remove(place.id)
        } else {
            savedPlaces.insert(place.id)
            Haptics.tap()
        }
    }

    func toggleSavedPost(_ post: ForumPost) {
        if savedPostIDs.contains(post.id) {
            savedPostIDs.remove(post.id)
        } else {
            savedPostIDs.insert(post.id)
            Haptics.tap()
        }
        toast(savedPostIDs.contains(post.id) ? "Saved · find it in Me" : "Removed from saved", icon: "bookmark.fill")
    }

    // MARK: Attractions

    var bookedAttractionCount: Int { attractions.filter(\.booked).count }

    var attractionProgress: Double {
        attractions.isEmpty ? 0 : Double(bookedAttractionCount) / Double(attractions.count)
    }

    var pendingAttractions: [AttractionBooking] {
        attractions.filter { !$0.booked }
    }

    func bookAttraction(_ attraction: AttractionBooking) {
        guard let index = attractions.firstIndex(where: { $0.id == attraction.id }), !attractions[index].booked else { return }
        withAnimation(.spring(response: 0.4, dampingFraction: 0.86)) {
            attractions[index].booked = true
            attractions[index].code = Self.makeBookingCode()
        }
        Haptics.success()
        toast("Booked \(attraction.title) · scan your ID at the gate", icon: "ticket.fill")
    }

    func bookAllAttractions() {
        guard !pendingAttractions.isEmpty else { return }
        let count = pendingAttractions.count
        withAnimation(.spring(response: 0.45, dampingFraction: 0.86)) {
            for index in attractions.indices where !attractions[index].booked {
                attractions[index].booked = true
                attractions[index].code = Self.makeBookingCode()
            }
        }
        Haptics.success()
        toast("Booked \(count) sights · passes ready", icon: "checkmark.seal.fill")
    }

    private static func makeBookingCode() -> String {
        "ROAMCHINA-" + String((0..<4).map { _ in "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".randomElement()! })
    }

    func joinEvent() {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
            joinedEvent.toggle()
        }
        Haptics.success()
        toast(joinedEvent ? "Joined · added to your 10/18 plan" : "Left event", icon: joinedEvent ? "checkmark.circle.fill" : "xmark.circle")
    }

    func toggleJoin(_ event: LocalEvent) {
        if joinedEventIDs.contains(event.id) {
            joinedEventIDs.remove(event.id)
        } else {
            joinedEventIDs.insert(event.id)
            Haptics.success()
        }
        toast(
            joinedEventIDs.contains(event.id) ? "Joined · \(event.title)" : "Left event",
            icon: joinedEventIDs.contains(event.id) ? "checkmark.circle.fill" : "xmark.circle"
        )
    }

    func publishEvent(title: String, date: String, time: String, place: String, fee: String, note: String) {
        let event = LocalEvent(
            title: title,
            subtitle: note.isEmpty ? "Hosted by a community member · all welcome" : note,
            date: date,
            time: time,
            place: place,
            host: "@Wang Bo",
            fee: fee.isEmpty ? "Free" : fee,
            attendees: 1,
            isMine: true,
            tint: 1
        )
        withAnimation(.spring(response: 0.45, dampingFraction: 0.85)) {
            localEvents.insert(event, at: 0)
            forumPosts.insert(
                ForumPost(
                    author: "Wang Bo",
                    avatar: "W",
                    tint: 5,
                    time: "Just now",
                    kind: .event,
                    title: title,
                    body: note.isEmpty ? "Started by you · all welcome" : note,
                    tags: [date, fee.isEmpty ? "Free" : fee],
                    likes: "0",
                    saves: "0",
                    symbol: "sun.horizon.fill",
                    artTint: 3,
                    height: 150,
                    eventTitle: title,
                    comments: 0,
                    comment: "Started by you · all welcome",
                    isMine: true
                ),
                at: 0
            )
        }
        Haptics.success()
        toast("Event published · in community review", icon: "calendar.badge.plus")
    }

    // MARK: Assistant
    func openAssistant(_ context: String) {
        assistantContext = context
        assistantOpen = true
        Haptics.tap()
        if chatMessages.isEmpty {
            seedAssistant()
        }
    }

    var quickPrompts: [String] {
        if assistantContext.contains("Ticket") || assistantContext.contains("Forbidden City") {
            return ["How do I book the Forbidden City?", "Any tickets left?", "How do I get there?"]
        }
        if assistantContext.contains("Translate") {
            return ["How do I say 'doctor'?", "Make the text bigger", "How do I ask for a taxi?"]
        }
        if assistantContext.contains("Checklist") {
            return ["What's still missing?", "How do I set up a VPN?", "Which eSIM should I get?"]
        }
        switch tab {
        case .trip: return ["How do I book the Forbidden City?", "Which area should I stay in?", "What should I wear in October?"]
        case .plan: return ["Rework my route", "Any coffee nearby?", "Make a visual note"]
        case .forum: return ["Which duck place has no queue?", "What gifts should I bring?", "Any local events?"]
        case .translate: return ["How do I say 'doctor'?", "Call me a taxi", "Show staff a bigger text"]
        case .me: return ["How do offline packs work?", "How do I set up a VPN?", "Export my trip"]
        }
    }

    func seedAssistant() {
        let context = assistantContext
        var card: AssistantCardKind? = nil
        let text: String

        if context.contains("Ticket") || context.contains("Forbidden City") {
            text = "The Forbidden City still has 812 tickets for the morning of 10/15. ¥60 per adult, booked under your real name, ID at the gate. Want me to lock two spots for 09:00?"
            card = .ticket
        } else if context.contains("Translate") {
            text = "I've lined up four phrases for the clinic. The one you'll use most: “I have a food allergy and need a hospital.” You can enlarge it for staff, or let me read it aloud."
            card = .translate
        } else if context.contains("Checklist") {
            text = "I rechecked against the weather, closing days and ticket stock: do eSIM and VPN first, then book the palace and the Great Wall. The three new items are already on your list."
            card = .checklist
        } else {
            switch tab {
            case .trip:
                text = "Good morning, Wang Bo. I've read your 10/15–18 trip: 22°C by day, 11°C at night, and the Forbidden City closes on Mondays — so keep it on the morning of the 15th. Lock tickets first, or reorder the route?"
                card = .route
            case .plan:
                text = "This Central Axis version runs 5.2 km, and putting Shichahai after the palace means one backtrack. Move Shichahai to 13:00 and Jingshan to 14:30 and you save 1.2 km. Apply it?"
                card = .route
            case .forum:
                text = "The community route “Central Axis · Half day” overlaps four of your stops and can be copied as-is. Want me to compare the two duck restaurants while we're here?"
                card = .route
            case .translate:
                text = "Your offline phrasebook is downloaded — 86 phrases for directions, dining, medical and taxis. Shall I enlarge the four medical phrases, or play the pronunciation first?"
                card = .translate
            case .me:
                text = "Your Beijing offline pack is ready. Before you fly, double-check VPN and eSIM — those are what tend to trip people up on arrival. Want me to walk you through it?"
                card = .checklist
            }
        }
        chatMessages = [ChatMessage(role: .assistant, text: text, card: card)]
    }

    func resetChat() {
        chatMessages = []
        seedAssistant()
    }

    func sendChat(_ raw: String) {
        let text = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        chatMessages.append(ChatMessage(role: .user, text: text))
        chatDraft = ""
        chatThinking = true
        Task { [weak self] in
            try? await Task.sleep(nanoseconds: 700_000_000)
            guard let self else { return }
            self.chatThinking = false
            withAnimation(.spring(response: 0.4, dampingFraction: 0.86)) {
                self.chatMessages.append(self.reply(to: text))
            }
            Haptics.tap()
        }
    }

    private func reply(to text: String) -> ChatMessage {
        let lower = text.lowercased()
        if lower.contains("ticket") || lower.contains("book") || lower.contains("forbidden city") {
            return ChatMessage(role: .assistant, text: "The Forbidden City still has 812 tickets for the morning of 10/15, ¥60 per adult. Book under your real name and scan your ID at the gate — I've noted 09:00 for two adults. Lock it in?", card: .ticket)
        }
        if lower.contains("hotel") || lower.contains("stay") || lower.contains("hostel") {
            return ChatMessage(role: .assistant, text: "Given where your sights sit, Wangfujing is the best balance: 12 minutes on foot to the palace, two metro stops to Nanluoguxiang. I've filtered three areas by budget:", card: .hotels)
        }
        if lower.contains("weather") || lower.contains("wear") || lower.contains("cold") || lower.contains("hot") {
            return ChatMessage(role: .assistant, text: "10/15–17 in Beijing: 22°C by day, 11°C at night. A light jacket and trousers will do, plus soft shoes for the palace's stone paths. There may be light rain on the 18th — I'll remind you the night before.")
        }
        if lower.contains("route") || lower.contains("reorder") || lower.contains("get there") || lower.contains("detour") {
            return ChatMessage(role: .assistant, text: "I've reordered it to cut backtracks: Tiananmen → Forbidden City → Shichahai → Jingshan → Nanluoguxiang → Drum & Bell Towers. That's 1.2 km less, with sunset landing at the towers.", card: .route)
        }
        if lower.contains("checklist") || lower.contains("prepare") || lower.contains("vpn") || lower.contains("esim") || lower.contains("phone") {
            return ChatMessage(role: .assistant, text: "Six items are still open on your pre-trip list. The three most likely to trip you up: an eSIM plan, a VPN install, and palace tickets. Add all three?", card: .checklist)
        }
        if lower.contains("translate") || lower.contains("say") || lower.contains("english") {
            return ChatMessage(role: .assistant, text: "I've turned that into a side-by-side line you can show staff, and it can play the Chinese aloud.", card: .translate)
        }
        if lower.contains("eat") || lower.contains("food") || lower.contains("duck") || lower.contains("coffee") || lower.contains("restaurant") {
            return ChatMessage(role: .assistant, text: "Siji Minfu's palace branch rarely queues before 11:00. For something quicker, Pangmei Noodles is about ¥45 a head. Both sit near your route on the 15th.")
        }
        if lower.contains("hospital") || lower.contains("allergy") || lower.contains("emergency") || lower.contains("doctor") {
            return ChatMessage(role: .assistant, text: "Don't worry. Four offline medical phrases can be enlarged for a doctor, and the emergency number is 120. Want me to mark the nearest hospital on the map too?")
        }
        return ChatMessage(role: .assistant, text: "I can check ticket stock, rework your route, add checklist items, translate a line, or explain where to eat nearby. What shall we start with?")
    }

    // MARK: Translate
    func simulateListening() {
        guard !listening else { return }
        Haptics.tap()
        listening = true
        Task { [weak self] in
            try? await Task.sleep(nanoseconds: 1_500_000_000)
            guard let self else { return }
            self.listening = false
            let reply = LiveMessage(
                zh: "这附近有推荐的早餐吗？",
                en: "Any breakfast places around here?",
                isMine: false
            )
            withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                self.liveMessages.append(reply)
            }
            Haptics.success()
        }
    }

    func setPhotoSample(_ sample: PhotoSample) {
        guard photoSample != sample else { return }
        photoSample = sample
        withAnimation(.easeOut(duration: 0.2)) {
            photoScanned = false
        }
        Haptics.tap()
    }

    func scanPhoto() {
        guard !photoScanning else { return }
        Haptics.tap()
        photoScanned = false
        photoScanning = true
        Task { [weak self] in
            try? await Task.sleep(nanoseconds: 1_250_000_000)
            guard let self else { return }
            self.photoScanning = false
            withAnimation(.spring(response: 0.45, dampingFraction: 0.86)) {
                self.photoScanned = true
            }
            Haptics.success()
        }
    }

    func clearPhoto() {
        withAnimation(.easeOut(duration: 0.2)) {
            photoScanned = false
            photoScanning = false
        }
        Haptics.tap()
    }

    // MARK: Toast
    func toast(_ text: String, icon: String = "checkmark.circle.fill") {
        let newToast = Toast(text: text, icon: icon)
        withAnimation(.spring(response: 0.35, dampingFraction: 0.82)) {
            toast = newToast
        }
        Task { [weak self] in
            try? await Task.sleep(nanoseconds: 2_400_000_000)
            guard let self, self.toast?.id == newToast.id else { return }
            withAnimation(.easeOut(duration: 0.2)) {
                self.toast = nil
            }
        }
    }

    // MARK: Seed data
    private static func makeChecklist() -> [ChecklistItem] {
        [
            ChecklistItem(title: "Passport valid 6+ months", meta: "Confirmed · expires 03/2027", category: .docs, phase: .before, status: .done, trailing: "Verified"),
            ChecklistItem(title: "Flights & hotel booked", meta: "Ticketed · Wangfujing, 3 nights", category: .docs, phase: .before, status: .done, trailing: "View"),
            ChecklistItem(title: "Travel insurance · active", meta: "Allianz · ¥800k cover", category: .docs, phase: .before, status: .done, trailing: "Active"),
            ChecklistItem(title: "Forbidden City tickets · 10/15 09:00", meta: "2 adults · ¥120 · 812 left", category: .tickets, phase: .before, status: .action, actionLabel: "Book", tag: "Selling fast", tagStyle: .warn),
            ChecklistItem(title: "Great Wall · 10/16 08:30", meta: "Badaling · cable car needs booking", category: .tickets, phase: .before, status: .action, actionLabel: "Book", tag: "To book", tagStyle: .neutral),
            ChecklistItem(title: "Summer Palace · 10/17 09:00", meta: "Combined ticket ¥60 / person", category: .tickets, phase: .before, status: .todo, actionLabel: "Buy"),
            ChecklistItem(title: "National Museum · 10/17 14:00", meta: "Free · real-name booking", category: .tickets, phase: .before, status: .todo, actionLabel: "Book"),
            ChecklistItem(title: "eSIM / China number", meta: "3 plans compared · from ¥29", category: .connectivity, phase: .arrival, status: .action, actionLabel: "Choose plan"),
            ChecklistItem(title: "VPN", meta: "Not on China's App Store", category: .connectivity, phase: .arrival, status: .action, actionLabel: "Guide", tag: "Install early", tagStyle: .warn),
            ChecklistItem(title: "Offline maps & phrases", meta: "Beijing · 86 emergency phrases", category: .connectivity, phase: .arrival, status: .done, trailing: "Downloaded"),
            ChecklistItem(title: "Alipay / WeChat Pay", meta: "VISA linked · ¥5,000 per payment", category: .transit, phase: .arrival, status: .done, trailing: "Done"),
            ChecklistItem(title: "Transit card / metro QR", meta: "Apple Wallet · active", category: .transit, phase: .arrival, status: .done, trailing: "Active")
        ]
    }

    private static func makeStops() -> [RouteStop] {
        [
            RouteStop(name: "Tiananmen Square", time: "09:00", duration: "30 min", x: 0.49, y: 0.86, tag: "Photo"),
            RouteStop(name: "Forbidden City", time: "09:40", duration: "3 hr", x: 0.52, y: 0.67, tag: "Booked", tagStyle: .ok),
            RouteStop(name: "Jingshan Park", time: "13:00", duration: "1 hr", x: 0.57, y: 0.56, tag: "Views"),
            RouteStop(name: "Shichahai", time: "15:00", duration: "1.5 hr", x: 0.37, y: 0.38, tag: "Pico pick", tagStyle: .accent),
            RouteStop(name: "Nanluoguxiang", time: "16:30", duration: "45 min", x: 0.61, y: 0.31, tag: "Coffee"),
            RouteStop(name: "Drum & Bell Towers", time: "17:30", duration: "45 min", x: 0.50, y: 0.20, tag: "Sunset")
        ]
    }

    private static func makeForumPosts() -> [ForumPost] {
        [
            ForumPost(author: "Xiaoman", avatar: "X", tint: 5, time: "2 hr ago", kind: .spot,
                      title: "Sunset at Jingshan's Wanchun Pavilion beats the photos",
                      body: "Get up there by 17:00 and the palace roofs turn gold. The east railing is the shot — claim it early.",
                      tags: ["Jingshan", "Sunset", "Viewpoint"], likes: "3.4k", saves: "862",
                      symbol: "sun.horizon.fill", artTint: 3, height: 174, photo: "post-n1", credit: "EditQ / CC BY-SA 4.0",
                      placeTitle: "Sunset at Jingshan", comment: "@Zhe: Went on Wednesday — the sun hit the ridge at 17:10."),
            ForumPost(author: "Ken", avatar: "K", tint: 4, time: "4 hr ago", kind: .route,
                      title: "The Central Axis in a day: Yongdingmen to the Drum Tower",
                      body: "6 stops, 4.2 km. Start at 3pm and you land at Jingshan for sunset. The metro is a backup the whole way.",
                      tags: ["Central Axis", "Walk", "Route"], likes: "2.1k", saves: "1.2k",
                      symbol: "point.topleft.down.to.point.bottomright.curvepath", artTint: 4, height: 120, photo: "post-n2", credit: "xiquinhosilva / CC BY 4.0",
                      routeIndex: 1, comment: "@Lina: Finished it — feet survived, two coffee stops helped."),
            ForumPost(author: "Zhe", avatar: "Z", tint: 3, time: "5 hr ago", kind: .restaurant,
                      title: "Siji Minfu before 11 — no queue, really",
                      body: "Dip the duck skin in sugar first; half a bird feeds two. After 3pm you rarely wait at all.",
                      tags: ["Duck", "Forbidden City", "Queue"], likes: "2.3k", saves: "708",
                      symbol: "fork.knife", artTint: 0, height: 146, photo: "post-n3", credit: "Mr Wabu / CC BY-SA 2.0",
                      placeTitle: "Siji Minfu · Forbidden City", comment: "@Zhou: Got there at 10:40 and walked straight in."),
            ForumPost(author: "Lina", avatar: "L", tint: 0, time: "Yesterday", kind: .restaurant,
                      title: "Qianmen hutong coffee, best light at 3pm",
                      body: "Metal Hands hides in a back lane; the two window tables are the quietest. The pour-over runs bright — pair it with a croissant.",
                      tags: ["Coffee", "Hutong", "Afternoon"], likes: "1.1k", saves: "433",
                      symbol: "cup.and.saucer.fill", artTint: 1, height: 162, photo: "post-n4", credit: "Arisepeter / CC BY-SA 4.0",
                      placeTitle: "Metal Hands · Qianmen", comment: "@Bei: Sat there two hours on Sunday, nobody rushed us."),
            ForumPost(author: "Zhou", avatar: "Z", tint: 2, time: "Yesterday", kind: .spot,
                      title: "Early morning at the Temple of Heaven, almost empty",
                      body: "Enter from the south gate; the Echo Wall is quietest before nine. Cypress shadows fall on red walls — every shot works.",
                      tags: ["Temple of Heaven", "Morning", "Architecture"], likes: "2.8k", saves: "610",
                      symbol: "building.columns.fill", artTint: 2, height: 130, photo: "post-n5", credit: "Balon Greyjoy / CC0",
                      placeTitle: "Temple of Heaven", comment: "@Hutong Files: Locals do tai chi then — keep your voice down."),
            ForumPost(author: "Hutong Files", avatar: "H", tint: 3, time: "2 days ago", kind: .event,
                      title: "Saturday night market at the Drum Tower: stall list updated",
                      body: "Handmade goods, vinyl and mulled wine; busiest after 19:00. Metro Line 8, Shichahai exit A.",
                      tags: ["Night market", "Drum & Bell Towers", "Weekend"], likes: "986", saves: "241",
                      symbol: "moon.stars.fill", artTint: 3, height: 154, photo: "post-n6", credit: "Marek Śliwecki / CC BY-SA 4.0",
                      eventTitle: "Hutong Night Market · Free entry", comment: "@Ken: Signed up — see you there."),
            ForumPost(author: "Zhao", avatar: "Z", tint: 1, time: "2 days ago", kind: .gift,
                      title: "Daoxiangcun loose pastries vs gift boxes: how locals buy",
                      body: "Loose pastries are sold by weight — fresher, and you can mix flavors. Boxes are for giving; no need for yourself.",
                      tags: ["Gifts", "Daoxiangcun", "Save money"], likes: "1.7k", saves: "529",
                      symbol: "gift.fill", artTint: 5, height: 138, photo: "post-n7", credit: "Zicheng zic / CC BY 4.0",
                      placeTitle: "Daoxiangcun · Local gifts", comment: "@Xiaoman: Get the date paste and ox-tongue pastry."),
            ForumPost(author: "Zhe", avatar: "Z", tint: 3, time: "3 days ago", kind: .route,
                      title: "Shichahai after dark: 5 stops, 3 small bars",
                      body: "Start at Yinding Bridge and follow the north shore to the Drum Tower. Quieter after nine; bring a jacket, it's windy.",
                      tags: ["Night", "Shichahai", "Bars"], likes: "860", saves: "377",
                      symbol: "figure.walk", artTint: 2, height: 126, photo: "post-n8", credit: "Morio / CC BY-SA 4.0",
                      routeIndex: 2, comment: "@Lina: The brewpub by Yinding Bridge is solid."),
            ForumPost(author: "Bei", avatar: "B", tint: 0, time: "3 days ago", kind: .gift,
                      title: "Corner-tower magnets are back — buy on the way in",
                      body: "The Shenwu Gate shop restocks in the morning and the corner-tower series sells out. Two per person — don't wait for closing.",
                      tags: ["Palace shop", "Magnets", "Limited"], likes: "604", saves: "188",
                      symbol: "sparkles", artTint: 0, height: 112, photo: "post-n9", credit: "Morio / CC BY-SA 4.0",
                      placeTitle: "Palace Museum Shop · Magnets", comment: "@Zhou: They had the sunset color yesterday. Go."),
            ForumPost(author: "May", avatar: "M", tint: 5, time: "4 days ago", kind: .restaurant,
                      title: "40 minutes in line at Man Heng Ji — worth it?",
                      body: "Hand-cut lamb with sesame dip; once the copper pot boils you know the wait paid off. Take a number before 17:00 and halve it.",
                      tags: ["Hotpot", "Niujie", "Queue"], likes: "1.9k", saves: "522",
                      symbol: "flame.fill", artTint: 3, height: 140, photo: "post-n10", credit: "ZhengZhou / CC BY-SA 4.0",
                      placeTitle: "Man Heng Ji · Niujie", comment: "@Zhao: Worth it. Order extra sweet garlic."),
            ForumPost(author: "Lina", avatar: "L", tint: 0, time: "5 days ago", kind: .spot,
                      title: "Boating at Beihai: the White Dagoba from the water",
                      body: "After 4pm the sun softens; a pedal boat for an hour is just right. They stop rentals when it's windy.",
                      tags: ["Beihai", "Boating", "Family"], likes: "2.1k", saves: "498",
                      symbol: "sailboat.fill", artTint: 1, height: 148, photo: "post-n11", credit: "Daniel Case / CC BY-SA 3.0",
                      placeTitle: "Beihai Park", comment: "@Bei: With kids, take the electric boat.")
        ]
    }

    private static func makeAttractions() -> [AttractionBooking] {
        [
            AttractionBooking(
                title: "Forbidden City", date: "10/15", time: "09:00 – 12:00",
                price: "¥60 · 2 adults", symbol: "building.columns.fill", tint: 3,
                booked: true, code: "ROAMCHINA-7Q2K"
            ),
            AttractionBooking(
                title: "Badaling Great Wall", date: "10/16", time: "08:30 meet",
                price: "¥40 · cable car included", symbol: "mountain.2.fill", tint: 2
            ),
            AttractionBooking(
                title: "Summer Palace", date: "10/17", time: "09:00 – 12:00",
                price: "¥60 · combined ticket", symbol: "leaf.fill", tint: 4
            ),
            AttractionBooking(
                title: "National Museum of China", date: "10/17", time: "14:00 – 16:30",
                price: "Free · real-name booking", symbol: "building.columns", tint: 1
            )
        ]
    }

    private static func makeLocalEvents() -> [LocalEvent] {
        [
            LocalEvent(
                title: "Hutong Night Market · Free entry",
                subtitle: "Handmade goods, vinyl and snacks from local stalls",
                date: "10/18 Sat",
                time: "18:00 – 22:00",
                place: "Drum & Bell Towers square · 35 min from hotel",
                host: "@Pico Community",
                fee: "Free",
                attendees: 128,
                tint: 0
            ),
            LocalEvent(
                title: "Baita Temple flea market",
                subtitle: "Old cameras, second-hand books and pour-over coffee, run by local collectors",
                date: "11/01 Sat",
                time: "13:00 – 19:00",
                place: "Baita Temple east lane · 20 min from hotel",
                host: "@Hutong Files",
                fee: "Free",
                attendees: 64,
                tint: 1
            ),
            LocalEvent(
                title: "Central Axis night ride · BYO bike",
                subtitle: "Yongdingmen to the Drum Tower with a guide on the old city gates",
                date: "11/02 Sun",
                time: "19:00",
                place: "Yongdingmen Park, north gate",
                host: "@Ken",
                fee: "¥20",
                attendees: 37,
                tint: 3
            )
        ]
    }
}

// MARK: - Speech

final class SpeechService {
    static let shared = SpeechService()
    private let synthesizer = AVSpeechSynthesizer()

    func speak(_ text: String, language: String = "zh-CN") {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: language)
        utterance.rate = 0.46
        utterance.pitchMultiplier = 1.0
        synthesizer.speak(utterance)
    }
}
