"use client";

import { useEffect, useRef, useState } from "react";
import ZoomVideo, {
  type VideoClient,
  VideoQuality,
  type VideoPlayer,
} from "@zoom/videosdk";
import { CameraButton, MicButton } from "./MuteButtons";
import { PhoneOff } from "lucide-react";
import { Button } from "./ui/button";

const Videochat = (props: { slug: string; JWT: string }) => {
  const session = props.slug;
  const jwt = props.JWT;
  const [inSession, setInSession] = useState(false);
  const client = useRef<typeof VideoClient>(ZoomVideo.createClient());
  const [participants, setParticipants] = useState<any[]>([]);
  const videoRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const getUserName = () => {
    if (typeof window === 'undefined') return 'Anonymous';
    const params = new URLSearchParams(window.location.search);
    return params.get('name') || 'Anonymous';
  };

  useEffect(() => {
    if (!inSession) return;

    const zmClient = client.current;
    const mediaStream = zmClient.getMediaStream();

    const updateParticipants = () => {
      const users = zmClient.getAllUser();
      setParticipants(users);

      users.forEach(async (user) => {
        const container = videoRefs.current.get(user.userId);
        if (user.bVideoOn && container) {
          try {
            const videoElement = await mediaStream.attachVideo(user.userId, VideoQuality.Video_360P);
            container.innerHTML = ""; // clear existing
            container.appendChild(videoElement as VideoPlayer);
          } catch (err) {
            console.warn("Attach failed for", user.displayName, err);
          }
        }
      });
    };

    zmClient.on("user-added", updateParticipants);
    zmClient.on("user-removed", updateParticipants);
    zmClient.on("user-updated", updateParticipants);
    updateParticipants();

    return () => {
      zmClient.off("user-added", updateParticipants);
      zmClient.off("user-removed", updateParticipants);
      zmClient.off("user-updated", updateParticipants);
    };
  }, [inSession]);

  const joinSession = async () => {
    await client.current.init("en-US", "Global", { patchJsMedia: true });
    await client.current.join(session, jwt, getUserName()).catch((e) => console.log(e));
    setInSession(true);
    const mediaStream = client.current.getMediaStream();
    await mediaStream.startAudio();
    await mediaStream.startVideo();
  };

  const leaveSession = async () => {
    await client.current.leave().catch((e) => console.log("leave error", e));
    window.location.href = "/";
  };

  return (
    <div className="relative flex h-full w-full flex-1 flex-col">
      <h1 className="text-center text-3xl font-bold mb-4 mt-0">
        Session: {session}
      </h1>

      {inSession && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto">
          {participants.map((user) => (
            <div
              key={user.userId}
              className="relative aspect-[16/9] w-full rounded-[16px] overflow-hidden bg-black"
            >
              {/* @ts-expect-error html element */}
              <video-player-container
                ref={(el: HTMLDivElement | null) => {
                if (el) videoRefs.current.set(user.userId, el);
              }}

                className="absolute inset-0 z-0"
              />
              <div className="absolute bottom-6 left-6 z-10 text-white text-sm flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-full shadow backdrop-blur-sm">
                <span className="font-medium">{user.displayName}</span>
                <span className="text-xs">{user.bVideoOn ? "🎥" : "📷"}</span>
                <span className="text-xs">{!user.muted ? "🎤" : "🔇"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!inSession ? (
        <div className="mx-auto flex w-64 flex-col self-center">
          <Button className="flex flex-1" onClick={joinSession} title="join session">
            Join
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col justify-around self-center">
          <div className="mt-4 flex w-[30rem] flex-1 justify-around self-center rounded-md bg-white p-4">
            <CameraButton
              client={client}
              isVideoMuted={false} // simplified
              setIsVideoMuted={() => {}}
              renderVideo={async () => {}}
            />
            <MicButton
              isAudioMuted={false} // simplified
              client={client}
              setIsAudioMuted={() => {}}
            />
            <Button onClick={leaveSession} title="leave session">
              <PhoneOff />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videochat;

const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');