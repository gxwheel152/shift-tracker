// import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule } from './app.routes';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    BrowserModule,
    // HttpClientModule,
    // AppRoutingModule
  ],
  declarations: [
    // Add your components here
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],

  // providers: [
  //   // Add your services here
  // ],
  bootstrap: [
    // Add your root component here
  ],
})
export class AppModule {}
