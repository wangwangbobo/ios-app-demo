import SwiftUI

struct TripView: View {
    @EnvironmentObject private var model: AppModel
    @State private var expandedPlan = 0

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                header
                todaySection
                plansSection
            }
            .padding(.horizontal, 20)
            .padding(.top, 10)
            .padding(.bottom, 130)
        }
    }

    // MARK: Header

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Eyebrow(text: "我的旅行 / BEIJING")
                    DoodleView(kind: .sparkle, color: Palette.accent)
                        .frame(width: 9, height: 9)
                }
                HStack(alignment: .firstTextBaseline, spacing: 9) {
                    Text("北京")
                        .font(.system(size: 44, weight: .black))
                        .tracking(-1)
                        .foregroundStyle(Palette.ink)
                    TagView(text: "4 天 3 晚", style: .accent)
                }
                Text("10/15 – 10/18 · 2 人同行")
                    .font(.system(size: 10.5, weight: .medium, design: .monospaced))
                    .foregroundStyle(Palette.ink2)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 8) {
                HStack(spacing: 7) {
                    IconCircleButton(icon: "bell", size: 36) {
                        model.openAssistant("行程 · 通知与提醒")
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
                Text("今天 · 第 1 天")
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundStyle(Palette.ink2)
            }
        }
    }

    // MARK: Today

    private var todaySection: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeading(title: "当日信息", index: "01", trailing: "10/15 · 周三")

            VStack(spacing: 0) {
                ZStack(alignment: .topLeading) {
                    CityScape()
                        .frame(height: 196)
                    HStack(alignment: .top) {
                        HStack(spacing: 5) {
                            Image(systemName: "sun.max.fill")
                                .font(.system(size: 11))
                                .foregroundStyle(Palette.accent)
                            Text("22°")
                                .font(.system(size: 12, weight: .black))
                            Text("晴 · 11–22°")
                                .font(.system(size: 9.5, weight: .medium))
                                .opacity(0.7)
                        }
                        .foregroundStyle(Palette.ink)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 7)
                        .background(Capsule().fill(Palette.paper))
                        .overlay(Capsule().strokeBorder(Palette.ink, lineWidth: 1.1))

                        Spacer()

                        TagView(text: "今天 · 第 1 天 / 4", style: .dark)
                    }
                    .padding(12)
                }
                .frame(height: 196)
                .clipped()

                HStack(alignment: .center, spacing: 12) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("中轴线 · 故宫与胡同")
                            .font(.system(size: 17, weight: .heavy))
                            .foregroundStyle(Palette.ink)
                        HStack(spacing: 12) {
                            Label("6 站", systemImage: "mappin.and.ellipse")
                            Label("4.2 km", systemImage: "figure.walk")
                            Label("约 5 小时", systemImage: "clock")
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
                    todayFact(icon: "ticket", title: "故宫 09:00", detail: "已预约 · 午门进") {
                        model.openAssistant("门票 · 故宫 10/15 09:00")
                    }
                    factDivider
                    todayFact(icon: "sun.max", title: "11° – 22°", detail: "早晚温差 11℃") {
                        model.openAssistant("天气 · 北京 10/15")
                    }
                    factDivider
                    todayFact(icon: "clock", title: "日落 17:18", detail: "景山万春亭") {
                        model.openAssistant("行程 · 今日日落 17:18")
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

    // MARK: Plans

    private var plansSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeading(title: "旅行计划", index: "02", trailing: "问 Lucia") {
                model.openAssistant("行程 · 调整旅行计划")
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
                                Text("打开地图")
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
                            model.openAssistant("行程 · \(plan.title)")
                        } label: {
                            HStack(spacing: 3) {
                                Text("问 Lucia")
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

                        Text("\(plan.stops.count) 个停留点")
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
        date: "10/15", week: "周三", day: 1,
        title: "中轴线 · 故宫与胡同",
        meta: "6 站 · 4.2 km · 约 5 小时",
        tag: "今天", tagStyle: .accent,
        stops: [
            TripStop(name: "天安门广场", time: "09:00"),
            TripStop(name: "故宫博物院", time: "09:40"),
            TripStop(name: "景山万春亭", time: "12:30"),
            TripStop(name: "什刹海", time: "15:00"),
            TripStop(name: "南锣鼓巷", time: "16:30"),
            TripStop(name: "钟鼓楼", time: "17:30")
        ],
        note: "故宫 09:00 已预约 · 午门进，神武门出"
    ),
    TripPlanDay(
        date: "10/16", week: "周四", day: 2,
        title: "长城一日 · 八达岭",
        meta: "3 站 · 包车往返 · 约全天",
        tag: "已约车", tagStyle: .blue,
        stops: [
            TripStop(name: "酒店出发", time: "07:30"),
            TripStop(name: "八达岭长城", time: "09:00"),
            TripStop(name: "奥森公园", time: "16:30")
        ],
        note: "带身份证 · 山上风大，加一件外套"
    ),
    TripPlanDay(
        date: "10/17", week: "周五", day: 3,
        title: "皇家园林 · 颐和园与国博",
        meta: "4 站 · 地铁 4 号线 · 约 8 小时",
        tag: "门票待约", tagStyle: .soft,
        stops: [
            TripStop(name: "颐和园", time: "09:00"),
            TripStop(name: "五道口午餐", time: "12:30"),
            TripStop(name: "国家博物馆", time: "14:00"),
            TripStop(name: "前门大街", time: "18:00")
        ],
        note: "国博需提前实名预约，记得带身份证"
    ),
    TripPlanDay(
        date: "10/18", week: "周六", day: 4,
        title: "胡同慢走 · 返程",
        meta: "4 站 · 步行 3.1 km · 约 4 小时",
        tag: "返程", tagStyle: .ok,
        stops: [
            TripStop(name: "南锣鼓巷", time: "09:30"),
            TripStop(name: "钟鼓楼", time: "11:00"),
            TripStop(name: "稻香村采购", time: "13:00"),
            TripStop(name: "首都机场", time: "16:00")
        ],
        note: "航班 18:40 · 提前 2.5 小时到机场"
    )
]
