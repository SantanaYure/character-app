import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared Components
import { ModalComponent } from './shared/components/modal/modal.component';
import { FabButtonComponent } from './shared/components/fab-button/fab-button.component';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

// Feature Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CharacterListComponent } from './features/character-list/character-list.component';
import { CharacterDetailsComponent } from './features/character-details/character-details.component';
import { CharacterFormComponent } from './features/character-form/character-form.component';

@NgModule({
  declarations: [
    AppComponent,
    // Shared Components
    ModalComponent,
    FabButtonComponent,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    // Feature Components
    DashboardComponent,
    CharacterListComponent,
    CharacterDetailsComponent,
    CharacterFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
