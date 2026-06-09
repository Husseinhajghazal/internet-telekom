"use client";

import React, { useEffect, useRef } from "react";

// Load the YouTube IFrame API once and share the same promise across embeds.
let youtubeApiPromise = null;
const loadYouTubeApi = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    });
  }
  return youtubeApiPromise;
};

/**
 * YouTube embed that reports when playback starts via `onPlay`.
 * Falls back to a plain iframe if the API fails to load.
 */
const YouTubeEmbed = ({ videoId, className = "", title = "", onPlay }) => {
  const targetRef = useRef(null);
  const playerRef = useRef(null);
  const onPlayRef = useRef(onPlay);
  onPlayRef.current = onPlay;

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !targetRef.current) return;
      playerRef.current = new YT.Player(targetRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0 },
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              onPlayRef.current?.();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [videoId]);

  return (
    <div className={className}>
      <div ref={targetRef} title={title} className="w-full h-full" />
    </div>
  );
};

export default YouTubeEmbed;
