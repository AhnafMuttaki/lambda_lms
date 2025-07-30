import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';
import { AuthRegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { registerRoutes } from './register.routing';

@NgModule({
    declarations: [AuthRegisterComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
        RouterModule.forChild(registerRoutes)
    ]
})
export class RegisterModule {}
