'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CountdownTimer from '@/components/countdown-timer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useSWR from 'swr';

const allowHours = [1, 13]; // 1 for 1am, 13 for 1pm
const publicHours = [6, 14, 22]; // 6 for 6am, 14 for 2pm, 22 for 10pm

// Function to find the closest countdown time
const findClosestCountdown = (hoursArray: number[]) => {
  const currentHours = new Date().getHours();
  let targetHour = hoursArray[0];

  for (let i = 0; i < hoursArray.length; i++) {
    if (hoursArray[i] > currentHours) {
      targetHour = hoursArray[i];
      break;
    }
  }

  return targetHour;
};

const closestAllowCountdown = findClosestCountdown(allowHours);
const closestPublicCountdown = findClosestCountdown(publicHours);

//Test Data for now to see the layout of page
const servers = [
  {
    title: 'NoPixel 4.0 - Allow List (NA)',
    tabTitle: 'Allow List',
    tabValue: 'whitelist',
    status: 'Online',
    currentPlayerCount: 220,
    totalPlayerCount: 220,
    tsunami: <CountdownTimer targetHour={closestAllowCountdown} />,
  },
  {
    title: 'NoPixel 4.0 - Public - Blue (NA)',
    tabTitle: 'Public - Blue',
    tabValue: 'public-blue',
    status: 'Online',
    currentPlayerCount: 220,
    totalPlayerCount: 220,
    tsunami: <CountdownTimer targetHour={closestPublicCountdown} />,
  },
  {
    title: 'NoPixel 4.0 - Public - Green (NA)',
    tabTitle: 'Public - Green',
    tabValue: 'public-green',
    status: 'Online',
    currentPlayerCount: 220,
    totalPlayerCount: 220,
    tsunami: <CountdownTimer targetHour={closestPublicCountdown} />,
  },
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function Home() {
  const [currentServer, setCurrentServer] = useState('whitelist');
  const [serverData, setServerData] = useState('');

  // Need to make these maniuplate the data structure above
  const {
    data: playerData,
    error: playerError,
    isLoading: playerLoading,
  } = useSWR(`/api/players/${currentServer}`, fetcher, {
    refreshWhenHidden: true,
    refreshInterval: 10000,
  });

  const {
    data: infoData,
    error: infoError,
    isLoading: infoLoading,
  } = useSWR(`/api/info/${currentServer}`, fetcher, {
    refreshWhenHidden: true,
    refreshInterval: 10000,
  });

  useEffect(() => {}, [currentServer]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-12 bg-[#111827]">
      <div className="flex flex-col items-center w-1/2 bg-white rounded-lg p-5">
        <h1 className="font-bold text-3xl mb-4">NoPixel InfoHub</h1>
        <p className="text-center mb-2">
          Welcome to NoPixel InfoHub! Your #1 source for server status of
          NoPixel 4.0 servers! The purpose of this site is to provide a quick
          look at the status of the NoPixel 4.0 servers, to help RPers and
          viewers alike to see if the server is online, current player count and
          tsunami timer.
        </p>
        <p className="font-bold text-red-600 text-center">
          THIS SITE IS NO AFFILIATED WITH OFFICIAL NOPIXEL AND IS STRICTLY A
          SIDE PROJECT FOR DEVELOPMENT PRACTICE!
        </p>
      </div>
      <div className="flex flex-col w-full">
        <Tabs defaultValue="whitelist">
          <TabsList>
            {servers.map((server) => (
              <TabsTrigger
                key={server.tabValue}
                value={server.tabValue}
                onClick={() => setCurrentServer(server.tabValue)}
              >
                {server.tabTitle}
              </TabsTrigger>
            ))}
          </TabsList>
          {servers.map((server) => (
            <TabsContent key={server.tabValue} value={server.tabValue}>
              <Card className="w-full bg-gradient-to-r from-blue-400 to-emerald-400">
                <CardHeader>
                  <CardTitle>{server.title}</CardTitle>
                  <CardDescription
                    className={` font-bold
                      ${
                        server.status === 'Online'
                          ? 'text-green-400'
                          : 'text-red-600'
                      }
                    `}
                  >
                    <span className="font-bold text-black">Status:</span>{' '}
                    {server.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    {/* <Image
                      src="/images/np-logo.png"
                      alt="NoPixel Logo"
                      width={128}
                      height={128}
                    /> */}
                    Image of some sort?
                    <p className="text-2xl font-bold">
                      {playerData !== undefined
                        ? playerData.length <= 220
                          ? playerData.length
                          : '220'
                        : '220'}{' '}
                      /{' '}
                      {infoData !== undefined
                        ? infoData.vars.sv_maxClients !== 8
                          ? infoData.vars.sv_maxClients
                          : '220'
                        : '220'}
                    </p>
                    <p className="text-xl font-bold">Players Online</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between">
                    <span className="font-bold text-black">Tsunami Timer:</span>{' '}
                    {server.tsunami}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
      </div>
    </main>
  );
}
