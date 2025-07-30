import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-register',
    templateUrl  : './register.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthRegisterComponent implements OnInit
{
    @ViewChild('registerNgForm') registerNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    registerForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    )
    {
    }

    ngOnInit(): void
    {
        this.registerForm = this._formBuilder.group({
            name      : ['', Validators.required],
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', [Validators.required, Validators.minLength(8)]],
            role      : ['student', Validators.required],
            company   : [''],
            agreements: ['', Validators.requiredTrue]
        });
    }

    register(): void
    {
        if ( this.registerForm.invalid )
        {
            return;
        }
        this.registerForm.disable();
        this.showAlert = false;
        const { name, email, password, role, company } = this.registerForm.value;
        this._authService.signUp({ name, email, password, company, role })
            .subscribe(
                (response) => {
                    this._router.navigateByUrl('/confirmation-required');
                },
                (error) => {
                    this.registerForm.enable();
                    this.registerNgForm.resetForm();
                    this.alert = {
                        type   : 'error',
                        message: error?.error?.error || 'Something went wrong, please try again.'
                    };
                    this.showAlert = true;
                }
            );
    }
}
