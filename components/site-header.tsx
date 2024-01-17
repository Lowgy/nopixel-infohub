import { siteConfig } from '@/config/site';
import { MainNav } from './main-nav';

export function SiteHeader() {
  return (
    <header className="absolute top-0 right-10 mt-4 mr-10">
      <div className="flex items-center justify-end space-y-2">
        <div className="flex items-center space-x-2">
          <MainNav items={siteConfig.mainNav} />
        </div>
      </div>
    </header>
  );
}
