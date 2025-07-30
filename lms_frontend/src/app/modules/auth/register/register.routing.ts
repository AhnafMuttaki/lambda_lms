import { Route } from '@angular/router';
import { AuthRegisterComponent } from './register.component';

export const registerRoutes: Route[] = [
    {
        path     : '',
        component: AuthRegisterComponent
    }
];
