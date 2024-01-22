"use client";
import Image from 'next/image';
import CountdownTimer from '../components/CountdownTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const targetHours = [2, 14]; // 1 for 1am, 13 for 1pm

  const findClosestCountdown = () => {
    const currentTimestamp = new Date().getTime();
    const countdowns = targetHours.map((hour) => {
      const targetTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        hour,
        0,
        0,
        0
      );

      // If the target time is in the past for today, set it for tomorrow
      if (currentTimestamp > targetTime.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      return targetTime.getTime() - currentTimestamp;
    });

    return Math.min(...countdowns.filter((countdown) => countdown > 0));
  };
  
const closestCountdown = findClosestCountdown();

//Test Data for now to see the layout of page
const servers = [
  {
    title: 'NoPixel 4.0 - Allow List (NA)',
    tabTitle: 'Allow List',
    tabValue: 'whitelist',
    status: 'Online',
    currentPlayerCount: 220,
    totalPlayerCount: 220,
    // Convert the string to calculate the time difference until 1AM and 1PM CST
    tsunami: <CountdownTimer targetHour={closestCountdown === 2 ? 2 : 14} />,
  },
  {
    title: 'NoPixel 4.0 - Public - Blue (NA)',
    tabTitle: 'Public - Blue',
    tabValue: 'public-blue',
    status: 'Online',
    currentPlayerCount: 220,
    totalPlayerCount: 220,
    // Convert the string to calculate the time difference until 6AM, 2PM, and 10PM CST
    tsunami: '1 hour',
  },
  {
    title: 'NoPixel 4.0 - Public - Green (NA)',
    tabTitle: 'Public - Green',
    tabValue: 'public-green',
    status: 'Online',
    currentPlayerCount: 220,
    totalPlayerCount: 220,
    // Convert the string to calculate the time difference until 6AM, 2PM, and 10PM CST
    tsunami: '1 hour',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-r space-y-12 from-blue-400 to-emerald-400">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-3xl">NoPixel InfoHub</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </p>
      </div>
      <div className="flex flex-col w-full">
        <Tabs defaultValue="whitelist">
          <TabsList>
            {servers.map((server) => (
              <TabsTrigger key={server.tabValue} value={server.tabValue}>
                {server.tabTitle}
              </TabsTrigger>
            ))}
          </TabsList>
          {servers.map((server) => (
            <TabsContent key={server.tabValue} value={server.tabValue}>
              <Card className="w-full">
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
                    <span className="font-bold text-gray-500">Status:</span>{' '}
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
                      {server.currentPlayerCount} / {server.totalPlayerCount}
                    </p>
                    <p className="text-xl font-bold">Players Online</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p>
                    <span className="font-bold text-gray-500">
                      Tsunami Timer:
                      </span>{' '}
                      {server.tsunami}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
