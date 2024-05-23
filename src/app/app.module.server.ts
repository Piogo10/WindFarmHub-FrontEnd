import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
