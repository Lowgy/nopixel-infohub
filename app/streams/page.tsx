'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface AccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface Stream {
  id: string;
  tags: string[] | [];
  thumbnail_url: string;
  title: string;
  type: string;
  display_name: string;
  broadcaster_login: string;
  user_id: string;
}

interface User {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

export default function Streams() {
  const [accessToken, setAccessToken] = useState<AccessToken | null>(null);
  const [streams, setStreams] = useState<Stream[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [refreshingToken, setRefreshingToken] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const isTokenExpired = () => {
    if (!accessToken) return true;
    const now = new Date();
    return now.getTime() > accessToken.expires_in;
  };

  const getNPStreams = async () => {
    setLoading(true);
    const token = await refreshAccessToken();
    if (token) {
      fetch(
        'https://api.twitch.tv/helix/search/channels?query=NoPixel&first=100&live_only=true&sort=views&game_id=32982',
        {
          method: 'GET',
          headers: {
            'Client-Id': `${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const filteredStreams = data.data.filter(
            (stream: Stream) =>
              stream.title.includes('NoPixel') ||
              stream.title.includes('nopixel') ||
              stream.title.includes('NP 4.0') ||
              stream.title.includes('np 4.0') ||
              stream.title.includes('No Pixel 4.0') ||
              stream.title.includes('NOPIXEL') ||
              stream.title.includes('NOPIXEL 4.0')
          );
          setStreams(filteredStreams);
          const userIds = filteredStreams.map((stream: Stream) => stream.id);
          getUsers(userIds, token.access_token);
          setLoading(false);
        });
    }
  };

  const getUsers = async (userIds: string[], accessToken: string) => {
    const response = await fetch(
      `https://api.twitch.tv/helix/users?id=${userIds.join('&id=')}`,
      {
        method: 'GET',
        headers: {
          'Client-Id': `${process.env.NEXT_PUBLIC_TTWITCH_CLIENT_ID}`,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userData = await response.json();
    setUsers(userData.data);
  };

  const refreshAccessToken = async () => {
    if (refreshingToken || !isTokenExpired()) {
      return accessToken;
    }

    try {
      setRefreshingToken(true);
      const response = await fetch('/api/refresh-token');
      const data = await response.json();

      // Assuming the response contains a valid access token
      setAccessToken(data);
      return data;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null; // Handle the error appropriately
    } finally {
      setRefreshingToken(false);
    }
  };

  useEffect(() => {
    refreshAccessToken();
    getNPStreams();
  }, []);

  return (
    <main className="flex flex-col min-h-screen p-24 space-y-12 bg-[#111827]">
      <div className="flex flex-col pl-6 text-white">
        <h1 className="text-4xl font-bold">NoPixel 4.0 Streams</h1>
        <div className="flex flex-col">
          <p>
            Note: This only includes streams that are live on Twitch, have their
            game set to GTA V and have some form of NoPixel 4.0 in their title
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {loading && (
          <div className="flex justify-center ">
            {/* Change the loading spinner to a different style */}
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-green-400"></div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {streams?.map((stream, index) => (
            <div
              key={stream.id}
              className="p-2 rounded bg-gradient-to-r from-blue-400 to-emerald-400 flex flex-col w-[px]"
            >
              <Image
                alt="Profile Image"
                src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${stream.broadcaster_login.toLowerCase()}-${320}x${180}.jpg`}
                width={320}
                height={180}
              />
              <div className="flex flex-col">
                <div className="flex flex-row p-1">
                  <div className="flex flex-col items-center justify-center">
                    <Avatar>
                      {users && users[index] ? (
                        <AvatarImage
                          src={streams[index].thumbnail_url}
                          width={48}
                          height={48}
                          loading="lazy"
                        />
                      ) : null}
                    </Avatar>
                  </div>
                  <div className="flex flex-col p-2">
                    <h1 className="font-bold line-clamp-1">{stream.title}</h1>
                    <p>{stream.display_name}</p>
                  </div>
                </div>
                <Button asChild>
                  <Link
                    href={`https://twitch.tv/${stream.display_name}`}
                    target="_blank"
                  >
                    Watch on Twitch
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
