import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { RouterExtensions } from 'nativescript-angular/router'
import { Subscription } from 'rxjs';

import { User } from "../model/user.model"

import { AppValuesService } from '../service/appvalues.service';
import { LoginService } from '../service/login.service';

@Component({
    moduleId: module.id,
    selector: 'ns-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit, OnDestroy {
    private subscription : Subscription;
    logIn: User;
    isLoginBusy: boolean = false;

    errorMessage = "";

    @ViewChild("username") username: ElementRef;
    @ViewChild("password") password: ElementRef;
    @ViewChild("dob") dob: ElementRef;

    constructor(
        private appValuesService: AppValuesService,
        private loginService: LoginService,
        private router: RouterExtensions,
    ) { }

    ngOnInit() {
        this.logIn = new User();

        // this.logIn.username = 'parent';
        // this.logIn.password = 'parent';
        // this.logIn.birthdate = '01/01/1950';

        // this.logIn.username = 'student1';
        // this.logIn.password = 'password';
        // this.logIn.birthdate = '02/03/2001';

        // this.logIn.username = '1';
        // this.logIn.password = '1';
        // this.logIn.birthdate = '1';

        // this.logIn.username = 'parent1';
        // this.logIn.password = 'parent';
        // this.logIn.birthdate = '01/02/1950';

        // this.login();
    }

    ngOnDestroy() {
        if (this.subscription != undefined) {
            this.subscription.unsubscribe();
        }
    }

    forgotPassword() {
        this.router.navigate([`forgotpassword`]);
    }

    login() {
        if(!this.isLoginBusy) {
            this.isLoginBusy = true;
            this.errorMessage = "";
            let isValid = this.validInput(this.logIn);

            if (isValid != false) {
                this.subscription = this.loginService.getUser(this.logIn)
                    .subscribe(user => {
                        const isSuccessful = this.checkUser(user);
                        if(!isSuccessful) {
                            this.isLoginBusy = false;
                        }
                    })
            } else {
                this.isLoginBusy = false;
            }
        }
    }

    private validInput(logIn): boolean {
        if ((!logIn.username) || (!logIn.password) || (!logIn.birthdate)) {
            this.errorMessage = "Required fields";
            if (!logIn.username) {
                this.username.nativeElement.borderColor = "red";
            }

            if (!logIn.password) {
                this.password.nativeElement.borderColor = "red";
            }

            if (!logIn.birthdate) {
                this.dob.nativeElement.borderColor = "red";
            }

            return false;
        }

        return true;
    }

    private checkUser(login: User): boolean {
        if ((login === undefined) ||
            (login.username != this.logIn.username) ||
            (login.password != this.logIn.password) ||
            (login.birthdate != this.logIn.birthdate)) {
            this.errorMessage = "User not found";
            return false;
        } else {
            this.appValuesService.setLoggedInUser(login);

            if(login.isfirsttime) {
                this.router.navigate([`updatesecuritydetails`]);
            } else {
                this.router.navigate([`dashboard`]);
                setTimeout(() => {this.router.navigate([`advert`])}, 200);
            }
        }

        return true;
    }
}
