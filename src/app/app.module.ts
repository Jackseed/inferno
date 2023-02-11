import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

// AngularFire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { LoginComponent } from './auth/login/login.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormComponent } from './games/form/form.component';
import { ViewComponent } from './games/view/view.component';
import { ListComponent } from './games/list/list.component';
import { MenuComponent } from './games/menu/menu.component';

@NgModule({
  declarations: [AppComponent, CanvasComponent, LoginComponent, FormComponent, ViewComponent, ListComponent, MenuComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
