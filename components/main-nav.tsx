import Image from 'next/image';
import Link from 'next/link';

import { NavItem } from '@/types/nav';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface MainNavProps {
  items?: NavItem[];
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

export function MainNav({ items }: MainNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative rounded-full text-black bg-gradient-to-r from-blue-400 to-emerald-400 ">
          <MenuIcon className="h-4 w-4  mr-2" /> Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-14 border-none bg-gradient-to-r from-blue-400 to-emerald-400">
        {items?.map(
          (item, index) =>
            item.href && (
              <DropdownMenuItem
                key={index}
                className="bg-gradient-to-r from-blue-400 to-emerald-400 hover:text-white"
              >
                <Link href={item.href}>
                  <span>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
