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
        <Button className="relative rounded-full text-black hover:bg-gray-100 bg-transparent">
          <MenuIcon className="h-4 w-4  mr-2" /> Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-14">
        {items?.map(
          (item, index) =>
            item.href && (
              <DropdownMenuItem key={index}>
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
