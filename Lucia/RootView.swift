import SwiftUI

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        ZStack(alignment: .bottom) {
            Palette.bg.ignoresSafeArea()

            content
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            bottomControls

            if let toast = model.toast {
                ToastBanner(toast: toast)
                    .padding(.leading, 20)
                    .padding(.bottom, model.tab == .trip && model.planBuilt ? 158 : 104)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .allowsHitTesting(false)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .zIndex(6)
            }
        }
        .fullScreenCover(isPresented: $model.checklistOpen) {
            ChecklistView()
                .environmentObject(model)
                .preferredColorScheme(.light)
        }
        .sheet(isPresented: $model.assistantOpen) {
            AssistantView()
                .environmentObject(model)
                .preferredColorScheme(.light)
                .presentationDetents([.large])
                .presentationDragIndicator(.hidden)
                .presentationCornerRadius(30)
                .presentationBackground(Palette.bg)
        }
        .sheet(isPresented: $model.notesOpen) {
            NotesPoster()
                .environmentObject(model)
                .preferredColorScheme(.light)
                .presentationDetents([.large])
                .presentationDragIndicator(.hidden)
                .presentationCornerRadius(30)
                .presentationBackground(Palette.bg)
        }
        .task {
            #if DEBUG
            if ProcessInfo.processInfo.arguments.contains("-noassistant") { return }
            #endif
            guard model.onboarding, !model.assistantOpen else { return }
            try? await Task.sleep(for: .milliseconds(450))
            guard !model.assistantOpen, !model.notesOpen, !model.checklistOpen else { return }
            if model.chatMessages.isEmpty {
                model.seedAssistant()
            }
            model.assistantOpen = true
        }
    }

    @ViewBuilder
    private var content: some View {
        switch model.tab {
        case .trip:
            TripView()
        case .plan:
            PlanView()
        case .forum:
            ForumView()
        case .translate:
            TranslateView()
        case .me:
            MeView()
        }
    }

    private var bottomControls: some View {
        HStack(alignment: .center, spacing: 8) {
            FloatingTabBar()
            AssistantOrb()
        }
        .padding(.horizontal, 14)
        .padding(.bottom, 2)
        .zIndex(5)
    }
}
