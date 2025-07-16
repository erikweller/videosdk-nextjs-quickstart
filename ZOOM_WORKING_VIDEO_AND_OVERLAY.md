✅ CareVillage Zoom Video Tile Layout (Final Working Reference)

This is the stable, production-ready architecture for rendering Zoom Video SDK participants with live video, overlays, and perfect container scoping. Use this as a blueprint for all future video grid work.

1. ✅ Rendering Zoom Video Per Participant

Each participant gets their own container:

<div
  key={user.userId}
  className="relative aspect-[16/9] w-full rounded-[16px] overflow-hidden bg-black"
>
  {/* @ts-expect-error Zoom accepts this */}
  <video-player-container
    ref={(el: HTMLDivElement | null) => {
      if (el) videoRefs.current.set(user.userId, el);
    }}
    className="absolute inset-0 z-0"
  />

Attaching video:

const canvas = await mediaStream.attachVideo(user.userId, VideoQuality.Video_360P);
const container = videoRefs.current.get(user.userId);
if (container) {
  container.innerHTML = "";
  container.appendChild(canvas as VideoPlayer);
}

2. ✅ Locking Overlays to Container

Overlays are positioned inside each video container:

<div className="absolute bottom-6 left-6 z-10 text-white text-sm flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-full shadow backdrop-blur-sm">
  <span className="font-medium">{user.displayName}</span>
  <span className="text-xs">{user.bVideoOn ? "🎥" : "📷"}</span>
  <span className="text-xs">{!user.muted ? "🎤" : "🔇"}</span>
</div>

Container must be relative

Overlay must be absolute and scoped within

Use rounded-[16px] + overflow-hidden to clip canvas and overlay

3. ✅ Grid Layout for Multi-Participant Support

<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
  {participants.map((user) => (
    ...individual video container with overlay...
  ))}
</div>

Responsive layout

Overlays and containers adjust naturally

No floating overlay bugs when grid shifts

4. 🧠 Zoom SDK Compatibility Principles

Rule

Description

✅ One container per user

No shared DOM for video streams

✅ Append video manually

Use attachVideo() + appendChild()

✅ Never abstract container away

Don’t wrap in custom React components

✅ Absolute overlays only inside relative container

Prevents drifting

✅ overflow-hidden clips everything properly