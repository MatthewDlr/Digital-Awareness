import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
// @ts-ignore
import nightwind from 'nightwind/helper';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

nightwind.initNightwind();
