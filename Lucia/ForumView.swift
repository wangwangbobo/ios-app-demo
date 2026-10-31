import SwiftUI

struct ForumView: View {
    @EnvironmentObject private var model: AppModel
    @State private var selectedPost: ForumPost? = nil
    @State private var standalonePlace: ForumPlace? = nil
    @State private var showCompose = false
    @State private var feedFilter: ForumPostKind = .all
    @State private var path = NavigationPath()
    @State private var launchChannelApplied = false

    private var query: String {
        model.forumSearch.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private var feedPosts: [ForumPost] {
        model.forumPosts.filter { post in
            let matchesFilter = query.isEmpty ? (feedFilter == .all || post.kind == feedFilter) : true
            guard matchesFilter else { return false }
            guard !query.isEmpty else { return true }
            let haystack = ([post.title, post.body, post.author] + post.tags).joined(separator: " ")
            return haystack.localizedCaseInsensitiveContains(query)
        }
    }

    private var leftPosts: [ForumPost] {
        feedPosts.enumerated().filter { $0.offset % 2 == 0 }.map(\.element)
    }

    private var rightPosts: [ForumPost] {
        feedPosts.enumerated().filter { $0.offset % 2 == 1 }.map(\.element)
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 14) {
                    header
                    searchBar

                    if query.isEmpty {
                        filterRow
                        feedIntro
                    } else {
                        searchHeading
                    }

                    if feedPosts.isEmpty {
                        emptyState
                    } else {
                        postFeed
                    }

                    feedEnd
                }
                .padding(.horizontal, 18)
                .padding(.top, 10)
                .padding(.bottom, 130)
            }
            .scrollDismissesKeyboard(.interactively)
            .background(Palette.bg)
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: ForumFilter.self) { channel in
                ForumChannelView(channel: channel)
                    .environmentObject(model)
            }
        }
        .sheet(item: $selectedPost) { post in
            PostDetailSheet(post: post) { channel in
                path.append(channel)
            }
            .environmentObject(model)
            .presentationDetents([.large])
            .presentationDragIndicator(.hidden)
            .presentationCornerRadius(30)
            .presentationBackground(Palette.bg)
        }
        .sheet(item: $standalonePlace) { place in
            PlaceSheet(place: place)
                .environmentObject(model)
                .presentationDetents([.large])
                .presentationDragIndicator(.hidden)
                .presentationCornerRadius(30)
                .presentationBackground(Palette.bg)
        }
        .sheet(isPresented: $showCompose) {
            ComposePost()
                .environmentObject(model)
                .presentationDetents([.large])
                .presentationCornerRadius(30)
                .presentationBackground(Palette.bg)
        }
        #if DEBUG
        .onAppear {
            let args = ProcessInfo.processInfo.arguments
            if args.contains("-place"), let place = model.forumPlaces.first {
                standalonePlace = place
            }
            if args.contains("-compose") {
                showCompose = true
            }
            guard !launchChannelApplied else { return }
            launchChannelApplied = true
            if args.contains("-restaurant") { path.append(ForumFilter.restaurant) }
            if args.contains("-spot") { path.append(ForumFilter.spot) }
            if args.contains("-gift") { path.append(ForumFilter.gift) }
            if args.contains("-route") { path.append(ForumFilter.route) }
            if args.contains("-event") { path.append(ForumFilter.event) }
            if args.contains("-eventcompose") { path.append(ForumFilter.event) }
        }
        #endif
    }

    // MARK: Header

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 5) {
                HStack(spacing: 6) {
                    Eyebrow(text: "社区 / BEIJING")
                    DoodleView(kind: .flower, color: Palette.mustard)
                        .frame(width: 12, height: 12)
                }
                Text("大家的北京")
                    .font(.system(size: 36, weight: .black))
                    .tracking(-0.8)
                    .foregroundStyle(Palette.ink)
                Text("4,208 条笔记 · 今天新增 126 条 · 本地人也在发")
                    .font(.system(size: 9.5, weight: .medium, design: .monospaced))
                    .foregroundStyle(Palette.ink2)
            }
            Spacer()
            Button {
                Haptics.tap()
                showCompose = true
            } label: {
                Image(systemName: "square.and.pencil")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(Palette.paper)
                    .frame(width: 42, height: 42)
                    .background(Circle().fill(Palette.ink))
                    .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))
                    .compositingGroup()
                    .shadow(color: Palette.ink.opacity(0.16), radius: 0, x: 0, y: 2)
            }
            .buttonStyle(PressableButtonStyle())
            .padding(.top, 4)
        }
    }

    private var searchBar: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(Palette.ink)
            TextField("搜笔记、地点、作者", text: $model.forumSearch)
                .font(.system(size: 12, weight: .medium))
                .textFieldStyle(.plain)
                .submitLabel(.search)
            if !model.forumSearch.isEmpty {
                Button {
                    withAnimation { model.forumSearch = "" }
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 12))
                        .foregroundStyle(Palette.ink3)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 14)
        .frame(height: 44)
        .background(Capsule().fill(Palette.paper))
        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.2))
        .compositingGroup()
        .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2)
    }

    private var filterRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 7) {
                ForEach(ForumPostKind.allCases) { kind in
                    Chip(title: kind.title, selected: feedFilter == kind) {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.86)) {
                            feedFilter = kind
                        }
                    }
                }
            }
            .padding(.vertical, 1)
        }
    }

    private var feedIntro: some View {
        HStack(alignment: .firstTextBaseline, spacing: 6) {
            Circle()
                .fill(Palette.accent)
                .frame(width: 6, height: 6)
                .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 0.7))
            Text(feedFilter == .all ? "最新笔记" : "\(feedFilter.title) 笔记")
                .font(.system(size: 16, weight: .heavy))
                .foregroundStyle(Palette.ink)
            Spacer()
            Text("\(feedPosts.count) 篇 · 按发布时间")
                .font(.system(size: 8.5, weight: .medium, design: .monospaced))
                .foregroundStyle(Palette.ink3)
        }
        .padding(.top, 2)
    }

    private var searchHeading: some View {
        HStack(alignment: .firstTextBaseline) {
            Text("搜索 “\(query)”")
                .font(.system(size: 16, weight: .heavy))
                .foregroundStyle(Palette.ink)
                .lineLimit(1)
            Spacer()
            Text("\(feedPosts.count) 条笔记")
                .font(.system(size: 8.5, weight: .medium, design: .monospaced))
                .foregroundStyle(Palette.ink3)
        }
        .padding(.top, 2)
    }

    // MARK: Feed

    private var postFeed: some View {
        HStack(alignment: .top, spacing: 10) {
            LazyVStack(spacing: 10) {
                ForEach(leftPosts) { post in
                    postCard(post)
                }
            }
            LazyVStack(spacing: 10) {
                ForEach(rightPosts) { post in
                    postCard(post)
                }
            }
        }
    }

    private func postCard(_ post: ForumPost) -> some View {
        let saved = model.savedPostIDs.contains(post.id)
        return VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                PhotoTile(symbol: post.symbol, tint: post.artTint, height: post.height)
                    .overlay(alignment: .topLeading) {
                        Text(post.kind.label)
                            .font(.system(size: 7.5, weight: .bold, design: .monospaced))
                            .tracking(0.4)
                            .foregroundStyle(Palette.ink)
                            .padding(.horizontal, 7)
                            .frame(height: 20)
                            .background(Capsule().fill(Palette.paper))
                            .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1))
                            .padding(8)
                    }

                Button {
                    model.toggleSavedPost(post)
                } label: {
                    Image(systemName: saved ? "bookmark.fill" : "heart")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundStyle(saved ? Palette.accent : Palette.ink)
                        .frame(width: 27, height: 27)
                        .background(Circle().fill(Palette.paper))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))
                }
                .buttonStyle(PressableButtonStyle(scale: 0.94))
                .padding(7)
            }

            VStack(alignment: .leading, spacing: 5) {
                Text(post.title)
                    .font(.system(size: 12.5, weight: .bold))
                    .foregroundStyle(Palette.ink)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
                Text(post.body)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundStyle(Palette.ink3)
                    .lineSpacing(2)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)

                HStack(spacing: 5) {
                    Text(post.avatar)
                        .font(.system(size: 7, weight: .black))
                        .foregroundStyle(Palette.ink)
                        .frame(width: 17, height: 17)
                        .background(Circle().fill(avatarFill(post.tint)))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 0.8))
                    Text(post.author)
                        .font(.system(size: 8.5, weight: .semibold))
                        .foregroundStyle(Palette.ink2)
                        .lineLimit(1)
                    Spacer(minLength: 0)
                    Image(systemName: "heart")
                        .font(.system(size: 7, weight: .semibold))
                        .foregroundStyle(Palette.ink3)
                    Text(post.likes)
                        .font(.system(size: 8, weight: .medium, design: .monospaced))
                        .foregroundStyle(Palette.ink3)
                }
                .padding(.top, 2)
            }
            .padding(10)
        }
        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Palette.paper))
        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).strokeBorder(Palette.ink, lineWidth: 1.1))
        .compositingGroup()
        .shadow(color: Palette.ink.opacity(0.1), radius: 0, x: 0, y: 2.5)
        .contentShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .onTapGesture {
            Haptics.tap()
            selectedPost = post
        }
    }

    private var feedEnd: some View {
        VStack(spacing: 4) {
            Text("已经到底了")
                .font(.system(size: 9.5, weight: .bold))
                .foregroundStyle(Palette.ink3)
            Text("4,208 条笔记 · 下拉刷新试试")
                .font(.system(size: 8, weight: .medium, design: .monospaced))
                .foregroundStyle(Palette.ink3.opacity(0.75))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 18)
    }

    private var emptyState: some View {
        VStack(spacing: 9) {
            DoodleView(kind: .squiggle, color: Palette.ink.opacity(0.4), lineWidth: 1.5)
                .frame(width: 42, height: 12)
            Text(query.isEmpty ? "这里还没有笔记" : "没有找到「\(query)」")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Palette.ink)
            Text("换个分类，或者去「活动」发起一次 Citywalk。")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(Palette.ink3)
            LuciaLimeButton(title: "问问 Lucia", icon: "sparkles") {
                model.openAssistant("社区 · 找点灵感")
            }
            .padding(.top, 2)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 30)
    }

    private func avatarFill(_ tint: Int) -> Color {
        [Palette.pink, Palette.sky, Palette.mint, Palette.mustard, Palette.periwinkle, Palette.lime][tint % 6]
    }
}

