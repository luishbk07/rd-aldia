import { NextResponse } from "next/server";

export const revalidate = 3600;

const CHANNEL_URL = "https://www.youtube.com/@rutadelinversorinteligente";
const PLAYLIST_ID = "UUEKoxNeQWrGhtlAH48ELN3g";
const YOUTUBE_PLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlistItems";

function thumbnailFromSnippet(snippet) {
  const thumbs = snippet?.thumbnails || {};
  return (
    thumbs.maxres?.url ||
    thumbs.standard?.url ||
    thumbs.high?.url ||
    thumbs.medium?.url ||
    thumbs.default?.url ||
    ""
  );
}

function mapPlaylistItem(item) {
  const snippet = item?.snippet;
  const videoId = snippet?.resourceId?.videoId;
  const title = String(snippet?.title || "").trim();
  if (!videoId || !title) return null;
  if (/^private video$/i.test(title) || /^deleted video$/i.test(title)) {
    return null;
  }
  return {
    videoId,
    title,
    thumbnail: thumbnailFromSnippet(snippet),
  };
}

function pickRandom(videos) {
  return videos[Math.floor(Math.random() * videos.length)];
}

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Falta YOUTUBE_API_KEY." },
      { status: 500 },
    );
  }

  const url = new URL(YOUTUBE_PLAYLIST_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", PLAYLIST_ID);
  url.searchParams.set("maxResults", "50");
  url.searchParams.set("key", key);

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudieron cargar los videos." },
        { status: 502 },
      );
    }

    const payload = await response.json();
    const videos = (payload.items || []).map(mapPlaylistItem).filter(Boolean);
    if (!videos.length) {
      return NextResponse.json(
        { error: "El canal no tiene videos públicos." },
        { status: 404 },
      );
    }

    const current = pickRandom(videos);
    return NextResponse.json(
      {
        videoId: current.videoId,
        title: current.title,
        thumbnail: current.thumbnail,
        channelUrl: CHANNEL_URL,
        videos,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar los videos." },
      { status: 500 },
    );
  }
}