// MARK: - Post detail

struct PostDetailSheet: View {
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    let post: ForumPost
    var onOpenChannel: (ForumFilter) -> Void = { _ in }

    @State private var selectedPlace: ForumPlace?

    private var saved: Bool { model.savedPostIDs.contains(post.id) }

    private var linkedPlace: ForumPlace? {
        guard let title = post.placeTitle else { return nil }
        return model.forumPlaces.first { $0.title == title }
    }

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 12) {
                header

                ZStack(alignment: .topLeading) {
                    PhotoTile(symbol: post.symbol, tint: post.artTint, height: 208)
                    Text(post.kind.label)
                        .font(.system(size: 8, weight: .bold, design: .monospaced))
                        .tracking(0.5)
                        .foregroundStyle(Palette.ink)
                        .padding(.horizontal, 8)
                        .frame(height: 22)
                        .background(Capsule().fill(Palette.paper))
                        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1))
                        .padding(9)
                }

                HStack(spacing: 9) {
                    Text(post.avatar)
                        .font(.system(size: 11, weight: .black))
                        .foregroundStyle(Palette.ink)
                        .frame(width: 36, height: 36)
                        .background(Circle().fill(avatarFill(post.tint)))
                        .overlay(Circle().strokeBorder(Palette.ink, lineWidth: 1))
                    VStack(alignment: .leading, spacing: 2) {
                        Text(post.author)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(Palette.ink)
                        Text("\(post.time) · 在北京")
                            .font(.system(size: 8.5, weight: .medium, design: .monospaced))
                            .foregroundStyle(Palette.ink3)
                    }
                    Spacer()
                    TagView(text: post.tags.first ?? "笔记", style: .soft)
                }

                Text(post.title)
                    .font(.system(size: 25, weight: .black))
                    .tracking(-0.4)
                    .foregroundStyle(Palette.ink)
                    .lineSpacing(1)

                Text(post.body)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(Palette.ink2)
                    .lineSpacing(4)

                HStack(spacing: 6) {
                    ForEach(post.tags, id: \.self) { tag in
                        TagView(text: tag, style: .soft)
                    }
                }

                Rectangle()
                    .fill(Palette.ink.opacity(0.12))
                    .frame(height: 1)
                    .padding(.vertical, 2)

                HStack(spacing: 14) {
                    Label(post.likes, systemImage: "heart")
                    Label(post.saves, systemImage: "bookmark")
                    Label(post.comments == 0 ? "还没有评论" : "\(post.comments) 条评论", systemImage: "bubble.left")
                }
                .font(.system(size: 9, weight: .semibold, design: .monospaced))
                .foregroundStyle(Palette.ink2)

                if !post.comment.isEmpty {
                    VStack(alignment: .leading, spacing: 5) {
                        Text(post.comments == 0 ? "作者留言" : "评论 · \(post.comments)")
                            .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                            .tracking(0.6)
                            .foregroundStyle(Palette.ink3)
                        Text(post.comment)
                            .font(.system(size: 10.5, weight: .medium))
                            .foregroundStyle(Palette.ink2)
                            .lineSpacing(2)
                    }
                    .padding(11)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(RoundedRectangle(cornerRadius: 15, style: .continuous).fill(Palette.paperWarm))
                    .overlay(RoundedRectangle(cornerRadius: 15, style: .continuous).strokeBorder(Palette.ink.opacity(0.45), lineWidth: 1))
                }

                HStack(spacing: 7) {
                    Button {
                        model.toggleSavedPost(post)
                    } label: {
                        postActionLabel(
                            title: saved ? "已收藏" : "收藏",
                            icon: saved ? "bookmark.fill" : "heart",
                            fill: Palette.lime
                        )
                    }
                    .buttonStyle(PressableButtonStyle())

                    if linkedPlace != nil {
                        Button {
                            selectedPlace = linkedPlace
                        } label: {
                            postActionLabel(title: "地点详情", icon: "mappin.and.ellipse", fill: Palette.paper)
                        }
                        .buttonStyle(PressableButtonStyle())
                    }

                    if post.routeIndex != nil {
                        Button {
                            applyRoute()
                        } label: {
                            postActionLabel(title: "套用路线", icon: "point.topleft.down.to.point.bottomright.curvepath", fill: Palette.paper)
                        }
                        .buttonStyle(PressableButtonStyle())
                    }

                    if post.eventTitle != nil {
                        Button {
                            openEventChannel()
                        } label: {
                            postActionLabel(title: "看活动", icon: "calendar", fill: Palette.paper)
                        }
                        .buttonStyle(PressableButtonStyle())
                    }
                }

                Button {
                    askLucia()
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 10, weight: .bold))
                        Text("问 Lucia 这条值不值得去")
                            .font(.system(size: 11.5, weight: .bold))
                    }
                    .foregroundStyle(Palette.paper)
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(Capsule().fill(Palette.ink))
                    .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.1))
                }
                .buttonStyle(PressableButtonStyle())
                .padding(.top, 2)

                Text(post.isMine ? "由你发布 · 内容展示给社区成员" : "发布于 Lucia 社区 · 内容来自平台用户")
                    .font(.system(size: 8.5, weight: .medium))
                    .foregroundStyle(Palette.ink3)
                    .frame(maxWidth: .infinity)
                    .padding(.top, 4)
            }
            .padding(.horizontal, 20)
            .padding(.top, 14)
            .padding(.bottom, 26)
        }
        .background(Palette.bg.ignoresSafeArea())
        .sheet(item: $selectedPlace) { place in
            PlaceSheet(place: place)
                .environmentObject(model)
                .presentationDetents([.large])
                .presentationDragIndicator(.hidden)
                .presentationCornerRadius(30)
                .presentationBackground(Palette.bg)
        }
    }

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Eyebrow(text: "\(post.kind.label) · 平台笔记")
                Text("\(post.author) 的笔记")
                    .font(.system(size: 22, weight: .black))
                    .tracking(-0.3)
                    .foregroundStyle(Palette.ink)
            }
            Spacer()
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
    }

    private func postActionLabel(title: String, icon: String, fill: Color) -> some View {
        HStack(spacing: 5) {
            Image(systemName: icon)
                .font(.system(size: 9, weight: .bold))
            Text(title)
                .font(.system(size: 10.5, weight: .bold))
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
        .foregroundStyle(Palette.ink)
        .frame(maxWidth: .infinity)
        .frame(height: 40)
        .background(Capsule().fill(fill))
        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.1))
    }

    private func avatarFill(_ tint: Int) -> Color {
        [Palette.pink, Palette.sky, Palette.mint, Palette.mustard, Palette.periwinkle, Palette.lime][tint % 6]
    }

    private func applyRoute() {
        guard let index = post.routeIndex, model.forumRoutes.indices.contains(index) else { return }
        let name = model.forumRoutes[index].title
        Haptics.success()
        Task { @MainActor in
            dismiss()
            try? await Task.sleep(nanoseconds: 250_000_000)
            model.copyRoute(named: name)
        }
    }

    private func openEventChannel() {
        Haptics.tap()
        Task { @MainActor in
            dismiss()
            try? await Task.sleep(nanoseconds: 250_000_000)
            model.forumFilter = .event
            onOpenChannel(.event)
        }
    }

    private func askLucia() {
        Haptics.tap()
        Task { @MainActor in
            dismiss()
            try? await Task.sleep(nanoseconds: 250_000_000)
            model.openAssistant("社区 · \(post.title)")
        }
    }
}
